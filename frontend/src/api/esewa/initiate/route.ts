import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateEsewaSignature } from "@/lib/esewa/signature";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { amount, productId } = body;

    if (!amount || !productId) {
      return NextResponse.json(
        { error: "amount and productId are required" },
        { status: 400 }
      );
    }

    const merchantCode = process.env.ESEWA_MERCHANT_CODE;
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const successUrl = process.env.NEXT_PUBLIC_ESEWA_SUCCESS_URL;
    const failureUrl = process.env.NEXT_PUBLIC_ESEWA_FAILURE_URL;

    if (!merchantCode || !secretKey || !successUrl || !failureUrl) {
      console.error("Missing eSewa env vars");
      return NextResponse.json(
        { error: "Server misconfigured: missing eSewa env vars" },
        { status: 500 }
      );
    }

    const transaction_uuid = crypto.randomUUID();

    const basePayload = {
      amount,
      tax_amount: 0,
      product_delivery_charge: 0,
      product_service_charge: 0,
      total_amount: amount,
      transaction_uuid,
      product_code: merchantCode,
      success_url: successUrl,
      failure_url: failureUrl,
    };

    const signature = generateEsewaSignature(basePayload, secretKey);

    const fields = {
      ...basePayload,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };

    // This MUST be valid JSON. No HTML, no text.
    return NextResponse.json({
      formUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      fields,
    });
  } catch (err) {
    console.error("Error in /api/esewa/initiate:", err);
    return NextResponse.json(
      { error: "Internal error initiating payment" },
      { status: 500 }
    );
  }
}
