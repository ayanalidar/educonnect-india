// Parent messages — GET to fetch, POST to send
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

async function getParent(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload || !payload.sub.startsWith("PARENT:")) return null;
  const parentId = payload.sub.replace("PARENT:", "");
  return db.parent.findUnique({
    where: { id: parentId },
    include: {
      students: {
        include: {
          student: {
            include: {
              applications: { include: { university: true } },
              visas: true,
            },
          },
        },
      },
      messages: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
}

export async function GET(req: Request) {
  const parent = await getParent(req);
  if (!parent) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    messages: parent.messages,
    students: parent.students.map((ps) => ({
      id: ps.student.id,
      firstName: ps.student.firstName,
      lastName: ps.student.lastName,
      city: ps.student.city,
      targetCountry: ps.student.targetCountry,
      targetProgram: ps.student.targetProgram,
      intake: ps.student.intake,
      status: ps.student.status,
      academicScore: ps.student.academicScore,
      englishScore: ps.student.englishScore,
      applications: ps.student.applications.map((a) => ({
        id: a.id,
        program: a.program,
        intake: a.intake,
        status: a.status,
        university: {
          name: a.university.name,
          country: a.university.country,
          logoColor: a.university.logoColor,
        },
      })),
      visas: ps.student.visas.map((v) => ({
        id: v.id,
        country: v.country,
        status: v.status,
      })),
    })),
  });
}

export async function POST(req: Request) {
  const parent = await getParent(req);
  if (!parent) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { body, studentId } = await req.json();
  if (!body) return NextResponse.json({ error: "body required" }, { status: 400 });

  const msg = await db.parentMessage.create({
    data: {
      parentId: parent.id,
      studentId: studentId || parent.students[0]?.studentId || null,
      fromRole: "PARENT",
      body,
    },
  });

  return NextResponse.json({ message: msg });
}
