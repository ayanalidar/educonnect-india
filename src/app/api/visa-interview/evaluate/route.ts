// Evaluate visa interview answer — LLM scores + feedback

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, questionIndex, question, answer } = await req.json();
  if (!sessionId || question === undefined || !answer) {
    return NextResponse.json({ error: "sessionId, question, and answer required" }, { status: 400 });
  }

  // Fetch session
  const session = await db.visaInterviewSession.findUnique({ where: { id: sessionId } });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  // LLM evaluation
  let score = 70;
  let feedback = "Good response. Try to be more specific with examples.";
  let strengths = ["Clear structure", "Confident tone"];
  let improvements = ["Add concrete examples", "Be more concise"];

  try {
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `You are a strict but fair visa officer evaluating a student visa interview answer for ${session.country} (${session.universityName || "a top university"}, ${session.programName || "graduate program"}). Score the answer from 0-100 based on:
- Clarity and structure (25)
- Specificity and concrete examples (25)
- Conviction and intent to return (25)
- Language proficiency (25)

Return ONLY valid JSON: {"score": 0-100, "feedback": "1-2 sentence overall feedback", "strengths": ["strength1", "strength2"], "improvements": ["improvement1", "improvement2"]}

Question asked: "${question}"
Student's answer: "${answer}"`,
        },
        { role: "user", content: "Evaluate this interview answer." },
      ],
      thinking: { type: "disabled" },
    });
    const content = completion.choices[0]?.message?.content || "";
    const cleaned = content.replace(/```json\s*|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    score = parsed.score;
    feedback = parsed.feedback;
    strengths = parsed.strengths || strengths;
    improvements = parsed.improvements || improvements;
  } catch (err) {
    console.error("[visa-interview/evaluate] LLM failed:", err);
    // Fallback rule-based scoring
    const len = answer.split(/\s+/).length;
    if (len < 20) {
      score = 35;
      feedback = "Answer is too short. Visa officers expect detailed responses (at least 50 words).";
      improvements = ["Expand your answer", "Add specific examples", "Mention concrete plans"];
    } else if (len > 100) {
      score = 75;
      feedback = "Detailed answer. Could be more structured — visa officers prefer concise, focused responses.";
    } else {
      score = 65;
      feedback = "Reasonable length. Add specific details about your university, course, and career plans.";
    }
  }

  // Update session
  const questions = JSON.parse(session.questions);
  questions[questionIndex] = {
    question,
    answer,
    score,
    feedback,
    strengths,
    improvements,
  };
  await db.visaInterviewSession.update({
    where: { id: sessionId },
    data: { questions: JSON.stringify(questions) },
  });

  return NextResponse.json({
    questionIndex,
    score,
    feedback,
    strengths,
    improvements,
  });
}

// Finalize session — compute overall score
export async function PUT(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  const session = await db.visaInterviewSession.findUnique({ where: { id: sessionId } });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const questions = JSON.parse(session.questions);
  const answered = questions.filter((q: { answer: string | null; score: number | null }) => q.answer && q.score !== null);
  const overall = answered.length > 0
    ? Math.round(answered.reduce((s: number, q: { score: number }) => s + q.score, 0) / answered.length)
    : 0;

  await db.visaInterviewSession.update({
    where: { id: sessionId },
    data: { overallScore: overall, status: "COMPLETED" },
  });

  let recommendation: string;
  if (overall >= 85) recommendation = "Excellent! You're well-prepared for the real interview. Practice 1-2 more times for confidence.";
  else if (overall >= 70) recommendation = "Good preparation. Review the feedback on weaker answers and practice them again.";
  else if (overall >= 50) recommendation = "Needs work. Focus on adding specific examples and being more concise. Practice daily.";
  else recommendation = "Significant improvement needed. We recommend booking a 1-on-1 session with your counselor before the real interview.";

  return NextResponse.json({
    sessionId,
    overallScore: overall,
    totalAnswered: answered.length,
    totalQuestions: questions.length,
    recommendation,
    questions: answered,
  });
}
