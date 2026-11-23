import { NextRequest, NextResponse } from "next/server";
import { recordInquiry } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 422 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
    }

    const inquiry = await recordInquiry({
      providerId: typeof body.providerId === "number" ? body.providerId : undefined,
      name,
      email,
      phone: String(body.phone ?? "").trim() || undefined,
      insurance: String(body.insurance ?? "").trim() || undefined,
      reason: String(body.reason ?? "").trim() || undefined,
    });

    return NextResponse.json({ ok: true, id: inquiry?.id ?? null }, { status: 201 });
  } catch (error) {
    console.error("inquiries POST failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
