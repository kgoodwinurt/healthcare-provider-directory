import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Find care",
    links: [
      { label: "Browse all providers", href: "/providers" },
      { label: "Therapy", href: "/providers?careType=Therapy" },
      { label: "Psychiatry", href: "/providers?careType=Psychiatry" },
      { label: "Couples & family", href: "/providers?specialty=Relationship%20Issues" },
      { label: "Anxiety & depression", href: "/providers?specialty=Anxiety" },
    ],
  },
  {
    title: "Types of care",
    links: [
      { label: "Individual therapy", href: "/providers" },
      { label: "Couples therapy", href: "/providers" },
      { label: "Family therapy", href: "/providers" },
      { label: "Teen therapy", href: "/providers" },
      { label: "Medication management", href: "/providers?careType=Psychiatry" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Insurance & cost", href: "/#cost" },
      { label: "FAQ", href: "/#faq" },
      { label: "Provider network", href: "/#network" },
      { label: "Mental health blog", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Rula", href: "/#network" },
      { label: "For providers", href: "/#network" },
      { label: "Careers", href: "/#network" },
      { label: "Press", href: "/#network" },
      { label: "Contact support", href: "/#faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-2">
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2.6fr]">
          <div>
            <span className="block h-8">
              <Logo className="h-full" />
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
              In-network mental health care in all 50 states. Most insured patients pay $15 per
              session.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-moss" />
              <span className="font-medium">15,000+ providers accepting patients</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                  {col.title}
                </h3>
                <ul className="mt-3.5 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-2 transition hover:text-jacarta"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-card p-5">
          <p className="text-sm leading-relaxed text-ink-2">
            <strong className="font-semibold text-ink">In a crisis?</strong> Rula is not an
            emergency service. If you or someone else is in immediate danger, call 911. In the U.S.,
            call or text <strong className="font-semibold text-jacarta">988</strong> to reach the
            Suicide &amp; Crisis Lifeline, available 24/7.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Rula Health, Inc. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/#faq" className="hover:text-ink">
              Privacy policy
            </Link>
            <Link href="/#faq" className="hover:text-ink">
              Terms of service
            </Link>
            <Link href="/#faq" className="hover:text-ink">
              HIPAA notice
            </Link>
            <Link href="/#faq" className="hover:text-ink">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
