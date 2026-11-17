import { NextResponse } from "next/server";
import { buildRecommendation, recommendationInputSchema } from "@/lib/recommendation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send a valid assessment." }, { status: 400 });
  }

  const parsed = recommendationInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Some assessment details need another look." }, { status: 400 });
  }

  return NextResponse.json({ recommendation: buildRecommendation(parsed.data) });
}
