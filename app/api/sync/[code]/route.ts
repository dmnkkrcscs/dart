import { NextRequest } from "next/server";
import { CODE_REGEX, deleteBackupRow, readBackup, writeBackup } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 512 * 1024;

function badCode() {
  return Response.json({ error: "invalid code" }, { status: 400 });
}

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code?.toUpperCase();
  if (!code || !CODE_REGEX.test(code)) return badCode();
  const data = readBackup(code);
  if (data == null) return Response.json({ error: "not found" }, { status: 404 });
  return new Response(data, { headers: { "content-type": "application/json" } });
}

export async function PUT(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code?.toUpperCase();
  if (!code || !CODE_REGEX.test(code)) return badCode();
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return Response.json({ error: "content-type must be application/json" }, { status: 415 });
  }
  const len = Number(req.headers.get("content-length") || "0");
  if (len > MAX_BYTES) {
    return Response.json({ error: "payload too large" }, { status: 413 });
  }
  const text = await req.text();
  if (text.length > MAX_BYTES) {
    return Response.json({ error: "payload too large" }, { status: 413 });
  }
  try {
    JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }
  writeBackup(code, text);
  return Response.json({ ok: true, code, updated: Date.now() });
}

export async function DELETE(_req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code?.toUpperCase();
  if (!code || !CODE_REGEX.test(code)) return badCode();
  const removed = deleteBackupRow(code);
  return Response.json({ ok: true, removed });
}
