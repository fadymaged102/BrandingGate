import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80dvh] flex-col justify-center py-32">
      <p className="t-meta text-muted">404</p>
      <h1 className="t-d1 mt-6 max-w-[14ch]">This door doesn&rsquo;t open.</h1>
      <p className="mt-6 max-w-[44ch] text-muted">
        The page may have moved. Everything else is where it was.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex w-fit rounded-full bg-fg px-6 py-3 font-medium text-ink transition-transform duration-150 active:scale-[0.97]"
      >
        Back to the home page
      </Link>
    </section>
  );
}
