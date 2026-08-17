import { NextResponse } from "next/server";

export function errorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Unknown error";
  const status = message.includes("ANTHROPIC_API_KEY") ? 500 : 502;
  return NextResponse.json({ error: message }, { status });
}
