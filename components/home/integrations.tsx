/**
 * INTEGRATIONS — shown as categories with drawn glyphs. A concept shouldn't
 * borrow real companies' logos to look established.
 */

const glyph = {
  db: <path d="M6 7c0-1.7 2.7-3 6-3s6 1.3 6 3-2.7 3-6 3-6-1.3-6-3Zm0 0v10c0 1.7 2.7 3 6 3s6-1.3 6-3V7M6 12c0 1.7 2.7 3 6 3s6-1.3 6-3" />,
  hook: <path d="M9 7a3 3 0 1 1 3 3v4m0 0a3 3 0 1 0 3 3m-3-3H7" />,
  pay: <path d="M4 8h16v9H4zM4 11h16M8 15h3" />,
  chat: <path d="M5 6h14v9H10l-4 3v-3H5z" />,
  mail: <path d="M4 7h16v11H4zm0 0 8 6 8-6" />,
  sheet: <path d="M5 5h14v14H5zM5 10h14M5 15h14M10 5v14" />,
  crm: <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7c.6-3 3-4.5 6-4.5s5.4 1.5 6 4.5" />,
  store: <path d="M5 8h14l-1 11H6zM9 8V6a3 3 0 0 1 6 0v2" />,
  desk: <path d="M6 13a6 6 0 1 1 12 0v3a2 2 0 0 1-2 2h-1v-5h3M6 13v3a2 2 0 0 0 2 2h1v-5H6" />,
  books: <path d="M5 5h10l4 4v10H5zM15 5v4h4M8 13h8M8 16h5" />,
  cal: <path d="M5 6h14v13H5zM5 10h14M9 4v4M15 4v4" />,
  cloud: <path d="M7 18a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1.5A3.3 3.3 0 0 1 17 18z" />,
};

const items: { key: keyof typeof glyph; name: string; count: number }[] = [
  { key: "store", name: "Storefronts", count: 6 },
  { key: "pay", name: "Payments", count: 5 },
  { key: "books", name: "Accounting", count: 4 },
  { key: "crm", name: "CRMs", count: 5 },
  { key: "desk", name: "Helpdesks", count: 4 },
  { key: "chat", name: "Team chat", count: 3 },
  { key: "mail", name: "Email", count: 4 },
  { key: "sheet", name: "Spreadsheets", count: 3 },
  { key: "db", name: "Databases", count: 6 },
  { key: "cloud", name: "Cloud storage", count: 4 },
  { key: "cal", name: "Calendars", count: 3 },
  { key: "hook", name: "Webhooks & HTTP", count: 1 },
];

export function Integrations() {
  const total = items.reduce((n, i) => n + i.count, 0);
  return (
    <section aria-labelledby="int-title" className="section border-t border-grid">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="t-eyebrow" data-reveal>
            Integrations
          </p>
          <h2 id="int-title" className="t-h2 mt-4" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            Connects to what you already use.
          </h2>
          <p className="t-lead mt-6" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            <span className="num text-frost">{total}</span> connectors across twelve kinds of tool, plus plain HTTP for everything else.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-grid bg-grid sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
          {items.map((i, n) => (
            <li key={i.name} className="group flex flex-col gap-6 bg-panel p-5 transition-colors hover:bg-raised" data-reveal style={{ "--d": n % 4 } as React.CSSProperties}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted transition-colors group-hover:text-mint">
                {glyph[i.key]}
              </svg>
              <div>
                <p className="font-[560]">{i.name}</p>
                <p className="num text-[0.75rem] text-muted">{i.count} connectors</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
