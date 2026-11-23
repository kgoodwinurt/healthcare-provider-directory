import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppointmentForm } from "@/components/appointment-form";
import { ProviderAvatar } from "@/components/provider-avatar";
import { ProviderCard } from "@/components/provider-card";
import {
  getAllProviders,
  getProviderBySlug,
  getReviewsFor,
  getSimilarProviders,
} from "@/lib/providers";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: "Provider not found" };
  return {
    title: `${provider.name}, ${provider.credential} in ${provider.city}, ${provider.stateName}`,
    description: `${provider.name} is a ${provider.credential} specializing in ${provider.specialties
      .slice(0, 3)
      .join(", ")}. ${provider.nextAvailable} next opening, accepting ${provider.insurances
      .slice(0, 3)
      .join(", ")}.`,
  };
}

function Chip({
  children,
  tone = "lilac",
}: {
  children: React.ReactNode;
  tone?: "lilac" | "line";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-[13.5px] font-medium ${
        tone === "lilac" ? "bg-lilac text-jacarta" : "border border-line bg-paper text-ink-2"
      }`}
    >
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-7 first:border-0 first:pt-0">
      <h2 className="font-display text-[17px] font-bold">{title}</h2>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export default async function ProviderProfilePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const [providerReviews, similar, all] = await Promise.all([
    getReviewsFor(provider.id),
    getSimilarProviders(provider, 3),
    getAllProviders(),
  ]);

  const firstName = provider.name.split(" ")[0];
  const average = Number(provider.rating);
  const distribution = [
    { stars: 5, pct: 82 },
    { stars: 4, pct: 12 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-8 sm:px-8">
      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-3" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-jacarta">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/providers" className="transition hover:text-jacarta">
          Providers
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/providers?state=${provider.state}`}
          className="transition hover:text-jacarta"
        >
          {provider.stateName}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-ink-2">{provider.name}</span>
      </nav>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_384px] lg:gap-10">
        <div>
          {/* Identity card */}
          <div className="rounded-[28px] border border-line bg-card p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row">
              <ProviderAvatar
                photo={provider.photo}
                photoPos={provider.photoPos}
                name={provider.name}
                className="h-40 w-40 rounded-3xl sm:h-[168px] sm:w-[168px]"
              />

              <div className="min-w-0 flex-1">
                {provider.badge && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                      provider.badge.includes("quality")
                        ? "bg-clay-soft text-clay"
                        : "bg-moss-soft text-moss"
                    }`}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                      <path
                        d="M6 1l1.5 3.1 3.4.5-2.45 2.4.6 3.4L6 8.9 2.95 10.8l.6-3.4L1.1 4.6l3.4-.5L6 1z"
                        fill="currentColor"
                      />
                    </svg>
                    {provider.badge}
                  </span>
                )}

                <h1 className="mt-2.5 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-[1.06] tracking-[-0.035em]">
                  {provider.name}
                </h1>

                <p className="mt-2 text-[15.5px] text-ink-2">
                  {provider.credential} <span className="text-line-2">•</span> {provider.years}+ years
                  of experience <span className="text-line-2">•</span> {provider.city},{" "}
                  {provider.state}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-soft px-3 py-1.5 text-[13.5px] font-semibold text-moss">
                    <span className="h-1.5 w-1.5 rounded-full bg-moss" />
                    Accepting new patients
                  </span>
                  <Chip tone="line">Available virtually</Chip>
                  <Chip tone="line">{provider.careType}</Chip>
                  <Chip tone="line">
                    Next opening {provider.nextAvailable.toLowerCase()}
                  </Chip>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-[15px] font-bold text-ink">
                      {average.toFixed(1)}★
                    </span>
                    <span className="text-ink-3">({provider.reviewCount} reviews)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-semibold text-ink">$15</span>
                    <span className="text-ink-3">typical with insurance</span>
                  </span>
                </div>
              </div>
            </div>

            <blockquote className="mt-6 border-l-2 border-lilac-3 pl-4 font-display text-[19px] font-medium italic leading-snug text-jacarta sm:text-[21px]">
              “{provider.quote}”
            </blockquote>
          </div>

          {/* Details */}
          <div className="mt-6 rounded-[28px] border border-line bg-card p-5 sm:p-7">
            <Section title={`About ${firstName}`}>
              <p className="text-[15.5px] leading-relaxed text-ink-2">{provider.bio}</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-3">
                {provider.credentialBlurb} {provider.degree}
              </p>
            </Section>

            <Section title="Specialties">
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </Section>

            <Section title="Therapeutic style">
              <div className="flex flex-wrap gap-2">
                {provider.styles.map((s) => (
                  <Chip key={s} tone="line">
                    {s}
                  </Chip>
                ))}
              </div>
            </Section>

            <Section title="Languages">
              <p className="text-[15.5px] text-ink-2">{provider.languages.join(", ")}</p>
            </Section>

            <Section title="Ages treated">
              <p className="text-[15.5px] text-ink-2">{provider.ages.join(", ")}</p>
            </Section>

            <Section title="Education">
              <p className="text-[15.5px] leading-relaxed text-ink-2">{provider.degree}</p>
            </Section>

            <Section title="Insurance accepted">
              <div className="flex flex-wrap gap-2">
                {provider.insurances.map((plan) => (
                  <Chip key={plan}>{plan}</Chip>
                ))}
              </div>
              <p className="mt-3 text-[13.5px] text-ink-3">
                Coverage verified before your first session. Self-pay available at $150 per
                individual session.
              </p>
            </Section>
          </div>

          {/* Reviews */}
          <div className="mt-6 rounded-[28px] border border-line bg-card p-5 sm:p-7">
            <Section title="What patients say">
              <div className="flex flex-wrap items-center gap-5 pb-5">
                <div>
                  <p className="font-display text-[42px] font-extrabold leading-none tracking-tight">
                    {average.toFixed(1)}
                  </p>
                  <p className="mt-1.5 text-[14px] text-ink-3">
                    {provider.reviewCount} verified reviews
                  </p>
                </div>
                <div className="flex gap-1 text-[17px]" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= Math.round(average) ? "text-jacarta" : "text-line-2"}>
                      ★
                    </span>
                  ))}
                </div>
                <ul className="min-w-[210px] flex-1 space-y-1">
                  {distribution.map((row) => (
                    <li key={row.stars} className="flex items-center gap-2 text-[12px] text-ink-3">
                      <span className="w-6 tabular-nums">{row.stars}★</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
                        <span
                          className="block h-full rounded-full bg-jacarta"
                          style={{ width: `${row.pct}%` }}
                        />
                      </span>
                      <span className="w-8 text-right tabular-nums">{row.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mb-4 text-[13.5px] text-ink-3">
                Reviews come from patients who completed at least one session.
              </p>

              <ul className="space-y-4">
                {providerReviews.map((review) => (
                  <li key={review.id} className="border-t border-line pt-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[14.5px] font-semibold">{review.author}</span>
                      <span className="text-[13.5px] text-jacarta" aria-label={`${review.rating} out of 5`}>
                        {"★".repeat(review.rating)}
                        <span className="text-line-2">{"★".repeat(5 - review.rating)}</span>
                      </span>
                      <span className="text-[13px] text-ink-3">{review.sessionType}</span>
                      <span className="ml-auto text-[13px] text-ink-3">{review.publishedOn}</span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{review.body}</p>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        {/* Booking rail */}
        <aside className="lg:sticky lg:top-[84px]">
          <AppointmentForm providerId={provider.id} providerName={firstName} />

          <div className="mt-4 rounded-3xl border border-line bg-lilac/60 p-5">
            <h3 className="font-display text-[16px] font-bold">What to expect</h3>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-ink-2">
              {[
                "We verify your benefits within one business day.",
                "Sessions are 60 minutes over secure video.",
                "Switch providers free of charge if it isn't the right fit.",
                "Prescriptions sent to your pharmacy when clinically appropriate.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <svg
                    className="mt-1 shrink-0 text-jacarta"
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 7.3l3 3 6-6.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 px-1 text-[12.5px] leading-relaxed text-ink-3">
            Not an emergency service. If you are in crisis, call or text 988.
          </p>
        </aside>
      </div>

      {/* Similar providers */}
      <section className="mt-14 border-t border-line pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-jacarta">
              Keep comparing
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-[-0.03em]">
              Similar providers
            </h2>
          </div>
          <Link
            href={`/providers?state=${provider.state}`}
            className="text-[15px] font-semibold text-jacarta hover:underline"
          >
            All providers in {provider.stateName} →
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {similar.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>

        <p className="mt-6 text-[13.5px] text-ink-3">
          {all.length} featured profiles in this directory · every provider is license-verified and
          reviewed annually.
        </p>
      </section>
    </div>
  );
}
