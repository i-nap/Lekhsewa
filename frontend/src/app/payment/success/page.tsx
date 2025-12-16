"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const uuid = params.get("transaction_uuid");
   const amount = params.get("amount"); 

  const { user, isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isLoading) return;

    if (!uuid || !amount) {
      console.error("Missing uuid or amount from eSewa", { uuid, amount });
      toast.error("Missing payment details from eSewa.");
      router.replace("/");
      return;
    }

    if (!isAuthenticated || !user) {
      console.warn("User not authenticated on success page");
      toast.error("You must be logged in for payment verification.");
      router.replace("/");
      return;
    }

    const sub = user.sub ?? "";

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `/api/esewa/verify?uuid=${encodeURIComponent(
            uuid
          )}&amount=${encodeURIComponent(
            amount
          )}&userId=${encodeURIComponent(sub)}`
        );

               if (!res.ok) {
          console.error("Verify API returned", res.status);
          const txt = await res.text();
          console.error("Verify error body:", txt);
          toast.error("Payment verification failed. Try again.");
          router.replace("/");
          return;
        }

        const data = await res.json();
        if (data.verified) {
          toast.success("Payment verified ✅", {
            description: "Your account has been upgraded.",
          });
        } else {
          toast.error("Payment could not be verified.");
        }
      } catch (err) {
        console.error("Error calling /api/esewa/verify:", err);
        toast.error("Error verifying payment. Try again.");
      } finally {
        router.replace("/");
      }
    };

    verifyPayment();
  }, [uuid, amount, isLoading, isAuthenticated, user, router]);

  return (
    <div className="text-white p-10 text-align-center">
      Verifying your payment...
    </div>
  );
}
