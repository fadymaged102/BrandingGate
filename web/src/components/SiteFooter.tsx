import Image from "next/image";
import { studio } from "@/lib/projects";

export function SiteFooter() {
  const { contact } = studio;
  return (
    <footer className="relative border-t border-line">
      <div className="shell grid gap-16 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="t-meta text-muted">Have an event on the calendar?</p>
          <h2 className="t-d2 mt-5 max-w-[14ch]">Let&rsquo;s build the room together.</h2>
          <a
            href={`mailto:${contact.email}?subject=New%20project`}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink transition-transform duration-150 ease-ui active:scale-[0.97]"
          >
            {contact.email}
            <span className="grid size-9 place-items-center rounded-full bg-ink text-fg transition-transform duration-300 ease-ui group-hover:translate-x-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 7h11m0 0L7.5 2.5M12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </a>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 text-[0.9375rem] md:col-span-5 md:pt-2">
          <div>
            <dt className="t-meta text-faint">Studio</dt>
            <dd className="mt-2 text-muted">{contact.address}</dd>
          </div>
          <div>
            <dt className="t-meta text-faint">Phone</dt>
            <dd className="mt-2">
              <a href={contact.phoneHref} className="text-muted transition-colors hover:text-fg">
                {contact.phone}
              </a>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="t-meta text-faint">Follow</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {studio.social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted transition-colors hover:text-fg"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <div className="shell flex items-center justify-between gap-6 border-t border-line py-6">
        <div className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="" width={38} height={32} className="h-8 w-auto" style={{ width: "auto" }} />
          <span className="t-meta text-faint">Branding Gate, founded in {studio.founded}</span>
        </div>
        <span className="t-meta text-faint">Cairo</span>
      </div>
    </footer>
  );
}
