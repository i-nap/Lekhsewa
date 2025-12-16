"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Status = "loading" | "success" | "failed";

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    const run = async () => {
      const data = params.get("data");

      if (!data) {
        console.error("Missing data param from eSewa redirect:", params.toString());
        setStatus("failed");
        setMessage("Payment data missing. Unable to verify.");
        return;
      }

      try {
        const res = await fetch(`/api/esewa/verify?data=${encodeURIComponent(data)}`);
        const json = await res.json();

        if (!res.ok || !json) {
          throw new Error("Verification request failed");
        }

        if (json.verified) {
          setStatus("success");
          setMessage("Payment successful! Your account has been upgraded.");
        } else {
          setStatus("failed");
          setMessage("Payment could not be verified. If money was deducted, contact support.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
        setMessage("Something went wrong while verifying the payment.");
      }
    };

    run();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center shadow-lg">
        {status === "loading" && (
          <>
            <div className="text-lg font-semibold mb-2">Processing Payment</div>
            <p className="text-neutral-400">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-xl font-semibold mb-2">Payment Successful</h1>
            <p className="text-neutral-400 mb-6">{message}</p>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-medium"
            >
              Go to Home
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl font-semibold mb-2">Payment Issue</h1>
            <p className="text-neutral-400 mb-6">{message}</p>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 transition font-medium"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
