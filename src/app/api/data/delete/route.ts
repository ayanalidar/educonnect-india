// DELETE /api/data/delete — DPDPA Section 12: Right to erasure
// Deletes all personal data associated with the authenticated user (except audit logs required by law)

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest, verifyPassword } from "@/lib/auth";

export async function DELETE(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Require password confirmation for erasure
  const { password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: "Password confirmation required for data deletion" }, { status: 400 });
  }

  const fullUser = await db.user.findUnique({ where: { id: user.id } });
  if (!fullUser || !verifyPassword(password, fullUser.passwordHash)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Log the erasure request BEFORE deleting (audit trail must survive)
  await db.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      action: "DELETE",
      resource: "USER",
      resourceId: user.id,
      details: `User requested complete data erasure (DPDPA Section 12). All personal data deleted.`,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      severity: "CRITICAL",
    },
  });

  // Delete all user's data in dependency order
  // Communications
  await db.communication.deleteMany({ where: { userId: user.id } });
  // Invoices
  await db.invoice.deleteMany({ where: { counselorId: user.id } });
  // Appointments
  await db.appointment.deleteMany({ where: { counselorId: user.id } });
  // Applications (only those where user is counselor)
  await db.application.deleteMany({ where: { counselorId: user.id } });
  // Students (only those assigned to this counselor)
  await db.student.deleteMany({ where: { counselorId: user.id } });
  // Consultant profile
  await db.consultantProfile.deleteMany({ where: { userId: user.id } });
  // User account
  await db.user.delete({ where: { id: user.id } });

  return NextResponse.json({
    success: true,
    message: "All personal data has been deleted. Audit log of this deletion is retained per DPDP Act requirements.",
    dpdpaSection: "Section 12 — Right to erasure",
  });
}
