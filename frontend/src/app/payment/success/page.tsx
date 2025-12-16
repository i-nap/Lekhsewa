import { Suspense } from "react";
import SuccessClient from "../success-client";

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center shadow-lg">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <p className="text-neutral-400">Processing your payment...</p>
        </div>
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
