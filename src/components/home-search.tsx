"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATES = [
  { code: "", label: "Choose your state" },
  { code: "CA", label: "California" },
  { code: "NY", label: "New York" },
  { code: "TX", label: "Texas" },
  { code: "FL", label: "Florida" },
  { code: "IL", label: "Illinois" },
  { code: "WA", label: "Washington" },
  { code: "MA", label: "Massachusetts" },
  { code: "CO", label: "Colorado" },
  { code: "GA", label: "Georgia" },
  { code: "AZ", label: "Arizona" },
  { code: "PA", label: "Pennsylvania" },
  { code: "TN", label: "Tennessee" },
  { code: "MN", label: "Minnesota" },
  { code: "NJ", label: "New Jersey" },
  { code: "OH", label: "Ohio" },
  { code: "OR", label: "Oregon" },
];

export function HomeSearch() {
  const router = useRouter();
  const [state, setState] = useState("");
  const [careType, setCareType] = useState<"Therapy" | "Psychiatry">("Therapy");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    params.set("careType", careType);
    router.push(`/providers?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-[26px] border border-line bg-card p-3 shadow-[0_30px_60px_-45px_rgba(21,23,26,0.6)] sm:p-3.5"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Your state</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="h-14 w-full appearance-none rounded-2xl border border-line bg-paper px-4 pr-10 text-[15px] font-medium text-ink transition hover:border-line-2 focus:border-jacarta"
          >
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            aria-hidden="true"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </label>

        <div className="flex h-14 items-center rounded-2xl border border-line bg-paper p-1">
          {(["Therapy", "Psychiatry"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setCareType(type)}
              aria-pressed={careType === type}
              className={`h-full rounded-xl px-4 text-[14.5px] font-semibold transition ${
                careType === type
                  ? "bg-jacarta text-white shadow-sm"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="h-14 shrink-0 rounded-2xl bg-jacarta px-7 text-[15px] font-semibold text-white transition hover:bg-jacarta-2"
        >
          Find my therapist
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 px-1.5 pb-0.5 text-[13px] text-ink-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-moss" /> Accepting new patients
        </span>
        <span>Most insured patients pay $15 / session</span>
        <span>Switch providers anytime, free</span>
      </div>
    </form>
  );
}
