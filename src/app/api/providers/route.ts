import { NextRequest, NextResponse } from "next/server";
import { getAllProviders, filterProviders, type SortKey } from "@/lib/providers";

export const dynamic = "force-dynamic";

function list(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const all = await getAllProviders();

    const providers = filterProviders(all, {
      careType: params.get("careType") ?? undefined,
      state: params.get("state") ?? undefined,
      gender: params.get("gender") ?? undefined,
      q: params.get("q") ?? undefined,
      specialties: list(params.get("specialties")),
      insurances: list(params.get("insurances")),
      languages: list(params.get("languages")),
      ages: list(params.get("ages")),
      sort: (params.get("sort") as SortKey) ?? "best",
    });

    const limit = Number(params.get("limit") ?? providers.length);

    return NextResponse.json({
      total: providers.length,
      providers: providers.slice(0, limit),
    });
  } catch (error) {
    console.error("providers GET failed", error);
    return NextResponse.json({ error: "Unable to search providers" }, { status: 500 });
  }
}
