// Document OCR — POST base64 image + docType → VLM extracts structured fields

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

const DOC_PROMPTS: Record<string, string> = {
  PASSPORT: `Extract the following fields from this passport scan and return as JSON:
{
  "fullName": "",
  "passportNumber": "",
  "nationality": "",
  "dateOfBirth": "",
  "gender": "",
  "issueDate": "",
  "expiryDate": "",
  "placeOfIssue": ""
}
Return ONLY valid JSON. If a field is not visible, leave it empty string.`,
  TRANSCRIPT: `Extract the following fields from this academic transcript and return as JSON:
{
  "institution": "",
  "degree": "",
  "fieldOfStudy": "",
  "graduationYear": "",
  "gpa": "",
  "gpaScale": "",
  "courses": "",
  "honors": ""
}
Return ONLY valid JSON. If a field is not visible, leave it empty string.`,
  IELTS_CERT: `Extract the following fields from this IELTS test report form and return as JSON:
{
  "candidateName": "",
  "candidateNumber": "",
  "testDate": "",
  "overallBand": "",
  "listening": "",
  "reading": "",
  "writing": "",
  "speaking": "",
  "validUntil": ""
}
Return ONLY valid JSON. If a field is not visible, leave it empty string.`,
  TOEFL_CERT: `Extract the following fields from this TOEFL score report and return as JSON:
{
  "candidateName": "",
  "registrationNumber": "",
  "testDate": "",
  "totalScore": "",
  "reading": "",
  "listening": "",
  "speaking": "",
  "writing": ""
}
Return ONLY valid JSON. If a field is not visible, leave it empty string.`,
  BANK_STATEMENT: `Extract the following fields from this bank statement and return as JSON:
{
  "bankName": "",
  "accountHolder": "",
  "accountNumber": "",
  "statementPeriod": "",
  "closingBalance": "",
  "currency": "",
  "averageBalance": ""
}
Return ONLY valid JSON. If a field is not visible, leave it empty string.`,
  SOP: `Analyze this Statement of Purpose and extract key insights as JSON:
{
  "wordCount": 0,
  "targetProgram": "",
  "targetUniversity": "",
  "keyThemes": "",
  "strengths": "",
  "weaknesses": "",
  "toneScore": ""
}
Return ONLY valid JSON.`,
  LOR: `Analyze this Letter of Recommendation and extract key info as JSON:
{
  "recommenderName": "",
  "recommenderTitle": "",
  "recommenderOrg": "",
  "candidateName": "",
  "relationship": "",
  "recommendationStrength": "",
  "keyPoints": ""
}
Return ONLY valid JSON.`,
  RESUME: `Extract key info from this resume/CV as JSON:
{
  "fullName": "",
  "email": "",
  "phone": "",
  "currentRole": "",
  "yearsOfExperience": 0,
  "education": "",
  "skills": "",
  "topCompanies": ""
}
Return ONLY valid JSON.`,
};

const DEFAULT_PROMPT = `Extract all visible text from this document and structure it as JSON. Return ONLY valid JSON with field names as keys.`;

const DOC_LABELS: Record<string, string> = {
  PASSPORT: "Passport",
  TRANSCRIPT: "Academic Transcript",
  IELTS_CERT: "IELTS Certificate",
  TOEFL_CERT: "TOEFL Certificate",
  BANK_STATEMENT: "Bank Statement",
  SOP: "Statement of Purpose",
  LOR: "Letter of Recommendation",
  RESUME: "Resume / CV",
};

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { imageBase64, docType, studentId, fileName = "upload.jpg" } = body as {
    imageBase64?: string;
    docType?: string;
    studentId?: string;
    fileName?: string;
  };

  if (!imageBase64 || !docType) {
    return NextResponse.json({ error: "imageBase64 and docType required" }, { status: 400 });
  }

  if (!DOC_PROMPTS[docType]) {
    return NextResponse.json({ error: `Unsupported docType. Supported: ${Object.keys(DOC_PROMPTS).join(", ")}` }, { status: 400 });
  }

  // Cap base64 size (avoid huge payloads)
  if (imageBase64.length > 5_000_000) {
    return NextResponse.json({ error: "Image too large (max ~3.5 MB)" }, { status: 413 });
  }

  let extracted: Record<string, string> = {};
  let summary = "";
  let confidence = 0.7;
  let ocrError: string | null = null;

  try {
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    const prompt = DOC_PROMPTS[docType];
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageBase64 } },
          ],
        },
      ],
      thinking: { type: "disabled" },
    });

    const content = response.choices[0]?.message?.content || "";
    const cleaned = content.replace(/```json\s*|```/g, "").trim();
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      extracted = { raw_text: content };
    }

    // Confidence: count non-empty fields
    const filled = Object.values(extracted).filter((v) => v && String(v).trim()).length;
    const total = Object.keys(extracted).length || 1;
    confidence = Math.min(0.98, 0.5 + (filled / total) * 0.5);

    summary = `${DOC_LABELS[docType]} processed — ${filled}/${total} fields extracted with ${Math.round(confidence * 100)}% confidence.`;
  } catch (err) {
    console.error("[documents/ocr] VLM failed:", err);
    ocrError = (err as Error).message;
    summary = `OCR processing failed: ${ocrError}`;
    confidence = 0;
    extracted = { error: ocrError };
  }

  // Persist to DB
  const doc = await db.documentRecord.create({
    data: {
      studentId: studentId || null,
      docType,
      fileName,
      extractedData: JSON.stringify(extracted),
      summary,
      confidence,
      status: ocrError ? "REJECTED" : "EXTRACTED",
    },
  });

  return NextResponse.json({
    document: {
      id: doc.id,
      docType: doc.docType,
      fileName: doc.fileName,
      extractedData: extracted,
      summary,
      confidence,
      status: doc.status,
      createdAt: doc.createdAt,
    },
  });
}
