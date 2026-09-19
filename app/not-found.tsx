import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="bg-grid grid flex-1 place-items-center px-6 py-24 text-center">
      <div>
        <p className="num text-mint">404 · route not found</p>
        <h1 className="t-display mt-4">No workflow here.</h1>
        <p className="t-lead mx-auto mt-5 max-w-md">This path doesn&rsquo;t lead anywhere. The live demo does, though.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-line">
            Home
          </Link>
          <Link href="/demo" className="btn btn-mint">
            Open the live demo
          </Link>
        </div>
      </div>
    </main>
  );
}
