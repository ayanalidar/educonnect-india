// GET /api/branches
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const branches = await db.branch.findMany({
    orderBy: { name: "asc" },
  });

  // Get member counts + performance per branch
  const users = await db.user.findMany();
  const students = await db.student.findMany();
  const applications = await db.application.findMany({ include: { counselor: true } });

  const branchesWithStats = branches.map((b) => {
    const branchMembers = users.filter((u) => u.branch === b.name);
    const branchStudentIds = students.filter((s) => s.counselorId && branchMembers.some((m) => m.id === s.counselorId)).map((s) => s.id);
    const branchApps = applications.filter((a) => a.counselor && branchMembers.some((m) => m.id === a.counselorId));
    const branchOffers = branchApps.filter((a) => ["OFFERED", "ACCEPTED", "ENROLLED"].includes(a.status));
    return {
      ...b,
      memberCount: branchMembers.length,
      members: branchMembers.map((m) => ({ id: m.id, name: m.name, email: m.email, role: m.role, avatarColor: m.avatarColor })),
      studentCount: branchStudentIds.length,
      applicationCount: branchApps.length,
      offerCount: branchOffers.length,
      conversionRate: branchApps.length > 0 ? Math.round((branchOffers.length / branchApps.length) * 100) : 0,
    };
  });

  return NextResponse.json({ branches: branchesWithStats });
}
