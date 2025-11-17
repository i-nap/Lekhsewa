import crypto from "crypto";

export function generateEsewaSignature(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
  secret: string
) {
  const sigString = `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;

  return crypto
    .createHmac("sha256", secret)
    .update(sigString)
    .digest("base64");
}
