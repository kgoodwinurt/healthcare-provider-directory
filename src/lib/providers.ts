import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, providers, reviews } from "@/db/schema";
import type { Provider, Review } from "@/db/schema";
import { filterProviders } from "./filters";

export { filterProviders, SORT_LABELS } from "./filters";
export type { ProviderFilters, SortKey } from "./filters";

export async function getAllProviders(): Promise<Provider[]> {
  return db.select().from(providers);
}

export async function getFeatured(limit = 3): Promise<Provider[]> {
  const all = await getAllProviders();
  return filterProviders(all, { sort: "best" }).slice(0, limit);
}

export async function getProviderBySlug(slug: string): Promise<Provider | undefined> {
  const rows = await db.select().from(providers).where(eq(providers.slug, slug)).limit(1);
  return rows[0];
}

export async function getReviewsFor(providerId: number): Promise<Review[]> {
  return db.select().from(reviews).where(eq(reviews.providerId, providerId));
}

export async function getSimilarProviders(current: Provider, limit = 3): Promise<Provider[]> {
  const all = await getAllProviders();
  return filterProviders(all, { sort: "best" })
    .filter((p) => p.id !== current.id)
    .filter(
      (p) =>
        p.state === current.state ||
        p.specialties.some((s) => current.specialties.includes(s)),
    )
    .slice(0, limit);
}

export async function getStates(): Promise<{ state: string; stateName: string; count: number }[]> {
  const all = await getAllProviders();
  const map = new Map<string, { state: string; stateName: string; count: number }>();
  for (const p of all) {
    const entry = map.get(p.state);
    if (entry) entry.count += 1;
    else map.set(p.state, { state: p.state, stateName: p.stateName, count: 1 });
  }
  return [...map.values()].sort((a, b) => a.stateName.localeCompare(b.stateName));
}

export async function recordInquiry(input: {
  providerId?: number;
  name: string;
  email: string;
  phone?: string;
  insurance?: string;
  reason?: string;
}) {
  const rows = await db.insert(inquiries).values(input).returning({ id: inquiries.id });
  return rows[0];
}
