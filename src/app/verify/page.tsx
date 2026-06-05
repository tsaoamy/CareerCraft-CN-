import { Suspense } from "react";
import VerifyContent from "./verify-content";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="verify-experience min-h-[calc(100vh-56px)] flex items-center justify-center">
          <div className="text-caption-md text-mute uppercase tracking-[0.2em]">Establishing Connection…</div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
