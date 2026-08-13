// Scholarship Finder — POST studentId → matched scholarships with eligibility %
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

function parseEnglishScore(raw: string | null | undefined): { ielts: number | null; toefl: number | null } {
  if (!raw) return { ielts: null, toefl: null };
  const ieltsMatch = raw.match(/ielts\s*([\d.]+)/i);
  const toeflMatch = raw.match(/toefl\s*(\d+)/i);
  return {
    ielts: ieltsMatch ? parseFloat(ieltsMatch[1]) : null,
    toefl: toeflMatch ? parseInt(toeflMatch[1], 10) : null,
  };
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { studentId } = await req.json();
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const scholarships = await db.scholarship.findMany();
  const stuEng = parseEnglishScore(student.englishScore);

  const scored = scholarships
    .map((s) => {
      // Match score: 0-100 based on 4 factors
      let score = 30; // base
      const reasons: string[] = [];

      // Country match (40)
      if (s.country === "Any" || s.country === "ANY") {
        score += 30;
        reasons.push("Open to any destination");
      } else if (student.targetCountry && s.country.toLowerCase() === student.targetCountry.toLowerCase()) {
        score += 40;
        reasons.push(`Perfect match for ${student.targetCountry}`);
      } else if (student.targetCountry && s.country.toLowerCase() !== student.targetCountry.toLowerCase()) {
        score -= 30; // wrong country
      }

      // Academic score (30)
      if (student.academicScore && s.minScore) {
        if (student.academicScore >= s.minScore) {
          score += 30;
          reasons.push(`Academic ${student.academicScore}/10 ≥ required ${s.minScore}`);
        } else {
          score -= 20;
          reasons.push(`Academic ${student.academicScore}/10 below required ${s.minScore}`);
        }
      } else if (!s.minScore) {
        score += 15;
        reasons.push("No academic cutoff");
      }

      // English (20)
      if (s.minIelts && stuEng.ielts) {
        if (stuEng.ielts >= s.minIelts) {
          score += 20;
          reasons.push(`IELTS ${stuEng.ielts} ≥ required ${s.minIelts}`);
        } else {
          score -= 10;
        }
      } else if (s.minToefl && stuEng.toefl) {
        if (stuEng.toefl >= s.minToefl) {
          score += 20;
          reasons.push(`TOEFL ${stuEng.toefl} ≥ required ${s.minToefl}`);
        } else {
          score -= 10;
        }
      } else if (!s.minIelts && !s.minToefl) {
        score += 10;
        reasons.push("No English cutoff");
      }

      // Level match (10)
      if (s.level === "ANY") {
        score += 5;
      } else if (student.targetProgram) {
        const isUG = /b\.?tech|b\.?e\.?|b\.?sc|b\.?a\b|bachelor/i.test(student.targetProgram);
        const isPG = /m\.?sc|m\.?tech|m\.?a\b|mba|master/i.test(student.targetProgram);
        const isPhd = /phd|doctoral|research/i.test(student.targetProgram);
        const stuLevel = isPhd ? "PHD" : isPG ? "PG" : isUG ? "UG" : "PG";
        if (s.level === stuLevel) {
          score += 10;
          reasons.push(`${s.level} level match`);
        }
      }

      score = Math.max(0, Math.min(100, score));
      const eligible = score >= 60;
      return {
        id: s.id, name: s.name, provider: s.provider, country: s.country,
        amount: s.amount, amountLabel: s.amountLabel, level: s.level,
        categories: s.categories, minScore: s.minScore, minIelts: s.minIelts, minToefl: s.minToefl,
        deadline: s.deadline, intake: s.intake, fields: s.fields, website: s.website,
        logoColor: s.logoColor, description: s.description,
        matchScore: score, eligible, reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json({
    student: {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      academicScore: student.academicScore,
      englishScore: student.englishScore,
      targetCountry: student.targetCountry,
      targetProgram: student.targetProgram,
    },
    scholarships: scored,
  });
}
