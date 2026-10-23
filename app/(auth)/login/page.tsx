import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-[360px] rounded-[26px] bg-white/80 animate-pulse" />}>
      <LoginForm />
    </Suspense>
  );
}
