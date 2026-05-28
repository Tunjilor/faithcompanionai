// src/app/not-found.tsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 py-12 md:px-6">
      <section className="w-full rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur md:p-12">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
          404 • Page not found
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">
          This page could not be found
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          The page may have moved, the link may be outdated, or the feature may not be live yet.
          Start from one of the main areas below.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/tools/verse"
            className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10"
          >
            <div className="text-sm font-semibold text-orange-300">Start here</div>
            <div className="mt-2 text-xl font-bold text-white">Verse</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Get a Scripture-based verse thought with encouragement and a next step.
            </p>
          </Link>

          <Link
            href="/tools/prayer"
            className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10"
          >
            <div className="text-sm font-semibold text-orange-300">Daily support</div>
            <div className="mt-2 text-xl font-bold text-white">Prayer</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Generate a personal prayer for what you are facing right now.
            </p>
          </Link>

          <Link
            href="/biblequiz"
            className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10"
          >
            <div className="text-sm font-semibold text-orange-300">Try something fun</div>
            <div className="mt-2 text-xl font-bold text-white">Bible Quiz</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Test your Bible knowledge and share your results with friends.
            </p>
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Go Home
          </Link>

          <Link
            href="/resources"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore Resources
          </Link>

          <Link
            href="/pricing"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Premium
          </Link>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm text-white/55">
            Need help?{" "}
            <a
              href="mailto:support@faithcompanionai.com"
              className="underline underline-offset-4 hover:text-white"
            >
              support@faithcompanionai.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}