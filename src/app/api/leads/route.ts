import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIP } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = getClientIP(req);
    if (!checkRateLimit(ip, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Input validation + sanitization
    const fullName = String(body.fullName || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
    const phone = String(body.phone || "").trim().slice(0, 20);
    const consultancy = String(body.consultancy || "").trim().slice(0, 200);
    const studentCount = String(body.studentCount || "").trim().slice(0, 50);
    const interest = String(body.interest || "").trim().slice(0, 1000);

    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: "fullName, email, and phone required" }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        fullName,
        consultancy: consultancy || null,
        email,
        phone,
        studentCount: studentCount || null,
        interest: interest || null,
        status: "NEW",
      },
    });
    return NextResponse.json({ lead });
  } catch (e) {
    console.error("[leads]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
