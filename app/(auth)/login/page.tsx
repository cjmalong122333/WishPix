import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[310px] rounded-[16px] bg-[#0D223B]/80 animate-pulse" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
