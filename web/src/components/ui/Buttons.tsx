import Link from "next/link";
import type { ReactNode } from "react";

type Direction = "right" | "down" | "out";

const paths: Record<Direction, string> = {
  right: "M1 6h10m0 0L6.5 1.5M11 6l-4.5 4.5",
  down: "M6 1v10m0 0L1.5 6.5M6 11l4.5-4.5",
  out: "M2.5 9.5l7-7m0 0H4m5.5 0V8",
};

export function ArrowIcon({ direction = "right" }: { direction?: Direction }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d={paths[direction]} stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const solid =
  "group inline-flex items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink transition-transform duration-150 ease-ui active:scale-[0.97]";
const ghost =
  "inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium text-fg ring-1 ring-line-strong transition-[background-color,box-shadow,transform] duration-150 ease-ui hover:bg-fg/5 hover:ring-gold active:scale-[0.97]";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  direction?: Direction;
  external?: boolean;
  className?: string;
};

/**
 * The portfolio's call to action: an off-white pill with an ink arrow disc
 * that nudges on hover, or a hairline ghost pill that picks up gold.
 */
export function PillLink({ href, children, variant = "solid", direction = "right", external, className = "" }: Props) {
  const body =
    variant === "solid" ? (
      <>
        {children}
        <span className="grid size-8 place-items-center rounded-full bg-ink text-fg transition-transform duration-300 ease-ui group-hover:translate-x-0.5">
          <ArrowIcon direction={direction} />
        </span>
      </>
    ) : (
      children
    );
  const cls = `${variant === "solid" ? solid : ghost} ${className}`;

  if (external || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {body}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}

/** Mono label with the gold rule, as on the portfolio hero. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`t-meta flex items-center gap-3 text-muted ${className}`}>
      <span className="inline-block h-px w-8 bg-gold" aria-hidden />
      {children}
    </p>
  );
}
