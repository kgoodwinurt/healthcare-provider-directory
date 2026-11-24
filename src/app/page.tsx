import Link from "next/link";
import { HomeSearch } from "@/components/home-search";
import { ProviderCard } from "@/components/provider-card";
import { getFeatured } from "@/lib/providers";

// Data comes from Postgres at request time — never prerender at build time,
// so `next build` succeeds on Vercel even before DATABASE_URL is configured.
export const dynamic = "force-dynamic";

const INSURERS = [
  "Aetna",
  "Anthem",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare",
  "Optum",
  "Oscar",
  "Kaiser Permanente",
  "Medicare",
  "Medicaid",
  "Humana",
  "Centene",
];

const STEPS = [
  {
    title: "Tell us what you're looking for",
    body: "Share your state, your insurance card, and what you'd like to work on. It takes about three minutes — no commitment, no credit card.",
  },
  {
    title: "Browse a curated, in-network list",
    body: "We generate providers who are licensed in your state, accepting new patients, and covered by your plan. Filter by specialty, language, identity, and style.",
  },
  {
    title: "Book your first session",
    body: "Choose a time that works and meet over secure video. If the fit isn't right, switch to a different provider in the network at no cost.",
  },
];

const STATS = [
  { value: "15,000+", label: "Licensed providers in network" },
  { value: "170+", label: "Clinical specialties covered" },
  { value: "120+", label: "Accepted insurance plans" },
  { value: "$15", label: "Typical per-session cost" },
];

const FAQS = [
  {
    q: "How do I get started?",
    a: "There's no right or wrong reason to start therapy. Whether you're navigating a life transition or managing symptoms of anxiety or depression, therapy is an effective treatment for many concerns — all you need is an open mind and a sense of what you'd like to explore. Getting started with Rula takes about three minutes.",
  },
  {
    q: "How much will it cost me?",
    a: "Rula patients typically pay $15 per session with insurance, though your cost may vary based on your benefits and deductible — we'll contact your carrier and give you an estimate before your first appointment. Without insurance, the cash rate is $150 per individual session and $165 for couples or family sessions. Psychiatry is $225 for the initial 60-minute intake and $175 for 30-minute follow-ups. HSA and FSA cards are accepted.",
  },
  {
    q: "Which insurance plans do you accept?",
    a: "Rula accepts 120+ commercial plans including most major carriers — Aetna, Anthem, most Blue Cross and Blue Shield plans, Cigna, Kaiser (by referral), Optum, Oscar, and UnitedHealthcare — plus many employer-sponsored plans, Medicare, Medicare Advantage, and Medicaid in many states. Search by your state and carrier to confirm coverage.",
  },
  {
    q: "How soon can I meet with someone?",
    a: "Many providers in the network have openings within a few days, and some have availability as soon as tomorrow. Each profile shows the next available opening so you can decide before you request an appointment.",
  },
  {
    q: "How do I know if I need therapy or psychiatry?",
    a: "Providers in the network specialize in individual therapy, couples therapy, family therapy, and psychiatric care (medication management). Therapy focuses on talk-based treatment; psychiatry covers evaluation and prescriptions. Many patients work with both — you can expand your care team at any time.",
  },
  {
    q: "What if my first match isn't right?",
    a: "It happens. Research shows fit matters more than almost anything else in outcomes. If you don't feel like your first choice was a match, we'll help you switch to a different provider in the network at no extra cost.",
  },
];

