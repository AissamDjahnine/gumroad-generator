"use client";

import * as React from "react";

export default function Home() {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [pages, setPages] = React.useState("");
  const [linksText, setLinksText] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  type ApiResponse =
  | {
      ok: true;
      input: {
        title: string;
        price: string;
        pages: number;
        links: string[];
      };
      next?: string;
    }
  | null;

  const [apiResponse, setApiResponse] = React.useState<ApiResponse>(null);
  const [apiError, setApiError] = React.useState<string | null>(null);

  async function handleGenerate() {
    if (isSubmitting) return;

    const cleanTitle = title.trim();
    const cleanPrice = price.trim();
    const cleanPages = pages.trim();

    if (!cleanTitle || !cleanPrice || !cleanPages) return;

    setIsSubmitting(true);
    setApiError(null);
    setApiResponse(null);

    try {
      const links = linksText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          price: cleanPrice,
          pages: cleanPages,
          links,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.details
          ? `${data?.error || "Request failed."}\n${data.details}`
          : data?.error || "Request failed.";
        setApiError(msg);
        return;
      }

      setApiResponse(data);
    } catch (e) {
      setApiError(String(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isValid =
    title.trim().length > 0 &&
    price.trim().length > 0 &&
    pages.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Gumroad Listing Generator</div>
          <nav className="text-sm text-zinc-600">
            <a className="hover:text-zinc-900" href="#how-it-works">
              How it works
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Generate a high-converting Gumroad page from a few inputs
            </h1>
            <p className="mt-3 text-zinc-600">
              Enter the basics (title, price, pages) and optionally paste similar product links. We
              will use them to generate strong, Gumroad-ready copy.
            </p>
          </div>

          {/* Tool card */}
          <section className="mt-8">
            <div className="rounded-2xl border border-zinc-200 shadow-sm">
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                  <div>
                    <h2 className="text-lg font-semibold">Product details</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Start simple. Links are optional (one per line).
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      placeholder="e.g., AI Prompt Playbook for Coaches"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      placeholder="e.g., 29.99"
                    />
                    <p className="mt-1 text-xs text-zinc-500">Use your store currency.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Number of pages</label>
                    <input
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      placeholder="e.g., 80"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium">Similar product links (optional)</label>
                  <textarea
                    value={linksText}
                    onChange={(e) => setLinksText(e.target.value)}
                    className="mt-2 w-full min-h-[120px] rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                    placeholder={`One URL per line:\nhttps://...\nhttps://...`}
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Next step: we’ll scrape these pages server-side and extract positioning signals.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="mt-6 w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Generating..." : "Generate Gumroad Listing"}
                </button>

                {apiError ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 whitespace-pre-wrap">
                    {apiError}
                  </div>
                ) : null}

                {apiResponse ? (
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="text-sm font-medium text-zinc-900">API response (debug)</div>
                    <pre className="mt-2 overflow-auto text-xs text-zinc-700">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="mt-12">
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3 text-sm text-zinc-600">
              <li className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-medium text-zinc-900">1) Input</div>
                <div className="mt-1">Title, price, pages, optional links.</div>
              </li>
              <li className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-medium text-zinc-900">2) Extract</div>
                <div className="mt-1">We scrape similar pages and extract patterns.</div>
              </li>
              <li className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-medium text-zinc-900">3) Generate</div>
                <div className="mt-1">You get structured Gumroad-ready copy.</div>
              </li>
            </ol>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-zinc-500">
          MVP build — inputs + competitor links → Gumroad listing.
        </div>
      </footer>
    </div>
  );
}