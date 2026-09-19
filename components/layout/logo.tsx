/** VECTOR mark: an arrow built from three nodes and two edges. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="inline-block">
        <path d="M4 17 11 5l7 12" fill="none" stroke="var(--c-mint)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="4" cy="17" r="2.4" fill="var(--c-frost)" />
        <circle cx="11" cy="5" r="2.4" fill="var(--c-mint)" />
        <circle cx="18" cy="17" r="2.4" fill="var(--c-frost)" />
      </svg>
      <span className="ml-2.5 align-middle text-[1.05rem] font-[680] tracking-[0.14em]">VECTOR</span>
    </span>
  );
}
