"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const NAV = [
  {
    label: "Find care",
    href: "/providers",
    children: [
      { label: "All providers", href: "/providers" },
      { label: "Therapy", href: "/providers?careType=Therapy" },
      { label: "Psychiatry", href: "/providers?careType=Psychiatry" },
      { label: "Couples & family", href: "/providers?specialty=Relationship%20Issues" },
    ],
  },
  {
    label: "Insurance",
    href: "/#insurance",
    children: [
      { label: "Accepted plans", href: "/#insurance" },
      { label: "What it costs", href: "/#cost" },
    ],
  },
  {
    label: "Resources",
    href: "/#faq",
    children: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
      { label: "For providers", href: "/#network" },
    ],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setHovered(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/92 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Rula home">
          <span className="block h-7 sm:h-8">
            <Logo className="h-full" />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
          {NAV.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setHovered(item.label)}>
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-medium text-ink transition hover:bg-lilac"
              >
                {item.label}
                <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                  <path
                    d="M1 1l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              {hovered === item.label && (
                <div className="absolute left-0 top-full w-60 rounded-2xl border border-line bg-card p-2 shadow-[0_18px_40px_-24px_rgba(21,23,26,0.45)]">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block rounded-xl px-3 py-2.5 text-sm text-ink-2 transition hover:bg-lilac hover:text-jacarta"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/providers"
            className="hidden rounded-full px-3 py-2 text-[15px] font-medium text-ink transition hover:bg-lilac sm:block"
          >
            Log in
          </Link>
          <Link
            href="/providers"
            className="rounded-full bg-jacarta px-4 py-2.5 text-[15px] font-semibold text-white transition hover:bg-jacarta-2 sm:px-5"
          >
            Get started
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card lg:hidden"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 h-[2px] w-full bg-ink transition ${open ? "top-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full bg-ink transition ${open ? "bottom-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 pb-6 pt-3 lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-line/70 py-2 last:border-0">
              <Link
                href={item.href}
                className="block py-2 font-display text-lg font-semibold text-ink"
              >
                {item.label}
              </Link>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pb-2">
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="text-sm text-ink-2 hover:text-jacarta"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
