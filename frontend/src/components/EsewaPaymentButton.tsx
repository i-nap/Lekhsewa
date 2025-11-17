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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount, productId }),
            });

            const text = await res.text();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let data: any;
            try {
                data = JSON.parse(text);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                console.error("Non-JSON from /api/esewa/initiate:", text);
                alert("Server error starting payment. Check console logs.");
                return;
            }

            if (!res.ok) {
                console.error("Initiate error:", data);
                alert(data.error || "Failed to start payment.");
                return;
            }

            const { formUrl, fields } = data;

            if (!formUrl || !fields) {
                console.error("Bad payload:", data);
                alert("Invalid payment payload from server.");
                return;
            }

            const form = document.createElement("form");
            form.method = "POST";
            form.action = formUrl;

            Object.entries(fields).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
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
            className="w-full py-3 !bg-neutral-800 !text-white hover:!bg-neutral-700"
        >
            {loading ? "Redirecting..." : "Upgrade to Pro"}
        </SpotifyButton>
    );
}
