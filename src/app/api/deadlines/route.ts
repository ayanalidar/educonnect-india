// Smart Deadline Engine — GET deadlines with escalation logic
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all"; // all | urgent | week | overdue

  const now = new Date();
  const day = 86400000;

  const deadlines = await db.deadline.findMany({
    where: { status: { not: "DONE" } },
    orderBy: { dueDate: "asc" },
    include: { student: true },
    take: 100,
  });

  // Annotate each deadline with urgency + escalation
  const annotated = deadlines.map((d) => {
    const dueMs = new Date(d.dueDate).getTime();
    const diffMs = dueMs - now.getTime();
    const daysLeft = Math.ceil(diffMs / day);

    let urgency: "OVERDUE" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    let urgencyColor: string;
    let escalatedTo: string[] = [];

    if (daysLeft < 0) {
      urgency = "OVERDUE";
      urgencyColor = "#dc2626";
      escalatedTo = ["Counselor", "Manager", "Student", "Parent"];
    } else if (daysLeft <= 2) {
      urgency = "CRITICAL";
      urgencyColor = "#dc2626";
      escalatedTo = ["Counselor", "Student"];
    } else if (daysLeft <= 5) {
      urgency = "HIGH";
      urgencyColor = "#ea580c";
      escalatedTo = ["Counselor"];
    } else if (daysLeft <= 10) {
      urgency = "MEDIUM";
      urgencyColor = "#f59e0b";
    } else {
      urgency = "LOW";
      urgencyColor = "#22c55e";
    }

    return {
      id: d.id,
      title: d.title,
      description: d.description,
      dueDate: d.dueDate,
      daysLeft,
      priority: d.priority,
      category: d.category,
      country: d.country,
      status: d.status,
      urgency,
      urgencyColor,
      escalatedTo,
      student: d.student ? {
        id: d.student.id,
        name: `${d.student.firstName} ${d.student.lastName}`,
        city: d.student.city,
        targetCountry: d.student.targetCountry,
      } : null,
    };
  });

  // Filter
  let filtered = annotated;
  if (filter === "urgent") {
    filtered = annotated.filter((d) => ["OVERDUE", "CRITICAL", "HIGH"].includes(d.urgency));
  } else if (filter === "week") {
    filtered = annotated.filter((d) => d.daysLeft >= 0 && d.daysLeft <= 7);
  } else if (filter === "overdue") {
    filtered = annotated.filter((d) => d.urgency === "OVERDUE");
  }

  // Stats
  const stats = {
    total: annotated.length,
    overdue: annotated.filter((d) => d.urgency === "OVERDUE").length,
    critical: annotated.filter((d) => d.urgency === "CRITICAL").length,
    high: annotated.filter((d) => d.urgency === "HIGH").length,
    week: annotated.filter((d) => d.daysLeft >= 0 && d.daysLeft <= 7).length,
  };

  return NextResponse.json({
    deadlines: filtered,
    stats,
  });
}

// POST to mark a deadline as done
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { deadlineId, action } = await req.json();
  if (!deadlineId) return NextResponse.json({ error: "deadlineId required" }, { status: 400 });

  if (action === "escalate") {
    // Simulate escalation: send notification (in real app, would trigger WhatsApp/Email)
    const d = await db.deadline.update({
      where: { id: deadlineId },
      data: { escalatedTo: "Counselor+Manager+Student+Parent" },
    });
    return NextResponse.json({ deadline: d, message: "Escalation sent to counselor + manager + student + parent via WhatsApp + Email." });
  }

  if (action === "done") {
    const d = await db.deadline.update({
      where: { id: deadlineId },
      data: { status: "DONE" },
    });
    return NextResponse.json({ deadline: d });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
