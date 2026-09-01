import { NextResponse } from "next/server";
import { getOrder } from "../../../../lib/db";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { return NextResponse.json(await getOrder((await params).id)); }
