// GET /api/consultant-profiles/me — get own profile
// PUT /api/consultant-profiles/me — update own profile
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let profile = await db.consultantProfile.findUnique({
    where: { userId: user.id },
  });

  // Auto-create if doesn't exist
  if (!profile) {
    const slug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    profile = await db.consultantProfile.create({
      data: {
        userId: user.id,
        slug,
        tagline: "Expert Education Counselor",
        bio: "",
        specialization: "Study Abroad",
        yearsExperience: 5,
        studentsPlaced: 0,
        successRate: 0,
        rating: 5.0,
        photoColor: user.avatarColor,
        phone: user.phone,
        email: user.email,
        city: user.branch,
      },
    });
  }

  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Ensure slug is unique
  if (body.slug) {
    body.slug = body.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Convert numeric fields
  for (const f of ["yearsExperience", "studentsPlaced", "successRate"]) {
    if (body[f] !== undefined) body[f] = Number(body[f]);
  }
  if (body.rating !== undefined) body.rating = parseFloat(body.rating);

  let profile = await db.consultantProfile.findUnique({ where: { userId: user.id } });

  if (!profile) {
    const slug = body.slug || user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    profile = await db.consultantProfile.create({
      data: { userId: user.id, slug, ...body },
    });
  } else {
    profile = await db.consultantProfile.update({
      where: { userId: user.id },
      data: body,
    });
  }

  return NextResponse.json({ profile });
}