export default async function HomePage() {
  const featured = await getFeatured(4);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <svg
          className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] text-lilac-2/70"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>

        <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 pb-6 pt-12 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12 lg:pt-16">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-lilac-3 bg-lilac px-3.5 py-1.5 text-[13px] font-semibold text-jacarta">
              <span className="h-1.5 w-1.5 rounded-full bg-jacarta" />
              In-network with 120+ insurance plans
            </span>

            <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Connect with mental health experts who{" "}
              <span className="text-jacarta">specialize in you</span>
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
              Search therapists, psychologists and psychiatric providers by specialty, insurance,
              language and identity. Most insured patients pay{" "}
              <strong className="font-semibold text-ink">$15 per session</strong>.
            </p>

            <div className="mt-7">
              <HomeSearch />
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { v: "15,000+", l: "Licensed providers" },
                { v: "50 states", l: "Care where you live" },
                { v: "4.9★", l: "Average provider rating" },
              ].map((s) => (
                <div key={s.l} className="border-l border-line-2 pl-4 first:border-0 first:pl-0">
                  <dt className="font-display text-[22px] font-extrabold tracking-tight">{s.v}</dt>
                  <dd className="text-[13.5px] text-ink-2">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative rise" style={{ animationDelay: "120ms" }}>
            <div className="grain relative overflow-hidden rounded-[30px] border border-line">
              <img
                src="images/hero.png"
                alt="A person sitting on a sofa with a laptop, beginning an online therapy session"
                width={1536}
                height={1024}
                className="aspect-[4/3.4] w-full object-cover object-[65%_center]"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-jacarta-3/45 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3">
                <div className="rounded-2xl bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                    Next available
                  </p>
                  <p className="font-display text-[17px] font-bold">Tomorrow, 10:00 AM</p>
                </div>
                <div className="rounded-2xl bg-jacarta px-4 py-3 text-white shadow-lg">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-lilac-3">
                    With insurance
                  </p>
                  <p className="font-display text-[17px] font-bold">$15 / session</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Insurance marquee ────────────────────────────────── */}
      <section id="insurance" className="mt-10 border-y border-line bg-paper-2 py-5">
        <p className="mb-3.5 text-center text-[12.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          Covered by the plans you already have
        </p>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-10 pr-10">
            {[...INSURERS, ...INSURERS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="whitespace-nowrap font-display text-[19px] font-bold tracking-tight text-ink-3 transition hover:text-jacarta"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="relative">
            <div className="grain overflow-hidden rounded-[30px] border border-line">
              <img
                src="images/room.png"
                alt="A calm therapy room with two armchairs and morning light"
                width={1536}
                height={1024}
                className="aspect-[4/3.2] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 right-4 max-w-[240px] rounded-2xl border border-line bg-card p-4 shadow-[0_28px_60px_-40px_rgba(21,23,26,0.7)]">
              <p className="text-[13px] font-semibold text-ink-2">Switch anytime</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-3">
                If the fit isn't right, we'll match you with someone else in the network — no extra
                cost.
              </p>
            </div>
          </div>

          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-jacarta">
              How it works
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
              Care that fits your life,
              <br />
              in three steps
            </h2>

            <ol className="mt-8 space-y-7">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jacarta font-display text-[16px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/providers"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-jacarta px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-jacarta-2"
            >
              Browse providers now
              <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
                <path
                  d="M1 6h11M8 2l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured providers ───────────────────────────────── */}
      <section className="border-t border-line bg-paper-2/70 py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-jacarta">
                Available this week
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em]">
                Meet a few of our providers
              </h2>
            </div>
            <Link
              href="/providers"
              className="group inline-flex items-center gap-2 text-[15px] font-semibold text-jacarta"
            >
              View all providers
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featured.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Cost band ────────────────────────────────────────── */}
      <section id="cost" className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="relative overflow-hidden rounded-[32px] bg-jacarta px-6 py-12 text-white sm:px-12 sm:py-14">
          <svg
            className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 text-white/10"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>

          <div className="relative grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-lilac-3">
                What it costs
              </p>
              <p className="mt-2 font-display text-[clamp(4rem,11vw,7rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
                $15
              </p>
              <p className="mt-3 max-w-[240px] text-[15px] leading-relaxed text-lilac-2">
                is what the average insured patient pays per session. We verify your benefits before
                you book.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  t: "Without insurance",
                  b: "$150 per individual session, $165 for couples or family sessions. Psychiatry intake $225, follow-ups $175.",
                },
                {
                  t: "120+ plans accepted",
                  b: "Aetna, Anthem, Blue Cross Blue Shield, Cigna, Optum, Oscar, UnitedHealthcare, plus Medicare and Medicaid in many states.",
                },
                {
                  t: "HSA & FSA friendly",
                  b: "Use pre-tax dollars for out-of-pocket sessions. We'll estimate your cost before your first appointment.",
                },
                {
                  t: "No surprise bills",
                  b: "Your per-session cost is shared up front, so the number you see is the number you pay.",
                },
              ].map((item) => (
                <div key={item.t} className="border-t border-white/25 pt-4">
                  <h3 className="font-display text-[16.5px] font-bold">{item.t}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-lilac-2">{item.b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-10">
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-jacarta transition hover:bg-lilac"
            >
              Check my coverage
              <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
                <path
                  d="M1 6h11M8 2l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section id="network" className="border-y border-line bg-paper-2 py-12">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-l border-line-2 pl-5 first:border-0 first:pl-0">
              <p className="font-display text-[clamp(2rem,3.4vw,2.6rem)] font-extrabold tracking-[-0.04em] text-jacarta">
                {stat.value}
              </p>
              <p className="mt-1 text-[14.5px] leading-snug text-ink-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-center text-[12.5px] font-semibold uppercase tracking-[0.18em] text-jacarta">
          Good to know
        </p>
        <h2 className="mt-3 text-center font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em]">
          Questions, answered
        </h2>

        <div className="mt-9 rounded-[26px] border border-line bg-card px-5 sm:px-7">
          {FAQS.map((item, i) => (
            <details key={item.q} className="group border-b border-line py-5 last:border-0">
              <summary className="flex items-start justify-between gap-5">
                <span className="font-display text-[17px] font-bold leading-snug sm:text-[18px]">
                  {item.q}
                </span>
                <span className="faq-chevron mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-jacarta transition-transform duration-300">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink-2">{item.a}</p>
              <span className="sr-only">FAQ item {i + 1}</span>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-[26px] border border-line bg-lilac px-6 py-7 text-center">
          <h3 className="font-display text-[20px] font-bold">Still deciding?</h3>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-2">
            Browse the full directory, filter to your insurance, and read profiles until someone
            feels right. It costs nothing to look.
          </p>
          <Link
            href="/providers"
            className="mt-5 inline-flex rounded-full bg-jacarta px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-jacarta-2"
          >
            Find a provider
          </Link>
        </div>
      </section>
    </>
  );
}
