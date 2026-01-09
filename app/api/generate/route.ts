import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const productName = String(formData.get("productName") || "").trim();
    const file = formData.get("file");

    if (!productName) {
      return NextResponse.json(
        { error: "Missing productName." },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing PDF file." },
        { status: 400 }
      );
    }

    // Basic validation
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    // Placeholder response (Step 3.1)
    return NextResponse.json({
      ok: true,
      productName,
      filename: file.name,
      sizeBytes: file.size,
      next: "In Step 3.2 we will extract text from the PDF.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error.", details: String(err) },
      { status: 500 }
    );
  }
}