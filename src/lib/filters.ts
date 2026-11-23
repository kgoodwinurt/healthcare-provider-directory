import type { Provider } from "@/db/schema";

export type SortKey = "best" | "rating" | "experience" | "soonest";

export type ProviderFilters = {
  careType?: string;
  state?: string;
  specialties?: string[];
  insurances?: string[];
  gender?: string;
  languages?: string[];
  ages?: string[];
  q?: string;
  sort?: SortKey;
};

const SOON_RANK: Record<string, number> = {
  Tomorrow: 0,
  "In 2 days": 1,
  "This week": 2,
  "Next week": 3,
};

export const SORT_LABELS: Record<SortKey, string> = {
  best: "Best match",
  rating: "Highest rated",
  experience: "Most experienced",
  soonest: "Soonest available",
};

const normalize = (value: string) => value.trim().toLowerCase();

/**
 * Pure in-memory search over the provider network. Kept free of any
 * database import so client components can share the exact same ranking
 * logic the server uses without pulling `pg` into the browser bundle.
 */
export function filterProviders(all: Provider[], filters: ProviderFilters): Provider[] {
  const q = filters.q ? normalize(filters.q) : "";

  const result = all.filter((p) => {
    if (filters.careType && p.careType !== filters.careType) return false;
    if (filters.state && p.state !== filters.state) return false;
    if (filters.gender && p.gender !== filters.gender) return false;
    if (filters.specialties?.length && !filters.specialties.some((s) => p.specialties.includes(s)))
      return false;
    if (filters.insurances?.length && !filters.insurances.some((i) => p.insurances.includes(i)))
      return false;
    if (filters.languages?.length && !filters.languages.some((l) => p.languages.includes(l)))
      return false;
    if (filters.ages?.length && !filters.ages.some((a) => p.ages.includes(a))) return false;

    if (q) {
      const haystack = [
        p.name,
        p.city,
        p.stateName,
        p.credential,
        p.bio,
        p.quote,
        ...p.specialties,
        ...p.styles,
        ...p.languages,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sort = filters.sort ?? "best";
  return [...result].sort((a, b) => {
    if (sort === "rating") return Number(b.rating) - Number(a.rating);
    if (sort === "experience") return b.years - a.years;
    if (sort === "soonest")
      return (SOON_RANK[a.nextAvailable] ?? 9) - (SOON_RANK[b.nextAvailable] ?? 9);
    const badge = Number(Boolean(b.badge)) - Number(Boolean(a.badge));
    if (badge !== 0) return badge;
    const rating = Number(b.rating) - Number(a.rating);
    if (rating !== 0) return rating;
    return b.reviewCount - a.reviewCount;
  });
}
