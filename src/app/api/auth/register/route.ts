import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, makeToken, checkRateLimit, getClientIP } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = getClientIP(req);
    if (!checkRateLimit(ip, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many sign-up attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { name, email, password, branch, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
    }

    // Input validation
    if (name.length > 100 || email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: "Invalid input length" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const colors = ["#e85d2f", "#0f766e", "#f59e0b", "#1c1410"];
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashPassword(password),
        role: "ADMIN",
        branch: branch?.trim() || null,
        phone: phone?.trim() || null,
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
      },
    });

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
    console.error("[auth/register]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
