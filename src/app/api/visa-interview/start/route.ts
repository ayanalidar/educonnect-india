// Start visa interview session — generates country-specific questions

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

const COUNTRY_CONFIG: Record<string, { visaType: string; questions: string[] }> = {
  "United Kingdom": {
    visaType: "Tier 4 (Student)",
    questions: [
      "Why did you choose to study in the UK?",
      "Why did you select this particular university and course?",
      "How will this course help your career plans?",
      "What is your plan after completing the course?",
      "How are you funding your studies and living expenses?",
      "Do you have family in the UK? Will you return to India after?",
      "Tell me about your academic background.",
      "What is your English proficiency score?",
      "Have you ever been refused a visa to any country?",
      "What will you do if your visa is rejected?",
    ],
  },
  "United States": {
    visaType: "F-1 (Student)",
    questions: [
      "Why did you choose the United States for your studies?",
      "Why not study this course in India?",
      "What is your university and why did you choose it?",
      "How are you paying for your education in the US?",
      "What are your plans after graduation? Will you return to India?",
      "Do you have any relatives in the United States?",
      "Tell me about your undergraduate studies.",
      "What is your GRE/GMAT score?",
      "How will this degree benefit you in India?",
      "Have you ever been to the US before?",
    ],
  },
  "Canada": {
    visaType: "Study Permit",
    questions: [
      "Why did you choose Canada for your studies?",
      "Why this particular university and program?",
      "How will this program help your career in India?",
      "Who is sponsoring your education?",
      "What is your IELTS score?",
      "Do you have family in Canada?",
      "What is your plan after completing your studies?",
      "Have you ever been refused a Canadian visa?",
      "Tell me about your previous education.",
      "What is the course duration and tuition fee?",
    ],
  },
  "Australia": {
    visaType: "Subclass 500 (Student)",
    questions: [
      "Why did you choose Australia over other countries?",
      "Why did you select this university and course?",
      "What is your GS (Genuine Student) statement?",
      "How are you funding your studies?",
      "What are your career plans after this course?",
      "Do you have family in Australia?",
      "Tell me about your academic background.",
      "What is your English test score?",
      "Have you ever been refused an Australian visa?",
      "What will you do if you don't get a visa?",
    ],
  },
  "Ireland": {
    visaType: "Long Stay D (Student)",
    questions: [
      "Why did you choose Ireland for your studies?",
      "Why this particular course and university?",
      "How does this course fit your career goals?",
      "Who is funding your education?",
      "What is your IELTS score?",
      "Do you have family in Ireland?",
      "What is your plan after graduation?",
      "Tell me about your previous studies.",
      "Have you ever been refused a visa?",
      "What do you know about Irish culture?",
    ],
  },
  "Germany": {
    visaType: "Student Visa",
    questions: [
      "Why did you choose Germany for your studies?",
      "Why this particular university and program?",
      "Is your course in English or German? What is your language level?",
      "How are you funding your studies?",
      "What is your plan after completing the course?",
      "Do you have family in Germany?",
      "Tell me about your academic background.",
      "What is your IELTS score?",
      "Have you ever been refused a visa?",
      "Why not study this in India?",
    ],
  },
  "Singapore": {
    visaType: "Student Pass",
    questions: [
      "Why did you choose Singapore for your studies?",
      "Why this university and program?",
      "How will this course help your career?",
      "Who is sponsoring your education?",
      "What is your English proficiency score?",
      "Do you have family in Singapore?",
      "What are your plans after graduation?",
      "Tell me about your previous education.",
      "Have you been to Singapore before?",
      "What do you know about Singapore's culture?",
    ],
  },
};

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { studentId, country, universityName, programName } = await req.json();
  if (!country) return NextResponse.json({ error: "country required" }, { status: 400 });

  const config = COUNTRY_CONFIG[country] || COUNTRY_CONFIG["United Kingdom"];

  const session = await db.visaInterviewSession.create({
    data: {
      studentId: studentId || null,
      country,
      universityName: universityName || null,
      programName: programName || null,
      questions: JSON.stringify(config.questions.map((q) => ({ question: q, answer: null, score: null, feedback: null }))),
      overallScore: 0,
      status: "IN_PROGRESS",
    },
  });

  return NextResponse.json({
    sessionId: session.id,
    country,
    visaType: config.visaType,
    questions: config.questions,
    totalQuestions: config.questions.length,
  });
}
