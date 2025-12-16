'use client'
import { useEffect, useRef, useState } from "react";

type EsewaFields = {
  amount: number;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
};

export default function PayPage() {
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<EsewaFields | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    // Call our API to get signed payload
    const init = async () => {
      const res = await fetch("/api/esewa-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100 }), // test amount
      });

      const data = await res.json();
      setFormUrl(data.formUrl);
      setFields(data.fields);
    };

    init();
  }, []);

  useEffect(() => {
    if (formUrl && fields && formRef.current) {
      // auto-submit once fields are ready
      formRef.current.submit();
    }
  }, [formUrl, fields]);

  if (!fields || !formUrl) {
    return <p>Preparing eSewa payment…</p>;
  }

  return (
    <form
      ref={formRef}
      action={formUrl}
      method="POST"
      // remove target if you want same tab instead of new one
      target="_self"
    >
      {Object.entries(fields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={String(value)} />
      ))}
    </form>
  );
}
