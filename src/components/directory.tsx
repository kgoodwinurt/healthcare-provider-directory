"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Provider } from "@/db/schema";
import { SORT_LABELS, type SortKey } from "@/lib/filters";
import { ProviderCard } from "./provider-card";

export type Facets = {
  states: { code: string; name: string; count: number }[];
  specialties: { value: string; count: number }[];
  insurances: { value: string; count: number }[];
  languages: { value: string; count: number }[];
  ages: { value: string; count: number }[];
};

type Filters = {
  q: string;
  careType: string;
  state: string;
  gender: string;
  specialties: string[];
  insurances: string[];
  languages: string[];
  ages: string[];
  sort: SortKey;
};

const GENDERS = ["Female", "Male", "Non-binary"];
const PAGE_SIZE = 8;

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-display text-[15px] font-bold text-ink">{title}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          aria-hidden="true"
          className={`text-ink-3 transition-transform ${open ? "" : "-rotate-90"}`}
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-[14px] transition hover:bg-lilac/60">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-line-2 accent-jacarta"
      />
      <span className={checked ? "font-semibold text-jacarta" : "text-ink-2"}>{label}</span>
      {typeof count === "number" && (
        <span className="ml-auto text-[12.5px] tabular-nums text-ink-3">{count}</span>
      )}
    </label>
  );
}

function ScrollList({ children, max = 210 }: { children: React.ReactNode; max?: number }) {
  return (
    <div className="no-scrollbar space-y-0.5 overflow-y-auto pr-1" style={{ maxHeight: max }}>
      {children}
    </div>
  );
}

