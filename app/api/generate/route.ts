import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { convert } from "html-to-text";
import { lookup } from "node:dns/promises";
import net from "node:net";

export const runtime = "nodejs";

type InputPayload = {
  title: string;
  price: string;
  pages: number;
  links: string[];
};

function isHttpUrl(u: string) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isPrivateIp(ip: string) {
  // Basic protection against SSRF to private networks
  if (net.isIP(ip) === 0) return true;

  // IPv4 private ranges
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("172.")) {
    const second = Number(ip.split(".")[1] ?? "0");
    if (second >= 16 && second <= 31) return true;
  }
  if (ip.startsWith("127.")) return true;

  // IPv6 localhost / unique local
  if (ip === "::1") return true;
  if (ip.startsWith("fc") || ip.startsWith("fd")) return true;

  return false;
}

async function assertPublicHost(url: URL) {
  // Resolve DNS and block private IPs
  const res = await lookup(url.hostname, { all: true });
  for (const a of res) {
    if (isPrivateIp(a.address)) {
      throw new Error("Blocked URL host (private network).");
    }
  }
}

async function fetchHtmlSafe(rawUrl: string) {
  const url = new URL(rawUrl);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http/https URLs are allowed.");
  }

  await assertPublicHost(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        // Avoid some basic blocks; still not a crawler
        "User-Agent": "Mozilla/5.0 (compatible; GumroadGenerator/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed (${res.status})`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      throw new Error("URL did not return HTML.");
    }

    // Limit body size (2MB) to avoid abuse
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body.");

    const chunks: Uint8Array[] = [];
    let total = 0;
    const MAX = 2 * 1024 * 1024;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        total += value.length;
        if (total > MAX) throw new Error("Response too large.");
        chunks.push(value);
      }
    }

    const buf = Buffer.concat(chunks);
    return buf.toString("utf-8");
  } finally {
    clearTimeout(timeout);
  }
}

function extractSignals(html: string) {
  const $ = cheerio.load(html);

  const titleTag = ($("title").first().text() || "").trim();
  const h1 = ($("h1").first().text() || "").trim();

  // Remove script/style/nav/footer-ish elements for cleaner text
  $("script,noscript,style,svg,nav,footer,header,aside").remove();

  const cleanedHtml = $.html();
  const text = convert(cleanedHtml, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  })
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const snippet = text.slice(0, 1200);

  return { titleTag, h1, snippet };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<InputPayload>;

    const title = String(body?.title || "").trim();
    const price = String(body?.price || "").trim();
    const pagesRaw = body?.pages;

    const rawLinks = body?.links;
    const links: string[] = Array.isArray(rawLinks)
      ? rawLinks
          .filter((x): x is string => typeof x === "string")
          .map((x) => x.trim())
          .filter(Boolean)
      : [];

    if (!title) return NextResponse.json({ error: "Missing title." }, { status: 400 });
    if (!price) return NextResponse.json({ error: "Missing price." }, { status: 400 });

    const pages = Number(pagesRaw);
    if (!Number.isFinite(pages) || pages <= 0) {
      return NextResponse.json({ error: "Pages must be a positive number." }, { status: 400 });
    }

    const safeLinks = links.filter(isHttpUrl).slice(0, 3);

    const scraped: Array<{
      url: string;
      ok: boolean;
      error?: string;
      signals?: { titleTag: string; h1: string; snippet: string };
    }> = [];

    for (const url of safeLinks) {
      try {
        const html = await fetchHtmlSafe(url);
        const signals = extractSignals(html);
        scraped.push({ url, ok: true, signals });
      } catch (e) {
        scraped.push({ url, ok: false, error: String(e) });
      }
    }

    return NextResponse.json({
      ok: true,
      input: { title, price, pages, links: safeLinks },
      scraped,
      next: "Step 4.4 will generate Gumroad-ready copy from inputs + scraped signals.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error.", details: String(err) },
      { status: 500 }
    );
  }
}