import crypto from "crypto";
import { generateEsewaSignature } from "@/lib/esewa/signature";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { amount, productId } = body;

    if (!amount || !productId) {
      return NextResponse.json(
        { error: "amount and productId are required" },
        { status: 400 }
      );
    }

    // Prefer server-only envs (keep NEXT_PUBLIC as fallback if you already set them)
    const merchantCode =
      process.env.ESEWA_MERCHANT_CODE || process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE;
    const secretKey =
      process.env.ESEWA_SECRET_KEY || process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY;

    const baseSuccessUrl =
      process.env.ESEWA_SUCCESS_URL || process.env.NEXT_PUBLIC_ESEWA_SUCCESS_URL;
    const failureUrl =
      process.env.ESEWA_FAILURE_URL || process.env.NEXT_PUBLIC_ESEWA_FAILURE_URL;

    if (!merchantCode || !secretKey || !baseSuccessUrl || !failureUrl) {
      console.error("Missing eSewa env vars", {
        merchantCode,
        secretKey: !!secretKey,
        baseSuccessUrl,
        failureUrl,
      });
      return NextResponse.json(
        { error: "Server misconfigured: missing eSewa env vars" },
        { status: 500 }
      );
    }

    const transaction_uuid = crypto.randomUUID();

    // ✅ IMPORTANT: keep success_url CLEAN.
    // eSewa v2 appends `data=...` itself on success. :contentReference[oaicite:1]{index=1}
    const success_url = baseSuccessUrl;

    const basePayload = {
      amount: String(amount),
      tax_amount: "0",
      product_delivery_charge: "0",
      product_service_charge: "0",
      total_amount: String(amount),
      transaction_uuid,
      product_code: merchantCode,
      success_url,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signature = generateEsewaSignature(basePayload, secretKey);

    return NextResponse.json({
      payload: basePayload,
      signature,
    });
  } catch (err) {
    console.error("Error in /api/esewa/initiate:", err);
    return NextResponse.json(
      { error: "Internal error initiating payment" },
      { status: 500 }
    );
  }
}
