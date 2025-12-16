import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function base64DecodeFlexible(b64: string) {
  // supports normal base64 + url-safe base64
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf-8");
}

function hmacSha256Base64(message: string, secretKey: string) {
  return crypto.createHmac("sha256", secretKey).update(message).digest("base64");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // ePay v2 success redirect gives base64-encoded response params
    // Docs: "response parameters encoded in Base64" :contentReference[oaicite:1]{index=1}
    const dataParam = searchParams.get("data");

    if (!dataParam) {
      return NextResponse.json(
        { verified: false, error: "Missing data parameter from eSewa redirect" },
        { status: 400 }
      );
    }

    // Use SERVER env vars. If you insist on NEXT_PUBLIC, it still works server-side,
    // but it's a security facepalm.
    const productCode =
      process.env.ESEWA_MERCHANT_CODE || process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE;
    const secretKey =
      process.env.ESEWA_SECRET_KEY || process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY;

    if (!productCode || !secretKey) {
      return NextResponse.json(
        { verified: false, error: "Server misconfigured: missing eSewa credentials" },
        { status: 500 }
      );
    }

    // 1) Decode base64 -> JSON
    const decodedStr = base64DecodeFlexible(dataParam);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = JSON.parse(decodedStr);
    } catch {
      return NextResponse.json(
        { verified: false, error: "Decoded data is not valid JSON", raw: decodedStr },
        { status: 400 }
      );
    }

    // decoded should contain: signed_field_names + signature
    // Docs show these fields on success response :contentReference[oaicite:2]{index=2}
    const signedFieldNames: string = decoded?.signed_field_names;
    const receivedSignature: string = decoded?.signature;

    if (!signedFieldNames || !receivedSignature) {
      return NextResponse.json(
        { verified: false, error: "Missing signed_field_names/signature in decoded data", decoded },
        { status: 400 }
      );
    }

    // 2) Verify signature integrity
    // Signature input must follow signed_field_names order, formatted like:
    // total_amount=100,transaction_uuid=...,product_code=... :contentReference[oaicite:3]{index=3}
    const fields = signedFieldNames.split(",").map((s) => s.trim());
    const signingString = fields.map((k) => `${k}=${decoded[k]}`).join(",");

    const expectedSignature = hmacSha256Base64(signingString, secretKey);

    if (expectedSignature !== receivedSignature) {
      return NextResponse.json(
        { verified: false, error: "Signature mismatch", decoded },
        { status: 400 }
      );
    }

    // 3) Status Check API (recommended)
    // Docs show: rc.esewa.com.np for testing, esewa.com.np for production :contentReference[oaicite:4]{index=4}
    const transaction_uuid = decoded?.transaction_uuid;
    const total_amount = decoded?.total_amount;

    if (!transaction_uuid || !total_amount) {
      return NextResponse.json(
        {
          verified: false,
          error: "Decoded data missing transaction_uuid/total_amount",
          decoded,
        },
        { status: 400 }
      );
    }

    // choose env: "rc" for testing, "prod" for production
    const mode = (process.env.ESEWA_ENV || "rc").toLowerCase(); // rc | prod
    const statusBase =
      mode === "prod"
        ? "https://esewa.com.np"
        : "https://rc.esewa.com.np";

    const statusUrl =
      `${statusBase}/api/epay/transaction/status/` +
      `?product_code=${encodeURIComponent(productCode)}` +
      `&total_amount=${encodeURIComponent(String(total_amount))}` +
      `&transaction_uuid=${encodeURIComponent(String(transaction_uuid))}`;

    const statusRes = await fetch(statusUrl);
    const statusText = await statusRes.text();

    if (!statusRes.ok) {
      return NextResponse.json(
        {
          verified: false,
          error: "Status check failed",
          statusCode: statusRes.status,
          body: statusText,
        },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let statusJson: any;
    try {
      statusJson = JSON.parse(statusText);
    } catch {
      return NextResponse.json(
        { verified: false, error: "Status check returned non-JSON", body: statusText },
        { status: 400 }
      );
    }

    // Docs show status values like COMPLETE, PENDING, etc. :contentReference[oaicite:5]{index=5}
    const status = statusJson?.status;
    const verified = status === "COMPLETE";

    return NextResponse.json({
      verified,
      status,
      transaction_uuid,
      total_amount,
      ref_id: statusJson?.ref_id ?? null,
    });
  } catch (err) {
    console.error("Error verifying eSewa payment:", err);
    return NextResponse.json(
      { verified: false, error: "Verification error" },
      { status: 500 }
    );
  }
}
