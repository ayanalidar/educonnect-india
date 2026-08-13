// GET /api/dashboard/stats — aggregated KPIs for the dashboard
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalStudents,
    activeApplications,
    offeredApplications,
    enrolledCount,
    pendingVisas,
    paidInvoices,
    totalRevenue,
    communications,
    studentsByStatus,
    applicationsByStatus,
    studentsByCountry,
    recentStudents,
    recentComms,
  ] = await Promise.all([
    db.student.count(),
    db.application.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    db.application.count({ where: { status: "OFFERED" } }),
    db.application.count({ where: { status: "ENROLLED" } }),
    db.visaApplication.count({ where: { status: { in: ["DRAFT", "DOCS_READY", "SUBMITTED", "BIO_METRIC", "INTERVIEW"] } } }),
    db.invoice.count({ where: { status: "PAID" } }),
    db.invoice.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    db.communication.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } } }),
    db.student.groupBy({ by: ["status"], _count: true }),
    db.application.groupBy({ by: ["status"], _count: true }),
    db.student.groupBy({ by: ["targetCountry"], _count: true }),
    db.student.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { _count: { select: { applications: true } } } }),
    db.communication.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { student: true } }),
  ]);

  const successRate = totalStudents > 0
    ? Math.round((enrolledCount / totalStudents) * 100)
    : 0;

  // Build 6-month revenue trend (mock — compute from paid invoices by month)
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const revenueTrend = months.map((m, i) => ({
    month: m,
    revenue: Math.round(20 + i * 4 + Math.random() * 8),
    students: Math.round(15 + i * 3 + Math.random() * 5),
  }));

  return NextResponse.json({
    kpis: {
      totalStudents,
      activeApplications,
      offeredApplications,
      enrolledCount,
      pendingVisas,
      paidInvoices,
      totalRevenue: totalRevenue._sum.amount || 0,
      communicationsThisWeek: communications,
      successRate,
    },
    charts: {
      studentsByStatus: studentsByStatus.map((s) => ({ label: s.status, value: s._count })),
      applicationsByStatus: applicationsByStatus.map((s) => ({ label: s.status, value: s._count })),
      studentsByCountry: studentsByCountry
        .filter((c) => c.targetCountry)
        .map((c) => ({ label: c.targetCountry, value: c._count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
      revenueTrend,
    },
    recent: {
      students: recentStudents,
      communications: recentComms,
    },
  });
}
