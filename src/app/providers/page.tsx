import type { Metadata } from "next";
import Link from "next/link";
import { Directory, type Facets } from "@/components/directory";
import { filterProviders, getAllProviders } from "@/lib/providers";

// Data comes from Postgres at request time — never prerender at build time,
// so `next build` succeeds on Vercel even before DATABASE_URL is configured.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find a therapist or psychiatrist accepting your insurance",
  description:
    "Filter 15,000+ in-network providers by specialty, insurance, language, age and identity. Most insured patients pay $15 per session.",
};

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value ?? "";

function buildFacets(all: Awaited<ReturnType<typeof getAllProviders>>): Facets {
  const countBy = (extract: (p: (typeof all)[number]) => string[]) => {
    const map = new Map<string, number>();
    for (const p of all) for (const v of extract(p)) map.set(v, (map.get(v) ?? 0) + 1);
    return [...map.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  };

  const stateMap = new Map<string, { code: string; name: string; count: number }>();
  for (const p of all) {
    const entry = stateMap.get(p.state);
    if (entry) entry.count += 1;
    else stateMap.set(p.state, { code: p.state, name: p.stateName, count: 1 });
  }

  return {
    states: [...stateMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
    specialties: countBy((p) => p.specialties),
    insurances: countBy((p) => p.insurances),
    languages: countBy((p) => p.languages),
    ages: countBy((p) => p.ages),
  };
}

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const state = first(sp.state);
  const careType = first(sp.careType);
  const specialty = first(sp.specialty);
  const language = first(sp.language);
  const q = first(sp.q);

  const all = await getAllProviders();
  const facets = buildFacets(all);

  const initialFilters = {
    state,
    careType,
    q,
    specialties: specialty ? [specialty] : [],
    languages: language ? [language] : [],
  };

  const initialProviders = filterProviders(all, { ...initialFilters, sort: "best" });

  const stateName = facets.states.find((s) => s.code === state)?.name;
  const heading = stateName
    ? `Find a ${careType === "Psychiatry" ? "psychiatrist" : "therapist"} in ${stateName}`
    : careType
      ? `Find a ${careType === "Psychiatry" ? "psychiatrist" : "therapist"} accepting insurance`
      : "Find your provider";

  return (
    <div>
      <div className="border-b border-line bg-paper-2/60">
        <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-8 sm:px-8">
          <nav className="flex items-center gap-1.5 text-[13px] text-ink-3" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-jacarta">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-ink-2">Providers</span>
            {stateName && (
              <>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-ink-2">{stateName}</span>
              </>
            )}
          </nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-display text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                {heading}
              </h1>
              <p className="mt-2.5 text-[15.5px] text-ink-2">
                <span className="font-semibold text-ink">{initialProviders.length} providers</span>{" "}
                in network · license-verified · accepting new patients
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "Therapy", href: "/providers?careType=Therapy" },
                { label: "Psychiatry", href: "/providers?careType=Psychiatry" },
                { label: "Anxiety", href: "/providers?specialty=Anxiety" },
                { label: "Trauma & PTSD", href: "/providers?specialty=Trauma%20and%20PTSD" },
                { label: "In español", href: "/providers?language=Spanish" },
              ].map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="rounded-full border border-line bg-card px-3.5 py-2 text-[13.5px] font-medium text-ink-2 transition hover:border-jacarta hover:text-jacarta"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Directory
        initialProviders={initialProviders}
        initialFilters={initialFilters}
        facets={facets}
      />
    </div>
  );
}
