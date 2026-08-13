// GET /api/referrals + POST /api/referrals
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;

  const referrals = await db.referral.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const stats = {
    total: referrals.length,
    converted: referrals.filter((r) => r.status === "CONVERTED").length,
    pending: referrals.filter((r) => r.status === "PENDING").length,
    totalCommission: referrals.reduce((s, r) => s + (r.commissionAmount || 0), 0),
    paidCommission: referrals.filter((r) => r.commissionStatus === "PAID").reduce((s, r) => s + (r.commissionAmount || 0), 0),
    dueCommission: referrals.filter((r) => r.commissionStatus === "DUE").reduce((s, r) => s + (r.commissionAmount || 0), 0),
  };

  return NextResponse.json({ referrals, stats });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.referrerName || !body.referrerEmail) {
    return NextResponse.json({ error: "referrerName and referrerEmail required" }, { status: 400 });
  }

  // Generate unique code
  const slug = body.referrerName.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6);
  const code = `${slug}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const ref = await db.referral.create({
    data: {
      code,
      referrerName: body.referrerName,
      referrerEmail: body.referrerEmail,
      referrerPhone: body.referrerPhone || null,
      referrerType: body.referrerType || "ALUMNI",
      refereeName: body.refereeName || null,
      refereeEmail: body.refereeEmail || null,
      refereePhone: body.refereePhone || null,
      status: "PENDING",
      commissionAmount: 0,
      commissionStatus: "NONE",
      notes: body.notes || null,
    },
  });

  return NextResponse.json({ referral: ref });
}

// PUT to update status (convert, pay commission, etc.)
export async function PUT(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { referralId, status, commissionAmount, commissionStatus } = await req.json();
  if (!referralId) return NextResponse.json({ error: "referralId required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (commissionAmount !== undefined) data.commissionAmount = Number(commissionAmount);
  if (commissionStatus) data.commissionStatus = commissionStatus;
  if (status === "CONVERTED") data.convertedAt = new Date();

  const ref = await db.referral.update({
    where: { id: referralId },
    data,
  });

  return NextResponse.json({ referral: ref });
}
