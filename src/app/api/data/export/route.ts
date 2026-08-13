// GET /api/data/export — DPDPA Section 11: Right to access personal data
// Returns all personal data associated with the authenticated user

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Collect all personal data associated with this user
  const [userData, students, applications, communications, invoices, appointments, auditLogs] = await Promise.all([
    db.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true, branch: true, phone: true, avatarColor: true, createdAt: true },
    }),
    db.student.findMany({
      where: { counselorId: user.id },
      select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, targetCountry: true, targetProgram: true, academicScore: true, englishScore: true, status: true, createdAt: true },
    }),
    db.application.findMany({
      where: { counselorId: user.id },
      select: { id: true, program: true, intake: true, status: true, amount: true, createdAt: true, student: { select: { firstName: true, lastName: true } }, university: { select: { name: true } } },
    }),
    db.communication.findMany({
      where: { userId: user.id },
      select: { id: true, channel: true, direction: true, subject: true, body: true, status: true, createdAt: true },
    }),
    db.invoice.findMany({
      where: { counselorId: user.id },
      select: { id: true, number: true, studentName: true, amount: true, gst: true, status: true, createdAt: true },
    }),
    db.appointment.findMany({
      where: { counselorId: user.id },
      select: { id: true, title: true, startTime: true, endTime: true, status: true, type: true, location: true },
    }),
    db.auditLog.findMany({
      where: { userId: user.id },
      select: { id: true, action: true, resource: true, details: true, severity: true, createdAt: true },
    }),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: user.email,
    dpdpaSection: "Section 11 — Right to access personal data",
    user: userData,
    students,
    applications,
    communications,
    invoices,
    appointments,
    auditLogs,
    summary: {
      totalRecords: students.length + applications.length + communications.length + invoices.length + appointments.length + auditLogs.length,
      categories: ["user", "students", "applications", "communications", "invoices", "appointments", "auditLogs"],
    },
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="educonnect-data-export-${user.email}-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
