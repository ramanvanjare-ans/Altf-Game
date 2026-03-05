"use client";

export default function NewsletterPage() {
  return (
    <section className="space-y-16">
      {/* HERO */}
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-[var(--foreground)]">
          Get{" "}
          <span className="text-red-500">Local Updates</span>
          <br />
          Delivered to You Daily
        </h1>

        <p className="mt-4 text-[var(--muted-foreground)]">
          Sign up to receive the best local newsletter around. It’s free and
          fully customizable.
        </p>

        {/* Email form */}
        <div className="mt-6 flex max-w-md gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <button className="rounded-md bg-(--primary) px-5 py-2 text-sm font-semibold text-white hover:bg-(--primary)/50">
            Subscribe
          </button>
        </div>

        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          By signing up, you agree to our{" "}
          <span className="underline">Terms of Use</span> and{" "}
          <span className="underline">Privacy Policy</span>.
        </p>
      </div>

      {/* STATS */}
      <div className="text-center">
        <h2 className="mb-10 text-2xl font-bold text-(--primary)">
          Jump-start Your Day with Local Newsletter!
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            value="6M+"
            label="Daily active readers across all newsletters"
          />
          <StatCard
            value="3–7"
            label="Issues per week, based on your preference"
          />
          <StatCard
            value="5"
            label="Top local stories delivered every day"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="text-3xl font-extrabold text-(--primary)">
        {value}
      </div>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        {label}
      </p>
    </div>
  );
}
