"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { changePlanToPro } from "@/app/api";

function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth0();

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
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
          // Payment verified, now upgrade the plan
          if (user?.sub) {
            try {
              await changePlanToPro(user.sub);
              console.log('Plan upgraded to pro for user:', user.sub);
            } catch (err) {
              console.error('Error upgrading plan:', err);
            }
          }
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
  }, [params, user?.sub]);

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
              onClick={() => window.location.href = "/"}
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

export default SuccessClient;
