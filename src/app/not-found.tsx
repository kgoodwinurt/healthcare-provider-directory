import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center px-5 py-24 text-center sm:px-8">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lilac font-display text-[22px] font-extrabold text-jacarta">
        404
      </span>
      <h1 className="mt-6 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em]">
        We couldn't find that page
      </h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
        The provider profile or article you followed may have moved. Your best next step is the
        directory — filter by your state and insurance to see who's available this week.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/providers"
          className="rounded-full bg-jacarta px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-jacarta-2"
        >
          Browse providers
        </Link>
        <Link
          href="/"
          className="rounded-full border border-line bg-card px-6 py-3.5 text-[15px] font-semibold text-ink transition hover:border-jacarta hover:text-jacarta"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
