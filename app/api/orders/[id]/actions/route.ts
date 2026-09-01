import { NextResponse } from "next/server";
import { persistAction } from "../../../../../lib/db";
const actions = new Set(["refund", "shipping_update", "shipment_cancel"]);
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  if (!actions.has(body.kind)) return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  if (body.approved !== true) return NextResponse.json({ error: "Merchant approval is required" }, { status: 409 });
  await persistAction((await params).id, body.kind, body.payload ?? {});
  return NextResponse.json({ ok: true, committedAt: new Date().toISOString() });
}