function FilterControls({
  filters,
  setFilters,
  facets,
  total,
}: {
  filters: Filters;
  setFilters: (next: Filters) => void;
  facets: Facets;
  total: number;
}) {
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const specialties = showAllSpecialties ? facets.specialties : facets.specialties.slice(0, 8);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search providers</span>
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M10.8 10.8L14.5 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          placeholder="Name, city, specialty…"
          className="h-11 w-full rounded-xl border border-line bg-paper pl-9 pr-3 text-[14.5px] placeholder:text-ink-3 transition hover:border-line-2 focus:border-jacarta"
        />
      </label>

      <div className="mt-4">
        <span className="mb-2 block font-display text-[15px] font-bold">Type of care</span>
        <div className="flex rounded-xl border border-line bg-paper p-1">
          {["", "Therapy", "Psychiatry"].map((type) => (
            <button
              key={type || "all"}
              type="button"
              onClick={() => setFilters({ ...filters, careType: type })}
              aria-pressed={filters.careType === type}
              className={`flex-1 rounded-lg px-2 py-2 text-[13.5px] font-semibold transition ${
                filters.careType === type ? "bg-jacarta text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              {type || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-1">
        <FilterSection title="State">
          <select
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-[14.5px] font-medium text-ink transition hover:border-line-2 focus:border-jacarta"
          >
            <option value="">All states</option>
            {facets.states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.count})
              </option>
            ))}
          </select>
        </FilterSection>

        <FilterSection title="Specialty">
          <ScrollList max={showAllSpecialties ? 260 : 210}>
            {specialties.map((s) => (
              <CheckRow
                key={s.value}
                label={s.value}
                count={s.count}
                checked={filters.specialties.includes(s.value)}
                onChange={() =>
                  setFilters({ ...filters, specialties: toggle(filters.specialties, s.value) })
                }
              />
            ))}
          </ScrollList>
          {facets.specialties.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllSpecialties((v) => !v)}
              className="mt-2 text-[13px] font-semibold text-jacarta hover:underline"
            >
              {showAllSpecialties ? "Show fewer" : `Show all ${facets.specialties.length}`}
            </button>
          )}
        </FilterSection>

        <FilterSection title="Insurance">
          <ScrollList>
            {facets.insurances.map((i) => (
              <CheckRow
                key={i.value}
                label={i.value}
                count={i.count}
                checked={filters.insurances.includes(i.value)}
                onChange={() =>
                  setFilters({ ...filters, insurances: toggle(filters.insurances, i.value) })
                }
              />
            ))}
          </ScrollList>
        </FilterSection>

        <FilterSection title="Provider gender" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  setFilters({ ...filters, gender: filters.gender === g ? "" : g })
                }
                aria-pressed={filters.gender === g}
                className={`rounded-full border px-3 py-1.5 text-[13.5px] font-medium transition ${
                  filters.gender === g
                    ? "border-jacarta bg-jacarta text-white"
                    : "border-line bg-paper text-ink-2 hover:border-lilac-3"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Language" defaultOpen={false}>
          <ScrollList>
            {facets.languages.map((l) => (
              <CheckRow
                key={l.value}
                label={l.value}
                count={l.count}
                checked={filters.languages.includes(l.value)}
                onChange={() =>
                  setFilters({ ...filters, languages: toggle(filters.languages, l.value) })
                }
              />
            ))}
          </ScrollList>
        </FilterSection>

        <FilterSection title="Age treated" defaultOpen={false}>
          <ScrollList>
            {facets.ages.map((a) => (
              <CheckRow
                key={a.value}
                label={a.value}
                count={a.count}
                checked={filters.ages.includes(a.value)}
                onChange={() => setFilters({ ...filters, ages: toggle(filters.ages, a.value) })}
              />
            ))}
          </ScrollList>
        </FilterSection>
      </div>

      <p className="pt-3 text-[12.5px] leading-relaxed text-ink-3">
        Showing {total} of 15,000+ network providers. Filters update results instantly.
      </p>
    </div>
  );
}

type Props = {
  initialProviders: Provider[];
  initialFilters: Partial<Filters>;
  facets: Facets;
};

export function Directory({ initialProviders, initialFilters, facets }: Props) {
  const [filters, setFilters] = useState<Filters>({
    q: initialFilters.q ?? "",
    careType: initialFilters.careType ?? "",
    state: initialFilters.state ?? "",
    gender: "",
    specialties: initialFilters.specialties ?? [],
    insurances: [],
    languages: [],
    ages: [],
    sort: "best",
  });
  const [results, setResults] = useState<Provider[]>(initialProviders);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawer, setDrawer] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const firstRender = useRef(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.careType) params.set("careType", filters.careType);
    if (filters.state) params.set("state", filters.state);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.specialties.length) params.set("specialties", filters.specialties.join(","));
    if (filters.insurances.length) params.set("insurances", filters.insurances.join(","));
    if (filters.languages.length) params.set("languages", filters.languages.join(","));
    if (filters.ages.length) params.set("ages", filters.ages.join(","));
    params.set("sort", filters.sort);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setFailed(false);
      try {
        const response = await fetch(`/api/providers?${queryString}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("bad status");
        const payload = await response.json();
        setResults(payload.providers as Provider[]);
        setVisible(PAGE_SIZE);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, filters.q ? 320 : 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [queryString, filters.q, attempt]);

  const activeChips = [
    ...filters.specialties.map((v) => ({ group: "specialties" as const, value: v })),
    ...filters.insurances.map((v) => ({ group: "insurances" as const, value: v })),
    ...filters.languages.map((v) => ({ group: "languages" as const, value: v })),
    ...filters.ages.map((v) => ({ group: "ages" as const, value: v })),
    ...(filters.state
      ? [
          {
            group: "state" as const,
            value: facets.states.find((s) => s.code === filters.state)?.name ?? filters.state,
          },
        ]
      : []),
    ...(filters.gender ? [{ group: "gender" as const, value: filters.gender }] : []),
    ...(filters.careType ? [{ group: "careType" as const, value: filters.careType }] : []),
    ...(filters.q ? [{ group: "q" as const, value: `“${filters.q}”` }] : []),
  ];

  const removeChip = (group: string, value: string) => {
    const next: Filters = { ...filters };
    if (group === "state") next.state = "";
    else if (group === "gender") next.gender = "";
    else if (group === "careType") next.careType = "";
    else if (group === "q") next.q = "";
    else if (group === "specialties")
      next.specialties = filters.specialties.filter((v) => v !== value);
    else if (group === "insurances")
      next.insurances = filters.insurances.filter((v) => v !== value);
    else if (group === "languages") next.languages = filters.languages.filter((v) => v !== value);
    else if (group === "ages") next.ages = filters.ages.filter((v) => v !== value);
    setFilters(next);
  };

  const clearAll = () =>
    setFilters({
      q: "",
      careType: "",
      state: "",
      gender: "",
      specialties: [],
      insurances: [],
      languages: [],
      ages: [],
      sort: filters.sort,
    });

  const shown = results.slice(0, visible);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-[14.5px] font-semibold text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 4h12M4 8h8M6.5 12h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          Filters
          {activeChips.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-jacarta px-1.5 text-[11.5px] font-bold text-white">
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      <label className="ml-auto flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-[14px]">
        <span className="text-ink-3">Sort</span>
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}
          className="bg-transparent font-semibold text-ink outline-none"
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  const body = (
    <div>
      {toolbar}

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={`${chip.group}-${chip.value}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-lilac px-3 py-1.5 text-[13px] font-medium text-jacarta"
            >
              {chip.value}
              <button
                type="button"
                aria-label={`Remove ${chip.value} filter`}
                onClick={() => removeChip(chip.group, chip.value)}
                className="rounded-full p-0.5 transition hover:bg-lilac-2"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path
                    d="M1.5 1.5l7 7M8.5 1.5l-7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-[13.5px] font-semibold text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-line bg-lilac/50 px-4 py-3.5">
        <p className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
          <svg
            className="mt-0.5 shrink-0 text-jacarta"
            width="16"
            height="18"
            viewBox="0 0 16 18"
            aria-hidden="true"
          >
            <path
              d="M8 1l6 2.4v5c0 4-2.6 7.1-6 8.6-3.4-1.5-6-4.6-6-8.6v-5L8 1z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M5.4 8.8l1.9 1.9 3.5-3.9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>
            <strong className="font-semibold text-ink">Quality care comes first.</strong> Every
            provider is license-verified and reviewed before joining, and again every year after.
          </span>
        </p>
      </div>

      <div className="mt-6 min-h-[420px]">
        {failed ? (
          <div className="rounded-3xl border border-line bg-card px-6 py-16 text-center">
            <h3 className="font-display text-xl font-bold">We couldn't load providers</h3>
            <p className="mx-auto mt-2 max-w-sm text-[14.5px] text-ink-2">
              Something interrupted the search. Your filters are still here — try again.
            </p>
            <button
              type="button"
              onClick={() => setAttempt((v) => v + 1)}
              className="mt-5 rounded-full bg-jacarta px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-jacarta-2"
            >
              Retry search
            </button>
          </div>
        ) : loading && results.length === 0 ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-3xl border border-line bg-card p-5">
                <div className="flex gap-5">
                  <div className="h-[136px] w-[136px] rounded-2xl bg-paper-2" />
                  <div className="flex-1 space-y-3 pt-2">
                    <div className="h-4 w-40 rounded bg-paper-2" />
                    <div className="h-3 w-64 rounded bg-paper-2" />
                    <div className="flex gap-2">
                      <div className="h-6 w-20 rounded-full bg-paper-2" />
                      <div className="h-6 w-24 rounded-full bg-paper-2" />
                      <div className="h-6 w-16 rounded-full bg-paper-2" />
                    </div>
                    <div className="h-3 w-full rounded bg-paper-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl border border-line bg-card px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lilac text-jacarta">
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M18 18l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">No providers match those filters</h3>
            <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-ink-2">
              Try removing a filter, widening your state, or searching a neighboring specialty —
              new providers join the network every week.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 rounded-full bg-jacarta px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-jacarta-2"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={`space-y-4 transition ${loading ? "opacity-60" : "opacity-100"}`}
              aria-busy={loading}
            >
              {shown.map((provider, index) => (
                <div key={provider.id} className="rise" style={{ animationDelay: `${index * 45}ms` }}>
                  <ProviderCard provider={provider} priority={index < 3} />
                </div>
              ))}
            </div>

            {results.length > visible && (
              <div className="mt-7 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-line bg-card px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:border-jacarta hover:text-jacarta"
                >
                  Show more providers
                </button>
                <span className="text-[13px] text-ink-3">
                  Showing {shown.length} of {results.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-20 pt-10 sm:px-8">
      <div className="grid items-start gap-8 lg:grid-cols-[286px_1fr] lg:gap-10">
        <aside className="sticky top-[84px] hidden max-h-[calc(100vh-104px)] overflow-y-auto rounded-3xl border border-line bg-card p-5 lg:block">
          <FilterControls
            filters={filters}
            setFilters={(next) => {
              setFilters(next);
              setVisible(PAGE_SIZE);
            }}
            facets={facets}
            total={results.length}
          />
        </aside>

        <section>{body}</section>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-ink-3/45 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-lg font-bold">Filters</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterControls
                filters={filters}
                setFilters={(next) => {
                  setFilters(next);
                  setVisible(PAGE_SIZE);
                }}
                facets={facets}
                total={results.length}
              />
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="w-full rounded-2xl bg-jacarta py-3.5 text-[15px] font-semibold text-white"
              >
                Show {results.length} providers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
