// AI Course Matcher — POST studentId → ranked universities with fit scores
// Uses deterministic scoring + LLM-generated personalized explanation
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

type ScoredUni = {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number | null;
  tuitionFee: number | null;
  applicationFee: number | null;
  logoColor: string;
  popularCourses: string;
  commission: number | null;
  minIelts: number | null;
  minToefl: number | null;
  minGpa: number | null;
  matchScore: number; // 0-100
  fitBreakdown: {
    academic: number;
    english: number;
    budget: number;
    country: number;
    ranking: number;
  };
  tier: "REACH" | "TARGET" | "SAFETY";
};

function parseEnglishScore(raw: string | null | undefined): { ielts: number | null; toefl: number | null } {
  if (!raw) return { ielts: null, toefl: null };
  const ieltsMatch = raw.match(/ielts\s*([\d.]+)/i);
  const toeflMatch = raw.match(/toefl\s*(\d+)/i);
  return {
    ielts: ieltsMatch ? parseFloat(ieltsMatch[1]) : null,
    toefl: toeflMatch ? parseInt(toeflMatch[1], 10) : null,
  };
}

function scoreUniversity(student: {
  academicScore: number | null;
  englishScore: string | null;
  budget: number | null;
  targetCountry: string | null;
  targetProgram: string | null;
}, uni: {
  minGpa: number | null;
  minIelts: number | null;
  minToefl: number | null;
  tuitionFee: number | null;
  country: string;
  ranking: number | null;
  popularCourses: string;
}): { score: number; breakdown: ScoredUni["fitBreakdown"]; tier: "REACH" | "TARGET" | "SAFETY" } {
  // Academic fit (0-30) — student's score vs uni min GPA
  let academic = 15;
  if (student.academicScore != null && uni.minGpa != null) {
    // Student score is on 10-scale typically (Indian), uni minGpa is 4-scale
    // Normalize: convert student score to 4-scale: (score/10) * 4
    const studentGpa4 = (student.academicScore / 10) * 4;
    const diff = studentGpa4 - uni.minGpa;
    academic = Math.max(0, Math.min(30, 15 + diff * 10));
  }

  // English fit (0-25) — IELTS/TOEFL vs cutoffs
  let english = 12;
  const stuEng = parseEnglishScore(student.englishScore);
  if (stuEng.ielts != null && uni.minIelts != null) {
    const diff = stuEng.ielts - uni.minIelts;
    english = Math.max(0, Math.min(25, 12 + diff * 8));
  } else if (stuEng.toefl != null && uni.minToefl != null) {
    const diff = stuEng.toefl - uni.minToefl;
    english = Math.max(0, Math.min(25, 12 + diff * 0.3));
  }

  // Budget fit (0-20) — student budget (INR lakhs) vs tuition (USD/yr)
  // Convert: tuition_usd * 83 / 100000 = INR lakhs per year
  let budget = 10;
  if (student.budget != null && uni.tuitionFee != null) {
    const tuitionInrLakhs = (uni.tuitionFee * 83) / 100000;
    const ratio = student.budget / Math.max(1, tuitionInrLakhs);
    if (ratio >= 2) budget = 20;
    else if (ratio >= 1.2) budget = 17;
    else if (ratio >= 1) budget = 14;
    else if (ratio >= 0.7) budget = 8;
    else budget = 3;
  }

  // Country preference (0-15)
  let country = 5;
  if (student.targetCountry && uni.country) {
    if (student.targetCountry.toLowerCase() === uni.country.toLowerCase()) {
      country = 15;
    } else {
      country = 3;
    }
  }

  // Ranking bonus (0-10) — better ranked = higher bonus but also harder
  let ranking = 5;
  if (uni.ranking && uni.ranking > 0) {
    if (uni.ranking <= 20) ranking = 10;
    else if (uni.ranking <= 50) ranking = 8;
    else if (uni.ranking <= 100) ranking = 6;
    else if (uni.ranking <= 200) ranking = 5;
    else ranking = 4;
  }

  const score = Math.round(academic + english + budget + country + ranking);

  // Tier: 75+ = reach (hard), 55-74 = target, <55 = safety
  // But this is inverted — actually we want:
  // Higher score = better fit, but high-ranked unis are still "reach" programs
  let tier: "REACH" | "TARGET" | "SAFETY";
  if (uni.ranking && uni.ranking <= 30) tier = "REACH";
  else if (score >= 65) tier = "TARGET";
  else tier = "SAFETY";

  return { score, breakdown: { academic: Math.round(academic), english: Math.round(english), budget: Math.round(budget), country: Math.round(country), ranking: Math.round(ranking) }, tier };
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { studentId, explain = false } = await req.json();
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const universities = await db.university.findMany({ take: 300 });

  const scored: ScoredUni[] = universities
    .map((u) => {
      const { score, breakdown, tier } = scoreUniversity(student, u);
      return {
        id: u.id,
        name: u.name,
        country: u.country,
        city: u.city,
        ranking: u.ranking,
        tuitionFee: u.tuitionFee,
        applicationFee: u.applicationFee,
        logoColor: u.logoColor,
        popularCourses: u.popularCourses,
        commission: u.commission,
        minIelts: u.minIelts,
        minToefl: u.minToefl,
        minGpa: u.minGpa,
        matchScore: score,
        fitBreakdown: breakdown,
        tier,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12);

  // Optional LLM explanation for top 3
  let explanations: Record<string, string> = {};
  if (explain && scored.length > 0) {
    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      const zai = await ZAI.create();
      const top3 = scored.slice(0, 3);

      const prompt = `You are an expert Indian education counselor. In 2 short sentences (max 60 words each), explain why each of these 3 universities is a good fit for the student. Be specific, warm, and practical. Return as JSON: {"univId": "explanation"}.

STUDENT PROFILE:
- Name: ${student.firstName} ${student.lastName}
- City: ${student.city}, India
- Academic: ${student.academicScore || "not specified"}/10
- English: ${student.englishScore || "not specified"}
- Target country: ${student.targetCountry || "open"}
- Target program: ${student.targetProgram || "not specified"}
- Budget: ${student.budget ? student.budget + " lakhs INR" : "not specified"}
- Intake: ${student.intake || "not specified"}

UNIVERSITIES (in priority order):
${top3.map((u, i) => `${i + 1}. ID: ${u.id} | ${u.name} (${u.country}) | World Rank: ${u.ranking || "N/A"} | Tuition: $${u.tuitionFee}/yr | Min IELTS: ${u.minIelts || "N/A"} | Min GPA: ${u.minGpa || "N/A"} | Match score: ${u.matchScore}/100 | Tier: ${u.tier}`).join("\n")}

Return ONLY valid JSON, no markdown.`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: "You are an education counselor AI that returns ONLY valid JSON. No markdown, no prose outside JSON." },
          { role: "user", content: prompt },
        ],
        thinking: { type: "disabled" },
      });

      const content = completion.choices[0]?.message?.content || "";
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\s*|```/g, "").trim();
      explanations = JSON.parse(cleaned);
    } catch (err) {
      console.error("[matcher LLM] failed:", err);
      // Fallback explanations
      scored.slice(0, 3).forEach((u) => {
        explanations[u.id] = `${u.name} matches ${student.firstName}'s profile with a ${u.matchScore}% fit score. The ${u.tier.toLowerCase()} tier program offers strong alignment with their academic background and target destination.`;
      });
    }
  }

  return NextResponse.json({
    student: {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      academicScore: student.academicScore,
      englishScore: student.englishScore,
      budget: student.budget,
      targetCountry: student.targetCountry,
      targetProgram: student.targetProgram,
    },
    recommendations: scored,
    explanations,
  });
}
