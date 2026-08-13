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

    // Input validation
    if (email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = makeToken(user.id);
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        branch: user.branch,
        phone: user.phone,
        avatarColor: user.avatarColor,
      },
    });
  } catch (e) {
    console.error("[auth/login]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
