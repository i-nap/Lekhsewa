"use client";

import React from "react";
import { Check } from "lucide-react";
import { SpotifyButton } from "@/components/ui/SpotifyButton";
import { useAuth0 } from "@auth0/auth0-react";
import { EsewaPayButton } from "@/components/EsewaPaymentButton"; // NEW FIXED COMPONENT

export default function PricingPage() {
    const { loginWithRedirect } = useAuth0();

    const tiers = [
        {
            name: "Free Tier",
            price: "FREE",
            description: "Perfect for students and casual users trying out the service.",
            features: [
                "Unlimited single character recognition",
                "Access to basic government forms",
                "Standard processing speed",
                "Community support",
            ],
            cta: "Get Started",
            highlighted: false,
            isFree: true,
        },
        {
            name: "Pro User",
            price: "NPR 499",
            period: "/month",
            description: "For professionals who need frequent and fast transcription.",
            features: [
                "Everything in Free Tier",
                "Full-word & sentence recognition (Beta)",
                "Priority processing speed",
                "Save & export form data as PDF",
                "Email support",
            ],
            cta: "Upgrade to Pro",
            highlighted: true,
            isFree: false,
            isEnterprise: false,
            amount: 499,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Tailored solutions for government offices and large organizations.",
            features: [
                "Everything in Pro Tier",
                "Custom form integration API",
                "Dedicated server for max speed",
                "On-premise deployment option",
                "24/7 Priority Phone Support",
            ],
            cta: "Contact Sales",
            highlighted: false,
            isFree: false,
            isEnterprise: true,
        },
    ];

    return (
        <main className="flex flex-col items-center min-h-screen p-4 pt-24 pb-24 space-y-16">
            <div className="w-full max-w-3xl text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-neutral-400">
                    Choose the plan that best fits your needs. No hidden fees.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`flex flex-col p-8 rounded-2xl border ${
                            tier.highlighted
                                ? "bg-neutral-900 border-green-500 relative shadow-2xl shadow-green-900/20"
                                : "bg-neutral-900/50 border-neutral-800"
                        }`}
                    >
                        {tier.highlighted && (
                            <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 text-xs font-bold tracking-wider text-black bg-green-500 rounded-full">
                                POPULAR
                            </span>
                        )}

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                            <p className="mt-2 text-neutral-400">{tier.description}</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold text-white">{tier.price}</span>
                            {tier.period && (
                                <span className="text-neutral-400">{tier.period}</span>
                            )}
                        </div>

                        <ul className="flex-1 space-y-4 mb-8">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                    <span className="text-neutral-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="w-full mt-auto">
                            {tier.isFree ? (
                                <SpotifyButton
                                    onClick={() => loginWithRedirect()}
                                    className="w-full py-3 !bg-neutral-800 !text-white hover:!bg-neutral-700"
                                >
                                    {tier.cta}
                                </SpotifyButton>
                            ) : tier.isEnterprise ? (
                                <SpotifyButton
                                    onClick={() => (window.location.href = "/contact")}
                                    className="w-full py-3 !bg-neutral-800 !text-white hover:!bg-neutral-700"
                                >
                                    {tier.cta}
                                </SpotifyButton>
                            ) : (
                                <EsewaPayButton
                                    amount={tier.amount ?? 0}
                                    productId={`lekhsewa-pro-${Date.now()}`}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
