import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body?.title || "").trim();
    const price = String(body?.price || "").trim();
    const pagesRaw = String(body?.pages || "").trim();
    const rawLinks = body?.links;
    const links: string[] = Array.isArray(rawLinks)
    ? rawLinks
        .filter((x): x is string => typeof x === "string")
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

    if (!title) {
      return NextResponse.json({ error: "Missing title." }, { status: 400 });
    }
    if (!price) {
      return NextResponse.json({ error: "Missing price." }, { status: 400 });
    }
    if (!pagesRaw) {
      return NextResponse.json({ error: "Missing pages." }, { status: 400 });
    }

    const pages = Number(pagesRaw);
    if (!Number.isFinite(pages) || pages <= 0) {
      return NextResponse.json(
        { error: "Pages must be a positive number." },
        { status: 400 }
      );
    }

    // Step 4.2: placeholder response (no scraping yet)
    return NextResponse.json({
      ok: true,
      input: {
        title,
        price,
        pages,
        links,
      },
      next: "Step 4.3 will fetch/scrape links and extract positioning signals.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error.", details: String(err) },
      { status: 500 }
    );
  }
}