import { NextResponse } from "next/server";
import { getProject } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  try {
    const res = await getProject(id);
    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}
