import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, makeToken, checkRateLimit, getClientIP } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = getClientIP(req);
    if (!checkRateLimit(ip, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const parent = await db.parent.findUnique({
      where: { email: email.toLowerCase().trim() },
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
      },
    });

    if (!parent || !verifyPassword(password, parent.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = makeToken(`PARENT:${parent.id}`);
    return NextResponse.json({
      token,
      parent: {
        id: parent.id,
        email: parent.email,
        name: parent.name,
        phone: parent.phone,
        avatarColor: parent.avatarColor,
      },
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
  } catch (e) {
    console.error("[parent-login]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
