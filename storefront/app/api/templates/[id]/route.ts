import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    if (!templateId) {
      return NextResponse.json({ error: "Template ID required" }, { status: 400 });
    }
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const res = await fetch(`${backendUrl}/store/templates/${templateId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Template not found" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Template [id] API error:", error);
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}
