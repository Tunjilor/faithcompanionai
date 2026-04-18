// src/app/login/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Faith Companion AI to save your verses, prayers, devotionals, and faith journal.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-12 md:px-6 md:py-16">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-white/70 shadow-2xl backdrop-blur md:p-8">
            Loading sign-in…
          </div>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}