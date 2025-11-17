import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get("uuid");
  const userId = searchParams.get("userId");

  if (!uuid || !userId) {
    return NextResponse.json({ verified: false, error: "Missing parameters" });
  }

  const verifyURL = `https://uat.esewa.com.np/epay/transact/?txnRefId=${uuid}&merchantCode=${process.env.ESEWA_MERCHANT_CODE}`;

  const res = await fetch(verifyURL);
  const xml = await res.text();

  const verified = xml.includes("<response_code>Success</response_code>");

  if (verified) {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/upgrade?sub=${userId}`, { method: "POST" });
  }

  return NextResponse.json({ verified });
}
