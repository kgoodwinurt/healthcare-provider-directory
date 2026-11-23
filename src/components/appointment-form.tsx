"use client";

import { useState } from "react";

type Props = { providerId?: number; providerName?: string };

const INSURERS = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare",
  "Optum",
  "Anthem",
  "Oscar",
  "Medicare",
  "Medicaid",
  "Not sure yet",
];

export function AppointmentForm({ providerId, providerName }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("saving");
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, providerId }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? "Something went wrong.");
      }
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-line bg-card p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-moss-soft text-moss">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path
              d="M5.5 11.5l3.6 3.6L16.5 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold">Request received</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          A Rula care coordinator will email you within one business day to confirm coverage and
          hold a first session{providerName ? ` with ${providerName}` : ""}.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-jacarta underline underline-offset-4"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-card p-5 shadow-[0_30px_60px_-50px_rgba(21,23,26,0.7)]"
    >
      <h3 className="font-display text-[19px] font-bold">Request an appointment</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
        No commitment. We verify your benefits before you book.
      </p>

      <div className="mt-4 space-y-3">
        <Field label="Full name" name="name" placeholder="Jordan Rivera" required />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="jordan@email.com"
          required
        />
        <Field label="Phone (optional)" name="phone" type="tel" placeholder="(555) 010-0134" />

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink-2">Insurance plan</span>
          <select
            name="insurance"
            defaultValue=""
            className="h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-[15px] text-ink transition hover:border-line-2 focus:border-jacarta"
          >
            <option value="">Select your plan</option>
            {INSURERS.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink-2">
            What would you like help with?
          </span>
          <textarea
            name="reason"
            rows={3}
            placeholder="A sentence or two is plenty."
            className="w-full resize-none rounded-xl border border-line bg-paper px-3.5 py-3 text-[15px] placeholder:text-ink-3 transition hover:border-line-2 focus:border-jacarta"
          />
        </label>
      </div>

      {status === "error" && (
        <p className="mt-3 rounded-xl bg-clay-soft px-3.5 py-2.5 text-[13.5px] font-medium text-clay">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-4 h-13 w-full rounded-2xl bg-jacarta py-4 text-[15.5px] font-semibold text-white transition hover:bg-jacarta-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? "Sending…" : "Request this provider"}
      </button>

      <p className="mt-3 text-center text-[12.5px] leading-relaxed text-ink-3">
        By submitting you agree to our terms. This form is not for emergencies — call 988.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-2">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-[15px] placeholder:text-ink-3 transition hover:border-line-2 focus:border-jacarta"
      />
    </label>
  );
}
