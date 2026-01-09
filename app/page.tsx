export default function Home() {
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
              Generate a high-converting Gumroad page from your PDF
            </h1>
            <p className="mt-3 text-zinc-600">
              Upload a PDF and enter a product name. Get a ready-to-paste title, short description,
              long description, bullets, FAQ, and pricing guidance.
            </p>
          </div>

          {/* Tool card */}
          <section className="mt-8">
            <div className="rounded-2xl border border-zinc-200 shadow-sm">
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                  <div>
                    <h2 className="text-lg font-semibold">Upload your product PDF</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Start with text-based PDFs. Scanned PDFs (images) will be supported later.
                    </p>
                  </div>
                  <div className="text-xs text-zinc-500">
                    Max 20MB (for MVP)
                  </div>
                </div>

                {/* Upload placeholder */}
                <div className="mt-6 rounded-2xl border-2 border-dashed border-zinc-300 p-10 text-center">
                  <p className="text-sm text-zinc-600">
                    Drag and drop your PDF here, or{" "}
                    <span className="text-zinc-900 underline underline-offset-4">
                      browse
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">PDF only</p>

                  <button
                    type="button"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Select PDF
                  </button>
                </div>

                {/* Product name placeholder */}
                <div className="mt-6">
                  <label className="block text-sm font-medium">Product name</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                    placeholder="e.g., AI Prompt Playbook for Coaches"
                  />
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                  disabled
                >
                  Generate Gumroad Listing (disabled for now)
                </button>

                <p className="mt-3 text-xs text-zinc-500">
                  Next: we’ll wire up upload + extraction + generation.
                </p>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="mt-12">
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3 text-sm text-zinc-600">
              <li className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-medium text-zinc-900">1) Upload</div>
                <div className="mt-1">Add your PDF and product name.</div>
              </li>
              <li className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-medium text-zinc-900">2) Extract</div>
                <div className="mt-1">We read the PDF and detect the product type.</div>
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
          MVP build — PDF to Gumroad listing generator.
        </div>
      </footer>
    </div>
  );
}