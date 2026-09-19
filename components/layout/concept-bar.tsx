import Link from "next/link";
import { author } from "@/lib/site";

/** Every page opens by saying what this is: a concept by a named developer. */
export function ConceptBar() {
  return (
    <div className="border-b border-grid bg-panel text-frost">
      <p className="shell flex h-[var(--bar-h)] items-center justify-center gap-x-3 whitespace-nowrap text-[0.78rem]">
        <span className="md:hidden">
          <strong className="font-[620] text-mint">Concept</strong> by {author.name} · not a real product
        </span>
        <span className="hidden md:inline">
          <strong className="font-[620] text-mint">Self-initiated concept</strong> by {author.name}. VECTOR is fictional, and so is every number on it.
        </span>
        <Link href="/concept" className="hidden underline underline-offset-4 lg:inline">
          About this concept
        </Link>
      </p>
    </div>
  );
}
