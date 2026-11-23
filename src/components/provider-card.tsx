import Link from "next/link";
import type { Provider } from "@/db/schema";
import { ProviderAvatar } from "./provider-avatar";

function Badge({ label }: { label: string }) {
  const quality = label.includes("quality");
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-tight ${
        quality ? "bg-clay-soft text-clay" : "bg-moss-soft text-moss"
      }`}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
        <path
          d="M6 1l1.5 3.1 3.4.5-2.45 2.4.6 3.4L6 8.9 2.95 10.8l.6-3.4L1.1 4.6l3.4-.5L6 1z"
          fill="currentColor"
        />
      </svg>
      <span className="truncate">{label}</span>
    </span>
  );
}

function Chip({ children, tone = "lilac" }: { children: React.ReactNode; tone?: "lilac" | "line" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12.5px] font-medium ${
        tone === "lilac" ? "bg-lilac text-jacarta" : "border border-line bg-paper text-ink-2"
      }`}
    >
      {children}
    </span>
  );
}

export function ProviderCard({
  provider,
  priority = false,
}: {
  provider: Provider;
  priority?: boolean;
}) {
  const href = `/providers/${provider.slug}`;

  return (
    <article
      className={`group relative rounded-3xl border border-line bg-card p-4 transition duration-300 sm:p-5 ${
        priority
          ? "shadow-[0_1px_0_rgba(21,23,26,0.04)]"
          : "shadow-[0_1px_0_rgba(21,23,26,0.04)] hover:-translate-y-0.5 hover:border-lilac-3 hover:shadow-[0_24px_50px_-34px_rgba(62,46,115,0.55)]"
      }`}
    >
      <div className="flex gap-4 sm:gap-5">
        <div className="relative">
          <ProviderAvatar
            photo={provider.photo}
            photoPos={provider.photoPos}
            name={provider.name}
            className="h-[112px] w-[112px] rounded-2xl sm:h-[136px] sm:w-[136px]"
          />
          <span
            className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-card bg-moss text-white"
            title="Accepting new patients"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2.5 6.3l2.2 2.2 4.8-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {provider.badge && (
            <div className="mb-2">
              <Badge label={provider.badge} />
            </div>
          )}

          <h3 className="font-display text-[19px] font-bold leading-snug sm:text-[21px]">
            <Link href={href} className="transition group-hover:text-jacarta">
              {provider.name}
            </Link>
          </h3>

          <p className="mt-1 text-[13.5px] font-medium text-ink-2">
            {provider.credential} <span className="text-line-2">•</span> {provider.years}+ years{" "}
            <span className="text-line-2">•</span> {provider.city}, {provider.state}
          </p>

          <p className="mt-2 hidden text-[13.5px] leading-relaxed text-ink-3 line-clamp-2 sm:block">
            {provider.credentialBlurb}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.specialties.slice(0, 5).map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>

          <div className="mt-2.5 hidden flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-3 sm:flex">
            <span className="font-semibold uppercase tracking-[0.1em] text-ink-3">Style</span>
            <span>{provider.styles.join(" · ")}</span>
          </div>

          <p className="mt-2.5 hidden text-[14.5px] italic leading-relaxed text-ink-2 line-clamp-2 sm:block">
            “{provider.quote}”
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3.5 text-[13px]">
        <span className="inline-flex items-center gap-1.5 font-medium text-moss">
          <span className="h-1.5 w-1.5 rounded-full bg-moss" />
          Available virtually
        </span>
        <span className="text-ink-3">
          Next opening <span className="font-semibold text-ink">{provider.nextAvailable}</span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-jacarta">
          <span className="tabular-nums">★ {Number(provider.rating).toFixed(1)}</span>
          <span className="font-normal text-ink-3">({provider.reviewCount})</span>
          <Link
            href={href}
            aria-label={`View ${provider.name}'s profile`}
            className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line text-jacarta transition group-hover:border-jacarta group-hover:bg-jacarta group-hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2.5 6h7M6.5 3l3 3-3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </span>
      </div>
    </article>
  );
}
