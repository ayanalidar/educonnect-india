// GET /api/audit-logs — compliance audit trail
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const resource = searchParams.get("resource");
  const severity = searchParams.get("severity");

  const where: Record<string, unknown> = {};
  if (action && action !== "all") where.action = action;
  if (resource && resource !== "all") where.resource = resource;
  if (severity && severity !== "all") where.severity = severity;

  const logs = await db.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const stats = {
    total: logs.length,
    info: logs.filter((l) => l.severity === "INFO").length,
    warning: logs.filter((l) => l.severity === "WARNING").length,
    critical: logs.filter((l) => l.severity === "CRITICAL").length,
  };

  return NextResponse.json({ logs, stats });
}

// POST to create a new audit log entry (called from various places)
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, resource, resourceId, details, severity = "INFO" } = await req.json();
  if (!action || !resource) {
    return NextResponse.json({ error: "action and resource required" }, { status: 400 });
  }

  const log = await db.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      action,
      resource,
      resourceId: resourceId || null,
      details: details || "",
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      severity,
    },
  });

  return NextResponse.json({ log });
}
