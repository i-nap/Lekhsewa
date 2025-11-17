"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";

export default function SuccessPage() {
  const params = useSearchParams();
  const uuid = params.get("transaction_uuid");

  const { user, isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!uuid) return;
    if (isLoading) return;             
    if (!isAuthenticated) return;     
    if (!user) return;                

    const sub = user.sub; 

    fetch(`/api/esewa/verify?uuid=${uuid}&userId=${encodeURIComponent(sub ?? "")}`)
      .then(res => res.json())
      .then(data => {
        if (data.verified) {
          alert("Payment verified & upgraded!");
        } else {
          alert("Verification failed.");
        }
      });

  }, [uuid, isLoading, isAuthenticated, user]);

  return (
    <div className="text-white p-10">
      Verifying your payment...
    </div>
  );
}
