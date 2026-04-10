import { NextResponse } from "next/server";
import { logoutAction } from "@/lib/auth";

export async function POST() {
  await logoutAction();
  return NextResponse.json({ success: true });
}
