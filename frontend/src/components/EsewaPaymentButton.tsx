"use client";

import { useState } from "react";
import { SpotifyButton } from "@/components/ui/SpotifyButton";

type EsewaPayButtonProps = {
  amount: number;
  productId: string;
};

export function EsewaPayButton({ amount, productId }: EsewaPayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/esewa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, productId }),
      });

      const text = await res.text();

      // Parse JSON safely (so you see real error pages too)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON from /api/esewa/initiate:", text);
        alert("Server error starting payment. Check console logs.");
        return;
      }

      if (!res.ok) {
        console.error("Initiate error:", data);
        alert(data?.error || "Failed to start payment.");
        return;
      }

      // ✅ Your backend returns: { payload: {...}, signature: "..." }
      const payload = data?.payload;
      const signature = data?.signature;

      if (!payload || !signature) {
        console.error("Bad payload:", data);
        alert("Invalid payment payload from server.");
        return;
      }

      // ✅ Flatten for eSewa: all fields must be top-level
      const fields: Record<string, string> = {
        ...Object.fromEntries(
          Object.entries(payload).map(([k, v]) => [k, String(v)])
        ),
        signature: String(signature),
      };

      // Choose correct form URL
      // RC/UAT (testing):
      const formUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      // LIVE (production) usually:
      // const formUrl = "https://epay.esewa.com.np/api/epay/main/v2/form";

      // Build + submit POST form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = formUrl;
      form.style.display = "none";

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      form.remove();
    } catch (err) {
      console.error("Error while starting payment:", err);
      alert("Unexpected error starting payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpotifyButton
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 !bg-neutral-800 !text-white hover:!bg-green-700"
    >
      {loading ? "Redirecting..." : "Upgrade to Pro"}
    </SpotifyButton>
  );
}
