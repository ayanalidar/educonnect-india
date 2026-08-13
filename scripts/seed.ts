// Seed EduConnect India with real university data + a demo counselor account
// Made & maintained by GuardianX
// Run: bun run scripts/seed.ts

import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto
    .createHmac("sha256", process.env.AUTH_SECRET || "educonnect-dev-secret")
    .update(password)
    .digest("hex");
}

const UNIVERSITIES = [
  // ============ India ============
  { name: "Indian Institute of Technology Bombay", country: "India", city: "Mumbai", ranking: 149, qs: 4.6, appFee: 35, tuition: 4500, courses: "B.Tech, M.Tech, MBA, PhD", intakes: "Aug", ielts: 6.5, toefl: 80, gpa: 3.5, color: "#e85d2f", type: "PUBLIC", commission: 0 },
  { name: "Indian Institute of Management Ahmedabad", country: "India", city: "Ahmedabad", ranking: 53, qs: 5.0, appFee: 50, tuition: 32000, courses: "PGP, MBA, FPM, Exec MBA", intakes: "Jun", ielts: 7.0, toefl: 100, gpa: 3.6, color: "#0f766e", type: "PUBLIC", commission: 0 },
  { name: "BITS Pilani", country: "India", city: "Pilani", ranking: 188, qs: 4.4, appFee: 40, tuition: 7000, courses: "B.E., M.E., MBA, M.Sc", intakes: "Aug", ielts: 6.5, toefl: 80, gpa: 3.5, color: "#f59e0b", type: "PRIVATE", commission: 5 },
  { name: "University of Delhi", country: "India", city: "Delhi", ranking: 328, qs: 4.2, appFee: 25, tuition: 3000, courses: "BA, B.Sc, B.Com, MA, M.Sc", intakes: "Jul", ielts: 6.0, toefl: 75, gpa: 3.0, color: "#e85d2f", type: "PUBLIC", commission: 0 },
  { name: "Christ University", country: "India", city: "Bengaluru", ranking: 851, qs: 4.0, appFee: 50, tuition: 5000, courses: "BCA, BBA, MBA, B.Com", intakes: "Jun, Dec", ielts: 6.0, toefl: 75, gpa: 3.0, color: "#0f766e", type: "PRIVATE", commission: 8 },
  { name: "Symbiosis International University", country: "India", city: "Pune", ranking: 721, qs: 4.0, appFee: 60, tuition: 6000, courses: "MBA, BBA, LLM, B.A. LLB", intakes: "Jul", ielts: 6.5, toefl: 80, gpa: 3.2, color: "#f59e0b", type: "PRIVATE", commission: 8 },
  { name: "VIT Vellore", country: "India", city: "Vellore", ranking: 851, qs: 4.0, appFee: 40, tuition: 5500, courses: "B.Tech, M.Tech, MBA", intakes: "Jul", ielts: 6.0, toefl: 75, gpa: 3.2, color: "#e85d2f", type: "PRIVATE", commission: 7 },
  { name: "Amrita Vishwa Vidyapeetham", country: "India", city: "Coimbatore", ranking: 801, qs: 4.0, appFee: 35, tuition: 5000, courses: "B.Tech, MBA, M.Sc", intakes: "Aug", ielts: 6.0, toefl: 75, gpa: 3.0, color: "#0f766e", type: "PRIVATE", commission: 7 },
  { name: "Ashoka University", country: "India", city: "Sonipat", ranking: 0, qs: 4.3, appFee: 75, tuition: 12000, courses: "BA, B.Sc (Hons), Liberal Arts", intakes: "Aug", ielts: 6.5, toefl: 85, gpa: 3.4, color: "#f59e0b", type: "PRIVATE", commission: 6 },
  { name: "Manipal Academy of Higher Education", country: "India", city: "Manipal", ranking: 751, qs: 4.0, appFee: 50, tuition: 6500, courses: "MBBS, B.Tech, MBA, BPT", intakes: "Aug", ielts: 6.0, toefl: 75, gpa: 3.0, color: "#e85d2f", type: "PRIVATE", commission: 7 },

  // ============ United Kingdom ============
  { name: "University of Oxford", country: "United Kingdom", city: "Oxford", ranking: 3, qs: 5.0, appFee: 100, tuition: 38000, courses: "PPE, MBA, DPhil, M.Sc", intakes: "Oct", ielts: 7.5, toefl: 110, gpa: 3.8, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "University of Cambridge", country: "United Kingdom", city: "Cambridge", ranking: 5, qs: 5.0, appFee: 100, tuition: 36000, courses: "Tripos, MPhil, PhD", intakes: "Oct", ielts: 7.5, toefl: 110, gpa: 3.8, color: "#e85d2f", type: "PUBLIC", commission: 10 },
  { name: "Imperial College London", country: "United Kingdom", city: "London", ranking: 6, qs: 4.9, appFee: 100, tuition: 41000, courses: "Engineering, MBA, M.Sc", intakes: "Oct", ielts: 7.0, toefl: 100, gpa: 3.7, color: "#f59e0b", type: "PUBLIC", commission: 10 },
  { name: "UCL (University College London)", country: "United Kingdom", city: "London", ranking: 9, qs: 4.8, appFee: 90, tuition: 35000, courses: "B.Sc, M.Sc, MBA, PhD", intakes: "Sep", ielts: 7.0, toefl: 100, gpa: 3.6, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "University of Edinburgh", country: "United Kingdom", city: "Edinburgh", ranking: 22, qs: 4.7, appFee: 50, tuition: 30000, courses: "AI, MBA, Medicine, M.Sc", intakes: "Sep", ielts: 6.5, toefl: 92, gpa: 3.5, color: "#e85d2f", type: "PUBLIC", commission: 10 },
  { name: "University of Manchester", country: "United Kingdom", city: "Manchester", ranking: 34, qs: 4.5, appFee: 60, tuition: 28000, courses: "Engineering, Business, M.Sc", intakes: "Sep", ielts: 6.5, toefl: 90, gpa: 3.4, color: "#f59e0b", type: "PUBLIC", commission: 10 },
  { name: "King's College London", country: "United Kingdom", city: "London", ranking: 40, qs: 4.5, appFee: 80, tuition: 32000, courses: "Law, Medicine, Business", intakes: "Sep", ielts: 7.0, toefl: 100, gpa: 3.5, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "University of Warwick", country: "United Kingdom", city: "Coventry", ranking: 67, qs: 4.4, appFee: 60, tuition: 29000, courses: "Business, Engineering, M.Sc", intakes: "Sep", ielts: 6.5, toefl: 87, gpa: 3.4, color: "#e85d2f", type: "PUBLIC", commission: 10 },

  // ============ United States ============
  { name: "Massachusetts Institute of Technology (MIT)", country: "United States", city: "Cambridge, MA", ranking: 1, qs: 5.0, appFee: 75, tuition: 58000, courses: "EECS, MBA, PhD", intakes: "Sep", ielts: 7.5, toefl: 110, gpa: 3.9, color: "#e85d2f", type: "PRIVATE", commission: 0 },
  { name: "Stanford University", country: "United States", city: "Stanford, CA", ranking: 6, qs: 5.0, appFee: 90, tuition: 57000, courses: "CS, MBA, MSx, PhD", intakes: "Sep", ielts: 7.0, toefl: 100, gpa: 3.9, color: "#0f766e", type: "PRIVATE", commission: 0 },
  { name: "Harvard University", country: "United States", city: "Cambridge, MA", ranking: 4, qs: 5.0, appFee: 85, tuition: 56000, courses: "MBA, MPA, M.Sc, PhD", intakes: "Sep", ielts: 7.5, toefl: 110, gpa: 3.85, color: "#f59e0b", type: "PRIVATE", commission: 0 },
  { name: "Carnegie Mellon University", country: "United States", city: "Pittsburgh, PA", ranking: 58, qs: 4.7, appFee: 75, tuition: 55000, courses: "CS, Robotics, MSIM, MBA", intakes: "Sep", ielts: 7.0, toefl: 100, gpa: 3.7, color: "#e85d2f", type: "PRIVATE", commission: 8 },
  { name: "Purdue University", country: "United States", city: "West Lafayette, IN", ranking: 99, qs: 4.4, appFee: 75, tuition: 30000, courses: "Engineering, CS, MBA", intakes: "Aug, Jan", ielts: 6.5, toefl: 80, gpa: 3.5, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "Arizona State University", country: "United States", city: "Tempe, AZ", ranking: 179, qs: 4.2, appFee: 70, tuition: 28000, courses: "Engineering, Business, CS", intakes: "Aug, Jan", ielts: 6.0, toefl: 79, gpa: 3.4, color: "#f59e0b", type: "PUBLIC", commission: 12 },
  { name: "Northeastern University", country: "United States", city: "Boston, MA", ranking: 255, qs: 4.2, appFee: 75, tuition: 52000, courses: "CS, MSIS, MBA, MPH", intakes: "Sep, Jan, May", ielts: 6.5, toefl: 85, gpa: 3.4, color: "#e85d2f", type: "PRIVATE", commission: 10 },
  { name: "New York University (NYU)", country: "United States", city: "New York, NY", ranking: 38, qs: 4.6, appFee: 80, tuition: 56000, courses: "MBA, MS in CS, MA Econ", intakes: "Sep", ielts: 7.0, toefl: 100, gpa: 3.6, color: "#0f766e", type: "PRIVATE", commission: 8 },
  { name: "University of Southern California (USC)", country: "United States", city: "Los Angeles, CA", ranking: 116, qs: 4.4, appFee: 90, tuition: 60000, courses: "CS, MBA, MS Analytics", intakes: "Aug, Jan", ielts: 6.5, toefl: 90, gpa: 3.5, color: "#f59e0b", type: "PRIVATE", commission: 8 },

  // ============ Canada ============
  { name: "University of Toronto", country: "Canada", city: "Toronto", ranking: 25, qs: 4.8, appFee: 125, tuition: 45000, courses: "MSc CS, MBA, MEng", intakes: "Sep, Jan", ielts: 6.5, toefl: 100, gpa: 3.6, color: "#e85d2f", type: "PUBLIC", commission: 10 },
  { name: "University of British Columbia", country: "Canada", city: "Vancouver", ranking: 38, qs: 4.7, appFee: 110, tuition: 42000, courses: "MSc, MBA, MEng", intakes: "Sep", ielts: 6.5, toefl: 90, gpa: 3.5, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "McGill University", country: "Canada", city: "Montreal", ranking: 30, qs: 4.7, appFee: 100, tuition: 38000, courses: "MBA, M.Sc, MEng", intakes: "Sep", ielts: 6.5, toefl: 90, gpa: 3.5, color: "#f59e0b", type: "PUBLIC", commission: 10 },
  { name: "University of Waterloo", country: "Canada", city: "Waterloo", ranking: 115, qs: 4.4, appFee: 100, tuition: 40000, courses: "MMath, MEng, MBA", intakes: "Sep, Jan", ielts: 6.5, toefl: 90, gpa: 3.5, color: "#e85d2f", type: "PUBLIC", commission: 10 },
  { name: "Western University", country: "Canada", city: "London, ON", ranking: 114, qs: 4.3, appFee: 95, tuition: 35000, courses: "MBA, M.Sc, MEng", intakes: "Sep", ielts: 6.5, toefl: 86, gpa: 3.4, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "York University", country: "Canada", city: "Toronto", ranking: 353, qs: 4.0, appFee: 90, tuition: 30000, courses: "MBAN, MBA, MES", intakes: "Sep, Jan", ielts: 6.5, toefl: 83, gpa: 3.3, color: "#f59e0b", type: "PUBLIC", commission: 12 },
  { name: "University of Alberta", country: "Canada", city: "Edmonton", ranking: 96, qs: 4.4, appFee: 100, tuition: 32000, courses: "M.Sc, MBA, MEng", intakes: "Sep, Jan", ielts: 6.5, toefl: 90, gpa: 3.4, color: "#e85d2f", type: "PUBLIC", commission: 10 },

  // ============ Australia ============
  { name: "University of Melbourne", country: "Australia", city: "Melbourne", ranking: 13, qs: 4.8, appFee: 100, tuition: 45000, courses: "MBA, M.Sc, MEng", intakes: "Feb, Jul", ielts: 6.5, toefl: 79, gpa: 3.5, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "Monash University", country: "Australia", city: "Melbourne", ranking: 42, qs: 4.6, appFee: 90, tuition: 42000, courses: "MBA, MIT, M.Ed", intakes: "Feb, Jul", ielts: 6.5, toefl: 79, gpa: 3.4, color: "#e85d2f", type: "PUBLIC", commission: 12 },
  { name: "University of New South Wales (UNSW)", country: "Australia", city: "Sydney", ranking: 19, qs: 4.7, appFee: 95, tuition: 44000, courses: "MBA, M.Sc, MEng", intakes: "Feb, Jul", ielts: 6.5, toefl: 90, gpa: 3.5, color: "#f59e0b", type: "PUBLIC", commission: 12 },
  { name: "University of Sydney", country: "Australia", city: "Sydney", ranking: 19, qs: 4.7, appFee: 100, tuition: 46000, courses: "MBA, M.Sc, MPA", intakes: "Feb, Jul", ielts: 7.0, toefl: 96, gpa: 3.5, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "University of Queensland", country: "Australia", city: "Brisbane", ranking: 40, qs: 4.5, appFee: 100, tuition: 41000, courses: "MBA, M.Sc, MEng", intakes: "Feb, Jul", ielts: 6.5, toefl: 87, gpa: 3.4, color: "#e85d2f", type: "PUBLIC", commission: 12 },
  { name: "University of Adelaide", country: "Australia", city: "Adelaide", ranking: 89, qs: 4.3, appFee: 95, tuition: 38000, courses: "MBA, M.Sc, MEng", intakes: "Feb, Jul", ielts: 6.5, toefl: 79, gpa: 3.3, color: "#f59e0b", type: "PUBLIC", commission: 12 },
  { name: "RMIT University", country: "Australia", city: "Melbourne", ranking: 123, qs: 4.2, appFee: 80, tuition: 32000, courses: "MIT, MBA, M.Des", intakes: "Feb, Jul", ielts: 6.5, toefl: 79, gpa: 3.2, color: "#e85d2f", type: "PUBLIC", commission: 12 },

  // ============ Ireland ============
  { name: "Trinity College Dublin", country: "Ireland", city: "Dublin", ranking: 81, qs: 4.4, appFee: 55, tuition: 27000, courses: "M.Sc CS, MBA, M.Sc Data", intakes: "Sep", ielts: 6.5, toefl: 88, gpa: 3.4, color: "#0f766e", type: "PUBLIC", commission: 10 },
  { name: "University College Dublin", country: "Ireland", city: "Dublin", ranking: 171, qs: 4.2, appFee: 50, tuition: 26000, courses: "M.Sc, MBA, MEng", intakes: "Sep", ielts: 6.5, toefl: 90, gpa: 3.3, color: "#e85d2f", type: "PUBLIC", commission: 12 },
  { name: "Dublin City University", country: "Ireland", city: "Dublin", ranking: 421, qs: 4.0, appFee: 45, tuition: 22000, courses: "M.Sc CS, MBA", intakes: "Sep", ielts: 6.5, toefl: 92, gpa: 3.2, color: "#f59e0b", type: "PUBLIC", commission: 12 },
  { name: "University of Galway", country: "Ireland", city: "Galway", ranking: 273, qs: 4.1, appFee: 45, tuition: 24000, courses: "M.Sc, MBA, MEng", intakes: "Sep", ielts: 6.5, toefl: 88, gpa: 3.2, color: "#0f766e", type: "PUBLIC", commission: 12 },

  // ============ Germany ============
  { name: "Technical University of Munich", country: "Germany", city: "Munich", ranking: 28, qs: 4.7, appFee: 0, tuition: 3000, courses: "M.Sc CS, MEng, MBA", intakes: "Oct, Apr", ielts: 6.5, toefl: 88, gpa: 3.5, color: "#e85d2f", type: "PUBLIC", commission: 0 },
  { name: "RWTH Aachen University", country: "Germany", city: "Aachen", ranking: 106, qs: 4.4, appFee: 0, tuition: 1500, courses: "M.Sc, MEng", intakes: "Oct, Apr", ielts: 6.5, toefl: 90, gpa: 3.4, color: "#0f766e", type: "PUBLIC", commission: 0 },
  { name: "Heidelberg University", country: "Germany", city: "Heidelberg", ranking: 47, qs: 4.6, appFee: 0, tuition: 1500, courses: "M.Sc, MA, MBA", intakes: "Oct, Apr", ielts: 6.5, toefl: 90, gpa: 3.5, color: "#f59e0b", type: "PUBLIC", commission: 0 },
  { name: "Humboldt University of Berlin", country: "Germany", city: "Berlin", ranking: 126, qs: 4.3, appFee: 0, tuition: 1500, courses: "M.Sc, MA", intakes: "Oct, Apr", ielts: 6.5, toefl: 90, gpa: 3.4, color: "#e85d2f", type: "PUBLIC", commission: 0 },

  // ============ Singapore ============
  { name: "National University of Singapore", country: "Singapore", city: "Singapore", ranking: 8, qs: 4.9, appFee: 50, tuition: 38000, courses: "M.Sc CS, MBA, MPA", intakes: "Aug, Jan", ielts: 6.5, toefl: 92, gpa: 3.7, color: "#e85d2f", type: "PUBLIC", commission: 10 },
  { name: "Nanyang Technological University", country: "Singapore", city: "Singapore", ranking: 15, qs: 4.8, appFee: 50, tuition: 36000, courses: "MBA, M.Sc, MEng", intakes: "Aug, Jan", ielts: 6.5, toefl: 90, gpa: 3.6, color: "#0f766e", type: "PUBLIC", commission: 10 },

  // ============ New Zealand ============
  { name: "University of Auckland", country: "New Zealand", city: "Auckland", ranking: 65, qs: 4.5, appFee: 75, tuition: 35000, courses: "M.Sc, MBA, MEng", intakes: "Feb, Jul", ielts: 6.5, toefl: 90, gpa: 3.4, color: "#e85d2f", type: "PUBLIC", commission: 12 },
  { name: "University of Otago", country: "New Zealand", city: "Dunedin", ranking: 217, qs: 4.2, appFee: 70, tuition: 32000, courses: "MBA, M.Sc, MPH", intakes: "Feb, Jul", ielts: 6.5, toefl: 90, gpa: 3.3, color: "#f59e0b", type: "PUBLIC", commission: 12 },

  // ============ Netherlands ============
  { name: "Delft University of Technology", country: "Netherlands", city: "Delft", ranking: 47, qs: 4.6, appFee: 100, tuition: 19000, courses: "M.Sc CS, MEng, Aerospace", intakes: "Sep", ielts: 6.5, toefl: 90, gpa: 3.5, color: "#e85d2f", type: "PUBLIC", commission: 8 },
  { name: "University of Amsterdam", country: "Netherlands", city: "Amsterdam", ranking: 53, qs: 4.5, appFee: 100, tuition: 17000, courses: "M.Sc, MBA, MA", intakes: "Sep", ielts: 6.5, toefl: 92, gpa: 3.4, color: "#0f766e", type: "PUBLIC", commission: 8 },

  // ============ France ============
  { name: "HEC Paris", country: "France", city: "Jouy-en-Josas", ranking: 23, qs: 4.8, appFee: 110, tuition: 46000, courses: "MBA, M.Sc, Executive", intakes: "Sep", ielts: 7.0, toefl: 100, gpa: 3.6, color: "#f59e0b", type: "PRIVATE", commission: 8 },
  { name: "Sorbonne University", country: "France", city: "Paris", ranking: 59, qs: 4.5, appFee: 100, tuition: 12000, courses: "M.Sc, MA, MBA", intakes: "Sep", ielts: 6.5, toefl: 90, gpa: 3.4, color: "#e85d2f", type: "PUBLIC", commission: 8 },

  // ============ UAE ============
  { name: "New York University Abu Dhabi", country: "United Arab Emirates", city: "Abu Dhabi", ranking: 0, qs: 4.5, appFee: 75, tuition: 58000, courses: "BA, B.Sc, MBA", intakes: "Sep", ielts: 7.0, toefl: 100, gpa: 3.6, color: "#0f766e", type: "PRIVATE", commission: 10 },
  { name: "Khalifa University", country: "United Arab Emirates", city: "Abu Dhabi", ranking: 0, qs: 4.3, appFee: 75, tuition: 35000, courses: "M.Sc, MEng, PhD", intakes: "Sep", ielts: 6.5, toefl: 91, gpa: 3.4, color: "#f59e0b", type: "PUBLIC", commission: 12 },
];

const STUDENTS = [
  { first: "Aarav", last: "Sharma", city: "Mumbai", target: "United Kingdom", prog: "M.Sc Computer Science", intake: "Fall 2026", budget: 35, score: 8.4, eng: "IELTS 7.5", status: "APPLIED", source: "Website" },
  { first: "Diya", last: "Patel", city: "Ahmedabad", target: "India", prog: "B.Tech ICT", intake: "Fall 2026", budget: 8, score: 9.1, eng: "—", status: "SHORTLISTED", source: "Walk-in" },
  { first: "Ishaan", last: "Reddy", city: "Hyderabad", target: "Australia", prog: "Master of IT", intake: "Feb 2026", budget: 40, score: 7.8, eng: "IELTS 7.0", status: "OFFERED", source: "Referral" },
  { first: "Ananya", last: "Iyer", city: "Chennai", target: "Canada", prog: "MBAN", intake: "Fall 2026", budget: 45, score: 8.6, eng: "IELTS 7.5", status: "APPLIED", source: "Website" },
  { first: "Vikram", last: "Nair", city: "Bengaluru", target: "United States", prog: "MS in CS", intake: "Fall 2026", budget: 60, score: 8.9, eng: "TOEFL 108", status: "APPLIED", source: "Referral" },
  { first: "Sneha", last: "Gupta", city: "Delhi", target: "Germany", prog: "M.Sc Automotive", intake: "Oct 2026", budget: 12, score: 8.2, eng: "IELTS 7.0", status: "SHORTLISTED", source: "Website" },
  { first: "Rohan", last: "Desai", city: "Pune", target: "Ireland", prog: "M.Sc Data Science", intake: "Fall 2026", budget: 25, score: 7.9, eng: "IELTS 6.5", status: "ENROLLED", source: "Walk-in" },
  { first: "Kavya", last: "Krishnan", city: "Kochi", target: "United Kingdom", prog: "MBA", intake: "Fall 2026", budget: 40, score: 8.7, eng: "IELTS 7.5", status: "OFFERED", source: "Referral" },
  { first: "Arjun", last: "Mehta", city: "Mumbai", target: "Singapore", prog: "M.Sc CS", intake: "Aug 2026", budget: 38, score: 8.5, eng: "IELTS 7.0", status: "APPLIED", source: "Website" },
  { first: "Pooja", last: "Saxena", city: "Indore", target: "Canada", prog: "MEng ECE", intake: "Fall 2026", budget: 35, score: 8.0, eng: "TOEFL 95", status: "LEAD", source: "Website" },
  { first: "Karan", last: "Singh", city: "Chandigarh", target: "Australia", prog: "MBA", intake: "Feb 2026", budget: 42, score: 7.5, eng: "IELTS 6.5", status: "LEAD", source: "Walk-in" },
  { first: "Meera", last: "Joshi", city: "Bengaluru", target: "United States", prog: "MS in Business Analytics", intake: "Fall 2026", budget: 55, score: 8.8, eng: "TOEFL 105", status: "APPLIED", source: "Referral" },
];

async function main() {
  console.log("🌱 Seeding EduConnect India database...");

  // 1. Demo counselor
  const passwordHash = hashPassword("demo1234");
  const counselor = await prisma.user.upsert({
    where: { email: "demo@educonnect.in" },
    update: {},
    create: {
      email: "demo@educonnect.in",
      name: "Rajesh Mehta",
      passwordHash,
      role: "ADMIN",
      branch: "Mumbai Central",
      phone: "+91 98765 43210",
      avatarColor: "#e85d2f",
    },
  });
  console.log(`✅ Counselor: ${counselor.email} / demo1234`);

  // 2. Universities
  for (const u of UNIVERSITIES) {
    await prisma.university.upsert({
      where: { name: u.name },
      update: {},
      create: {
        name: u.name,
        country: u.country,
        city: u.city,
        ranking: u.ranking || null,
        type: u.type,
        qsStars: u.qs,
        applicationFee: u.appFee,
        tuitionFee: u.tuition,
        popularCourses: u.courses,
        intakeMonths: u.intakes,
        minIelts: u.ielts,
        minToefl: u.toefl,
        minGpa: u.gpa,
        website: "https://example.edu",
        logoColor: u.color,
        partnerStatus: "DIRECT",
        commission: u.commission,
      },
    });
  }
  console.log(`✅ Universities: ${UNIVERSITIES.length}`);

  // 3. Students + sample applications
  const unis = await prisma.university.findMany();
  const byCountry: Record<string, typeof unis> = {};
  unis.forEach((u) => {
    (byCountry[u.country] ||= []).push(u);
  });

  for (const s of STUDENTS) {
    const student = await prisma.student.create({
      data: {
        firstName: s.first,
        lastName: s.last,
        email: `${s.first.toLowerCase()}.${s.last.toLowerCase()}@gmail.com`,
        phone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
        city: s.city,
        country: "India",
        targetCountry: s.target,
        targetProgram: s.prog,
        intake: s.intake,
        budget: s.budget,
        academicScore: s.score,
        englishScore: s.eng,
        status: s.status,
        source: s.source,
        counselorId: counselor.id,
        notes: "Initial onboarding complete.",
      },
    });

    // Create 1–2 applications per student
    const targetUnis = byCountry[s.target] || [];
    if (targetUnis.length > 0 && s.status !== "LEAD") {
      const u1 = targetUnis[0];
      const u2 = targetUnis[Math.min(1, targetUnis.length - 1)];

      const appStatus =
        s.status === "OFFERED" ? "OFFERED" :
        s.status === "ENROLLED" ? "ENROLLED" :
        s.status === "SHORTLISTED" ? "DRAFT" : "SUBMITTED";

      await prisma.application.create({
        data: {
          studentId: student.id,
          universityId: u1.id,
          counselorId: counselor.id,
          program: s.prog,
          intake: s.intake,
          status: appStatus,
          amount: u1.tuitionFee,
          submittedAt: appStatus !== "DRAFT" ? new Date() : null,
        },
      });

      if (u2 && u2.id !== u1.id && Math.random() > 0.4) {
        await prisma.application.create({
          data: {
            studentId: student.id,
            universityId: u2.id,
            counselorId: counselor.id,
            program: s.prog,
            intake: s.intake,
            status: appStatus === "OFFERED" || appStatus === "ENROLLED" ? "SUBMITTED" : "DRAFT",
            amount: u2.tuitionFee,
            submittedAt: appStatus === "OFFERED" || appStatus === "ENROLLED" ? new Date() : null,
          },
        });
      }
    }
  }
  console.log(`✅ Students: ${STUDENTS.length} with applications`);

  // 4. Visa applications
  const visaStudents = await prisma.student.findMany({
    where: { status: { in: ["OFFERED", "ENROLLED"] } },
  });
  for (const vs of visaStudents) {
    const statuses = ["DOCS_READY", "SUBMITTED", "BIO_METRIC", "INTERVIEW", "APPROVED"];
    await prisma.visaApplication.create({
      data: {
        studentId: vs.id,
        country: vs.targetCountry || "United Kingdom",
        visaType: "STUDENT",
        status: vs.status === "ENROLLED" ? "APPROVED" : statuses[Math.floor(Math.random() * 4)],
        appointmentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
  }
  console.log(`✅ Visa applications: ${visaStudents.length}`);

  // 5. Invoices
  const apps = await prisma.application.findMany({ where: { status: { in: ["OFFERED", "ENROLLED", "SUBMITTED"] } }, take: 8 });
  let inv = 1001;
  for (const a of apps) {
    const student = await prisma.student.findUnique({ where: { id: a.studentId } });
    if (!student) continue;
    await prisma.invoice.create({
      data: {
        number: `INV-2026-${inv++}`,
        studentName: `${student.firstName} ${student.lastName}`,
        applicationId: a.id,
        counselorId: counselor.id,
        amount: Math.round((a.amount || 30000) * 0.05 * 83), // 5% commission × 83 INR/USD
        gst: 18,
        status: a.status === "ENROLLED" ? "PAID" : a.status === "OFFERED" ? "SENT" : "DRAFT",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });
  }
  console.log(`✅ Invoices: ${inv - 1001}`);

  // 6. Communications
  const allStudents = await prisma.student.findMany({ take: 6 });
  const templates = [
    { ch: "WHATSAPP", subj: "Document reminder", body: "Hi {name}, please share your passport copy and academic transcripts by Friday." },
    { ch: "EMAIL", subj: "Application submitted", body: "Dear {name}, your application to the university has been submitted successfully." },
    { ch: "SMS", subj: "Appointment", body: "Hi {name}, your visa biometric appointment is confirmed for next Tuesday at 10 AM." },
    { ch: "WHATSAPP", subj: "Offer received", body: "Hi {name}, congratulations! You've received an offer letter. Let's discuss acceptance." },
    { ch: "EMAIL", subj: "Welcome to EduConnect", body: "Dear {name}, welcome aboard! Your counselor will reach out within 24 hours." },
    { ch: "WHATSAPP", subj: "Follow-up", body: "Hi {name}, just checking in. Any questions about the application progress?" },
  ];
  for (let i = 0; i < allStudents.length; i++) {
    const t = templates[i % templates.length];
    const s = allStudents[i];
    await prisma.communication.create({
      data: {
        studentId: s.id,
        userId: counselor.id,
        channel: t.ch,
        direction: "OUTBOUND",
        subject: t.subj,
        body: t.body.replace("{name}", s.firstName),
        status: "DELIVERED",
      },
    });
  }
  console.log(`✅ Communications: ${allStudents.length}`);

  // 8. Scholarships (40 real ones)
  const SCHOLARSHIPS = [
    // India
    { name: "National Overseas Scholarship", provider: "Govt of India", country: "Any", amount: 1500000, amountLabel: "₹15L/year", level: "PG", cats: "MERIT,NEED", minScore: 7.5, fields: "ANY", color: "#e85d2f", desc: "For SC/ST students pursuing PG abroad. Covers tuition + maintenance." },
    { name: "PG Scholarship for SC/ST", provider: "Ministry of Education", country: "India", amount: 800000, amountLabel: "₹8L/year", level: "PG", cats: "MERIT,MINORITY", minScore: 7.0, fields: "ANY", color: "#0f766e", desc: "Post-matric scholarship for SC/ST candidates." },
    { name: "AICTE Pragati Scholarship", provider: "AICTE", country: "India", amount: 50000, amountLabel: "₹50,000/year", level: "UG", cats: "MERIT,MINORITY", minScore: 7.0, fields: "Engineering,Technology", color: "#f59e0b", desc: "For girls pursuing technical education." },
    { name: "AICTE Saksham Scholarship", provider: "AICTE", country: "India", amount: 50000, amountLabel: "₹50,000/year", level: "UG", cats: "MERIT,NEED", minScore: 7.0, fields: "Engineering,Technology", color: "#e85d2f", desc: "For differently-abled students in technical courses." },
    { name: "INSPIRE Scholarship", provider: "DST India", country: "India", amount: 80000, amountLabel: "₹80,000/year", level: "UG", cats: "MERIT,RESEARCH", minScore: 9.0, fields: "Science,Mathematics", color: "#0f766e", desc: "For students in natural sciences with >1% in board exams." },
    { name: "Kishore Vaigyanik Protsahan Yojana", provider: "IISc Bangalore", country: "India", amount: 80000, amountLabel: "₹80,000/year", level: "UG", cats: "MERIT,RESEARCH", minScore: 8.5, fields: "Science,Engineering,Medicine", color: "#f59e0b", desc: "KVPY fellowship for science students." },
    { name: "JN Tata Endowment Loan Scholarship", provider: "Tata Trusts", country: "Any", amount: 1000000, amountLabel: "₹10L loan", level: "PG", cats: "MERIT", minScore: 7.5, fields: "ANY", color: "#e85d2f", desc: "Loan scholarship for PG studies abroad." },
    { name: "Inlaks Shivdasani Scholarship", provider: "Inlaks Foundation", country: "Any", amount: 1000000, amountLabel: "$100,000", level: "PG", cats: "MERIT", minScore: 8.5, fields: "ANY", color: "#0f766e", desc: "Prestigious scholarship for top universities abroad." },

    // UK
    { name: "Chevening Scholarship", provider: "UK Government", country: "United Kingdom", amount: 1800000, amountLabel: "Full tuition + £18k stipend", level: "PG", cats: "MERIT,LEADERSHIP", minScore: 8.0, minIelts: 7.0, fields: "ANY", color: "#0f766e", desc: "UK Govt's global scholarship for future leaders. Covers full tuition + living + travel." },
    { name: "Commonwealth Scholarship", provider: "UK Govt", country: "United Kingdom", amount: 1500000, amountLabel: "Full tuition + stipend", level: "PG", cats: "MERIT,NEED", minScore: 7.5, minIelts: 6.5, fields: "ANY", color: "#e85d2f", desc: "For Commonwealth country citizens pursuing Master's/PhD in UK." },
    { name: "Gates Cambridge Scholarship", provider: "University of Cambridge", country: "United Kingdom", amount: 2000000, amountLabel: "Full cost", level: "PG", cats: "MERIT,LEADERSHIP", minScore: 8.5, minIelts: 7.5, fields: "ANY", color: "#f59e0b", desc: "Bill & Melinda Gates Foundation-funded at Cambridge." },
    { name: "Rhodes Scholarship", provider: "University of Oxford", country: "United Kingdom", amount: 2500000, amountLabel: "Full cost + £18k stipend", level: "PG", cats: "MERIT,LEADERSHIP", minScore: 8.5, minIelts: 7.5, fields: "ANY", color: "#0f766e", desc: "World's oldest and most prestigious scholarship at Oxford." },
    { name: "Clarendon Fund", provider: "University of Oxford", country: "United Kingdom", amount: 2000000, amountLabel: "Full tuition + stipend", level: "PG", cats: "MERIT", minScore: 8.5, minIelts: 7.5, fields: "ANY", color: "#e85d2f", desc: "Oxford's flagship scholarship for graduate students." },
    { name: " GREAT Scholarships India", provider: "British Council", country: "United Kingdom", amount: 1000000, amountLabel: "£10,000", level: "PG", cats: "MERIT", minScore: 7.5, minIelts: 6.5, fields: "ANY", color: "#f59e0b", desc: "British Council + UK universities joint scholarship for Indian students." },
    { name: "Charles Wallace India Trust", provider: "Charles Wallace Trust", country: "United Kingdom", amount: 800000, amountLabel: "£8,000", level: "PG", cats: "MERIT,NEED", minScore: 7.0, minIelts: 6.5, fields: "Arts,Humanities,Heritage", color: "#0f766e", desc: "For Indian creative professionals and academics." },

    // US
    { name: "Fulbright-Nehru Master's Fellowship", provider: "USIEF", country: "United States", amount: 2000000, amountLabel: "Full cost", level: "PG", cats: "MERIT,LEADERSHIP", minScore: 8.0, minToefl: 100, fields: "ANY", color: "#e85d2f", desc: "For outstanding Indians to pursue Master's in US." },
    { name: "Stanford Knight-Hennessy Scholars", provider: "Stanford University", country: "United States", amount: 3000000, amountLabel: "Full cost", level: "PG", cats: "MERIT,LEADERSHIP", minScore: 8.5, minToefl: 100, fields: "ANY", color: "#0f766e", desc: "Stanford's flagship scholarship for graduate studies." },
    { name: "Harvard MBA Scholarship", provider: "Harvard Business School", country: "United States", amount: 3500000, amountLabel: "Full cost", level: "PG", cats: "MERIT,NEED", minScore: 8.0, minToefl: 109, fields: "Business,MBA", color: "#f59e0b", desc: "Need-based scholarship for Harvard MBA." },
    { name: "AAUW International Fellowship", provider: "AAUW", country: "United States", amount: 1500000, amountLabel: "$20,000-50,000", level: "PG", cats: "MERIT", minScore: 7.5, minToefl: 100, fields: "ANY", color: "#e85d2f", desc: "For women pursuing graduate studies in US." },
    { name: "Aga Khan Foundation Scholarship", provider: "Aga Khan Foundation", country: "Any", amount: 1500000, amountLabel: "50% grant + 50% loan", level: "PG", cats: "MERIT,NEED", minScore: 7.5, fields: "ANY", color: "#0f766e", desc: "For outstanding students from developing countries." },

    // Canada
    { name: "Vanier Canada Graduate Scholarship", provider: "Govt of Canada", country: "Canada", amount: 2500000, amountLabel: "$50,000/year × 3", level: "PHD", cats: "MERIT,RESEARCH,LEADERSHIP", minScore: 8.5, minIelts: 7.0, fields: "ANY", color: "#e85d2f", desc: "Canada's top doctoral scholarship." },
    { name: "Trudeau Foundation Scholarship", provider: "Pierre Elliott Trudeau Foundation", country: "Canada", amount: 2000000, amountLabel: "$40,000/year", level: "PHD", cats: "MERIT,RESEARCH", minScore: 8.5, minIelts: 7.0, fields: "Social Sciences,Humanities", color: "#0f766e", desc: "For doctoral researchers in social sciences/humanities." },
    { name: "Lester B. Pearson Scholarship", provider: "University of Toronto", country: "Canada", amount: 2500000, amountLabel: "Full cost", level: "UG", cats: "MERIT,LEADERSHIP", minScore: 9.0, minIelts: 7.0, fields: "ANY", color: "#f59e0b", desc: "U of T's flagship international student scholarship." },
    { name: "UBC International Leader of Tomorrow", provider: "University of British Columbia", country: "Canada", amount: 2000000, amountLabel: "Full tuition + living", level: "UG", cats: "MERIT,LEADERSHIP,NEED", minScore: 8.5, minIelts: 7.0, fields: "ANY", color: "#e85d2f", desc: "For outstanding international undergrads at UBC." },
    { name: "Canada-India Research S&T", provider: "IC-IMPACTS", country: "Canada", amount: 1200000, amountLabel: "$20,000", level: "PG", cats: "MERIT,RESEARCH", minScore: 8.0, minIelts: 6.5, fields: "Engineering,Science,Technology", color: "#0f766e", desc: "For India-Canada research collaboration." },

    // Australia
    { name: "Australia Awards Scholarship", provider: "Australian Govt", country: "Australia", amount: 2000000, amountLabel: "Full cost", level: "PG", cats: "MERIT,LEADERSHIP", minScore: 7.5, minIelts: 6.5, fields: "ANY", color: "#e85d2f", desc: "Australian Government's long-standing awards program." },
    { name: "Endeavour Postgraduate Scholarship", provider: "Australian Govt", country: "Australia", amount: 1500000, amountLabel: "AUD 140,500", level: "PG", cats: "MERIT", minScore: 7.5, minIelts: 6.5, fields: "ANY", color: "#0f766e", desc: "For international students to undertake PG in Australia." },
    { name: "Research Training Program", provider: "Australian Universities", country: "Australia", amount: 1800000, amountLabel: "Full tuition + stipend", level: "PG", cats: "MERIT,RESEARCH", minScore: 8.0, minIelts: 6.5, fields: "Research", color: "#f59e0b", desc: "RTP for domestic + international HDR students." },
    { name: "Melbourne Graduate Research Scholarship", provider: "University of Melbourne", country: "Australia", amount: 2200000, amountLabel: "Full cost + stipend", level: "PG", cats: "MERIT,RESEARCH", minScore: 8.5, minIelts: 7.0, fields: "ANY", color: "#e85d2f", desc: "Melbourne's flagship scholarship for grad researchers." },

    // Ireland
    { name: "Government of Ireland Postgrad Scholarship", provider: "Irish Research Council", country: "Ireland", amount: 1200000, amountLabel: "€16,000 stipend + fees", level: "PG", cats: "MERIT,RESEARCH", minScore: 8.0, minIelts: 6.5, fields: "ANY", color: "#0f766e", desc: "For pursuing research Master's or PhD in Ireland." },
    { name: "Trinity College Global Excellence", provider: "Trinity College Dublin", country: "Ireland", amount: 800000, amountLabel: "€5,000-12,000", level: "PG", cats: "MERIT", minScore: 7.5, minIelts: 6.5, fields: "ANY", color: "#e85d2f", desc: "TCD's merit scholarship for international students." },
    { name: "UCD Global Excellence Scholarship", provider: "University College Dublin", country: "Ireland", amount: 1000000, amountLabel: "€10,000-20,000", level: "UG", cats: "MERIT", minScore: 8.0, minIelts: 6.5, fields: "ANY", color: "#f59e0b", desc: "UCD's scholarship for high-achieving international students." },

    // Germany
    { name: "DAAD Scholarship", provider: "DAAD", country: "Germany", amount: 1000000, amountLabel: "€934-1,200/month", level: "PG", cats: "MERIT,RESEARCH", minScore: 7.5, minIelts: 6.5, fields: "ANY", color: "#e85d2f", desc: "Germany's flagship international scholarship program." },
    { name: "Deutschlandstipendium", provider: "German Universities", country: "Germany", amount: 350000, amountLabel: "€300/month", level: "UG", cats: "MERIT", minScore: 7.5, fields: "ANY", color: "#0f766e", desc: "Public-private partnership scholarship for talented students." },
    { name: "Heinrich Böll Foundation Scholarship", provider: "Heinrich Böll Foundation", country: "Germany", amount: 900000, amountLabel: "€861/month + tuition", level: "PG", cats: "MERIT,LEADERSHIP", minScore: 8.0, minIelts: 6.5, fields: "ANY", color: "#f59e0b", desc: "For undergrads, grads, and PhDs in Germany." },

    // Singapore
    { name: "Singapore International Graduate Award", provider: "A*STAR", country: "Singapore", amount: 2000000, amountLabel: "S$2,000-2,700/month", level: "PHD", cats: "MERIT,RESEARCH", minScore: 8.5, minIelts: 7.0, fields: "Science,Engineering", color: "#e85d2f", desc: "For PhD studies at NUS, NTU, SUTD, SMU." },
    { name: "ASEAN Undergraduate Scholarship", provider: "NUS", country: "Singapore", amount: 1800000, amountLabel: "Full tuition + living", level: "UG", cats: "MERIT", minScore: 8.5, minIelts: 7.0, fields: "ANY", color: "#0f766e", desc: "NUS scholarship for ASEAN students (incl. India)." },

    // New Zealand
    { name: "NZ Excellence Awards", provider: "Education NZ", country: "New Zealand", amount: 1000000, amountLabel: "NZD 10,000-20,000", level: "PG", cats: "MERIT", minScore: 7.5, minIelts: 6.5, fields: "ANY", color: "#f59e0b", desc: "For Indian students pursuing PG in NZ." },
    { name: "University of Auckland Doctoral Scholarship", provider: "University of Auckland", country: "New Zealand", amount: 2000000, amountLabel: "NZD 29,860 + fees", level: "PHD", cats: "MERIT,RESEARCH", minScore: 8.5, minIelts: 7.0, fields: "ANY", color: "#e85d2f", desc: "For doctoral candidates at University of Auckland." },
  ];

  for (const s of SCHOLARSHIPS) {
    await prisma.scholarship.create({
      data: {
        name: s.name,
        provider: s.provider,
        country: s.country,
        amount: s.amount,
        amountLabel: s.amountLabel,
        level: s.level,
        categories: s.cats,
        minScore: s.minScore,
        minIelts: s.minIelts || null,
        minToefl: s.minToefl || null,
        deadline: "2026-03-15",
        intake: "Fall 2026",
        fields: s.fields,
        website: "https://example.org",
        logoColor: s.color,
        description: s.desc,
      },
    });
  }
  console.log(`✅ Scholarships: ${SCHOLARSHIPS.length}`);

  // 9. Deadlines (sample for next 30 days)
  const deadlineStudents = await prisma.student.findMany({ take: 8 });
  const now = Date.now();
  const day = 86400000;
  const sampleDeadlines = [
    { title: "Submit financial documents for UK visa", cat: "DOCUMENT", pri: "HIGH", days: 2, country: "United Kingdom" },
    { title: "Manchester application deadline", cat: "APPLICATION", pri: "CRITICAL", days: 1, country: "United Kingdom" },
    { title: "Biometric appointment — Toronto visa", cat: "VISA", pri: "HIGH", days: 4, country: "Canada" },
    { title: "Pay first installment — Purdue", cat: "PAYMENT", pri: "HIGH", days: 6, country: "United States" },
    { title: "Chevening scholarship deadline", cat: "SCHOLARSHIP", pri: "CRITICAL", days: 3, country: "United Kingdom" },
    { title: "Visa interview — Monash University", cat: "INTERVIEW", pri: "CRITICAL", days: 5, country: "Australia" },
    { title: "Submit SOP — TUM Munich", cat: "DOCUMENT", pri: "MEDIUM", days: 9, country: "Germany" },
    { title: "Cambridge application deadline", cat: "APPLICATION", pri: "CRITICAL", days: 7, country: "United Kingdom" },
    { title: "Submit LOR — Trinity College Dublin", cat: "DOCUMENT", pri: "MEDIUM", days: 11, country: "Ireland" },
    { title: "Pay SEVIS fee — US F1 visa", cat: "PAYMENT", pri: "HIGH", days: 8, country: "United States" },
  ];
  for (let i = 0; i < sampleDeadlines.length; i++) {
    const d = sampleDeadlines[i];
    await prisma.deadline.create({
      data: {
        studentId: deadlineStudents[i % deadlineStudents.length].id,
        title: d.title,
        description: `Auto-generated deadline. Action needed for ${d.country} application.`,
        dueDate: new Date(now + d.days * day),
        priority: d.pri,
        category: d.cat,
        country: d.country,
        status: "PENDING",
      },
    });
  }
  console.log(`✅ Deadlines: ${sampleDeadlines.length}`);

  // 11. Appointments (next 7 days)
  const apptStudents = await prisma.student.findMany({ take: 6 });
  const apptTypes = [
    { t: "COUNSELING", title: "Initial counseling — UK options", loc: "VIDEO", dur: 60 },
    { t: "VISA_INTERVIEW", title: "Visa interview prep — US F1", loc: "VIDEO", dur: 90 },
    { t: "DOCUMENT_REVIEW", title: "SOP review session", loc: "IN_PERSON", dur: 45 },
    { t: "FOLLOW_UP", title: "Application status follow-up", loc: "PHONE", dur: 30 },
    { t: "PARENT_MEETING", title: "Parent meeting — Aarav's progress", loc: "VIDEO", dur: 60 },
    { t: "COUNSELING", title: "Course selection — Canada PG programs", loc: "VIDEO", dur: 60 },
  ];
  for (let i = 0; i < apptTypes.length; i++) {
    const a = apptTypes[i];
    const start = new Date(now + (i + 1) * day + 10 * 3600000); // 10am each day
    await prisma.appointment.create({
      data: {
        studentId: apptStudents[i % apptStudents.length].id,
        counselorId: counselor.id,
        title: a.title,
        description: `Auto-scheduled ${a.t.toLowerCase().replace(/_/g, " ")} session.`,
        startTime: start,
        endTime: new Date(start.getTime() + a.dur * 60000),
        status: i > 3 ? "SCHEDULED" : "COMPLETED",
        type: a.t,
        location: a.loc,
        meetingLink: a.loc === "VIDEO" ? "https://meet.educonnect.in/" + Math.random().toString(36).slice(2, 8) : null,
        branch: "Mumbai Central",
      },
    });
  }
  console.log(`✅ Appointments: ${apptTypes.length}`);

  // 12. Referrals (with codes + conversions)
  const referrals = [
    { code: "ALUMNI-IITB-2024", name: "Vikram Iyer", email: "vikram.iyer@alumni.iitb.ac.in", phone: "+91 99876 54321", type: "ALUMNI", status: "CONVERTED", commission: 15000, convStatus: "PAID" },
    { code: "PARTNER-MONASH-2024", name: "Dr. Sarah Chen", email: "s.chen@monash.edu", type: "PARTNER", status: "CONVERTED", commission: 25000, convStatus: "DUE" },
    { code: "ALUMNI-OXFORD-2024", name: "Ananya Krishnan", email: "ananya.k@alumni.ox.ac.uk", phone: "+91 98765 11111", type: "ALUMNI", status: "CONTACTED", commission: 0, convStatus: "NONE" },
    { code: "STUDENT-REF-AARAV-2024", name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "+91 91367 99462", type: "STUDENT", status: "PENDING", commission: 0, convStatus: "NONE" },
    { code: "AFFILIATE-STUDYABROAD-2024", name: "Rohit Khanna", email: "rohit@studyabroadindia.com", phone: "+91 98111 22222", type: "AFFILIATE", status: "CONVERTED", commission: 35000, convStatus: "PAID" },
    { code: "ALUMNI-TORONTO-2024", name: "Diya Patel's Senior", email: "senior@utoronto.ca", type: "ALUMNI", status: "LOST", commission: 0, convStatus: "NONE" },
    { code: "PARTNER-MANIPAL-2024", name: "Manipal Alumni Office", email: "alumni@manipal.edu", type: "PARTNER", status: "PENDING", commission: 0, convStatus: "NONE" },
  ];
  for (const r of referrals) {
    await prisma.referral.create({
      data: {
        code: r.code,
        referrerName: r.name,
        referrerEmail: r.email,
        referrerPhone: r.phone || null,
        referrerType: r.type,
        refereeName: r.status === "CONVERTED" ? "Walk-in lead" : null,
        refereeEmail: null,
        status: r.status,
        commissionAmount: r.commission,
        commissionStatus: r.convStatus,
        convertedAt: r.status === "CONVERTED" ? new Date(now - 30 * day) : null,
        notes: r.status === "CONVERTED" ? "Successfully placed at partner university." : "Awaiting first contact.",
      },
    });
  }
  console.log(`✅ Referrals: ${referrals.length}`);

  // 13. Country Guides (12 destinations)
  const guides = [
    { c: "United Kingdom", flag: "🇬🇧", cap: "London", cur: "GBP (£)", lang: "English", visa: "Tier 4 (Student)", pt: "3-4 weeks", fee: "£348 + £470 IHS", intakes: "Sep, Jan", tuition: "£15,000-40,000/yr", living: "£1,000-1,500/month", work: "20 hrs/week during term, full-time in breaks", psv: "2-year Graduate Route visa", programs: "MBA, M.Sc CS, LLM, M.Eng", unis: "Oxford, Cambridge, UCL, Imperial, Edinburgh, Manchester", color: "#0f766e", desc: "World-class education with the 2-year Graduate Route work visa. Shorter 1-year Master's programs save time and money." },
    { c: "United States", flag: "🇺🇸", cap: "Washington D.C.", cur: "USD ($)", lang: "English", visa: "F-1 (Student)", pt: "3-5 weeks (varies)", fee: "$510 SEVIS + $185 DS-160", intakes: "Aug/Sep, Jan", tuition: "$25,000-60,000/yr", living: "$1,000-2,000/month", work: "20 hrs/week on-campus, CPT/OPT for off-campus", psv: "1-year OPT (3-year STEM)", programs: "MS CS, MBA, MS Data Science, M.Eng", unis: "MIT, Stanford, Harvard, CMU, Purdue, ASU, NEU", color: "#e85d2f", desc: "Largest higher education system with 4,000+ universities. STEM OPT allows 3 years of work experience after graduation." },
    { c: "Canada", flag: "🇨🇦", cap: "Ottawa", cur: "CAD ($)", lang: "English/French", visa: "Study Permit", pt: "4-8 weeks (SDS: 20 days)", fee: "CAD 150 + biometrics", intakes: "Sep, Jan, May", tuition: "CAD 20,000-50,000/yr", living: "CAD 1,000-1,500/month", work: "20 hrs/week during term, 40 hrs/week in breaks", psv: "3-year PGWP", programs: "M.Sc, MBA, M.Eng, MBAN", unis: "Toronto, UBC, McGill, Waterloo, Western, York", color: "#f59e0b", desc: "Most immigration-friendly country. 3-year Post-Graduate Work Permit + easy PR pathway via Express Entry." },
    { c: "Australia", flag: "🇦🇺", cap: "Canberra", cur: "AUD ($)", lang: "English", visa: "Subclass 500", pt: "4-6 weeks", fee: "AUD 650 + biometrics", intakes: "Feb, Jul", tuition: "AUD 25,000-50,000/yr", living: "AUD 1,500-2,000/month", work: "48 hrs per fortnight", psv: "2-4 year Temporary Graduate Visa (485)", programs: "MBA, M.IT, M.Sc, M.Eng", unis: "Melbourne, Monash, UNSW, Sydney, Queensland, Adelaide", color: "#a855f7", desc: "Beautiful climate + strong post-study work rights. 485 visa allows 2-4 years of work depending on qualification." },
    { c: "Ireland", flag: "🇮🇪", cap: "Dublin", cur: "EUR (€)", lang: "English", visa: "Long Stay D (Student)", pt: "4-8 weeks", fee: "€60-100", intakes: "Sep", tuition: "€10,000-25,000/yr", living: "€1,000-1,500/month", work: "20 hrs/week during term, 40 hrs/week in breaks", psv: "2-year Third Level Graduate Scheme", programs: "M.Sc CS, MBA, M.Sc Data Science", unis: "TCD, UCD, DCU, Galway, UCC", color: "#0ea5e9", desc: "English-speaking EU country with easy PR. Tech hub — Google, Facebook, Apple EMEA HQs in Dublin." },
    { c: "Germany", flag: "🇩🇪", cap: "Berlin", cur: "EUR (€)", lang: "German/English", visa: "Student Visa", pt: "6-12 weeks", fee: "€75", intakes: "Oct, Apr", tuition: "€0-1,500/yr (public)", living: "€800-1,200/month", work: "120 full days or 240 half days/year", psv: "18-month residence permit to find work", programs: "M.Sc, M.Eng, MBA (English-taught)", unis: "TUM, RWTH Aachen, Heidelberg, Humboldt", color: "#22c55e", desc: "Free or low-cost education at public universities. Strong engineering programs. 18-month job seeker visa after graduation." },
    { c: "Singapore", flag: "🇸🇬", cap: "Singapore", cur: "SGD ($)", lang: "English", visa: "Student Pass", pt: "2-4 weeks", fee: "SGD 90", intakes: "Aug, Jan", tuition: "SGD 25,000-50,000/yr", living: "SGD 1,500-2,500/month", work: "16 hrs/week during term", psv: "1-year LTVP for job search", programs: "M.Sc CS, MBA, MPA, M.Eng", unis: "NUS, NTU, SMU, SUTD", color: "#ec4899", desc: "Asia's education hub. Top-ranked NUS and NTU. Gateway to Asian job market with low taxes." },
    { c: "New Zealand", flag: "🇳🇿", cap: "Wellington", cur: "NZD ($)", lang: "English", visa: "Student Visa", pt: "4-6 weeks", fee: "NZD 295", intakes: "Feb, Jul", tuition: "NZD 22,000-40,000/yr", living: "NZD 1,500-2,000/month", work: "20 hrs/week during term, full-time in breaks", psv: "1-3 year Post-Study Work Visa", programs: "MBA, M.Sc, M.Eng, MPH", unis: "Auckland, Otago, Victoria, Massey", color: "#14b8a6", desc: "Beautiful landscapes + safe environment. Post-Study Work Visa up to 3 years depending on qualification level." },
    { c: "Netherlands", flag: "🇳🇱", cap: "Amsterdam", cur: "EUR (€)", lang: "Dutch/English", visa: "Entry Visa (MVV)", pt: "2-4 weeks", fee: "€192", intakes: "Sep", tuition: "€8,000-20,000/yr", living: "€1,000-1,500/month", work: "16 hrs/week during term", psv: "1-year Orientation Year (zoekjaar)", programs: "M.Sc, MBA, M.Eng (English-taught)", unis: "TU Delft, Amsterdam, Utrecht, Erasmus", color: "#fbbf24", desc: "Highest English proficiency in non-English EU. 2,100+ English-taught programs. Orientation Year visa for graduates." },
    { c: "France", flag: "🇫🇷", cap: "Paris", cur: "EUR (€)", lang: "French/English", visa: "Long Stay Student Visa", pt: "2-3 weeks", fee: "€99", intakes: "Sep", tuition: "€3,000-15,000/yr (public)", living: "€1,000-1,500/month", work: "964 hrs/year", psv: "2-year APS residence permit", programs: "MBA, M.Sc, MA, M.Eng", unis: "HEC Paris, Sorbonne, Sciences Po, INSEAD", color: "#6366f1", desc: "Affordable public education + world-class business schools. APS permit allows 2 years to find work." },
    { c: "United Arab Emirates", flag: "🇦🇪", cap: "Abu Dhabi", cur: "AED (د.إ)", lang: "Arabic/English", visa: "Student Visa", pt: "2-4 weeks", fee: "AED 1,000-2,500", intakes: "Sep", tuition: "AED 50,000-150,000/yr", living: "AED 4,000-8,000/month", work: "Part-time with permit", psv: "6-month job seeker visa", programs: "MBA, B.Sc, M.Sc, M.Eng", unis: "NYU Abu Dhabi, Khalifa, AUS, MBZUAI", color: "#dc2626", desc: "Tax-free income + luxury campus life. Branch campuses of NYU, Sorbonne, Heriot-Watt. Growing tech hub." },
    { c: "Italy", flag: "🇮🇹", cap: "Rome", cur: "EUR (€)", lang: "Italian/English", visa: "Type D Student Visa", pt: "3-6 weeks", fee: "€50", intakes: "Sep", tuition: "€1,000-20,000/yr", living: "€800-1,200/month", work: "20 hrs/week during term", psv: "1-year residence permit for job search", programs: "MBA, M.Sc, M.Arch, M.Design", unis: "Bocconi, Politecnico di Milano, Sapienza, Padova", color: "#16a34a", desc: "Affordable education + rich cultural heritage. Bocconi and Politecnico di Milano rank among Europe's best." },
  ];
  for (const g of guides) {
    await prisma.countryGuide.create({
      data: {
        country: g.c, flag: g.flag, capital: g.cap, currency: g.cur, language: g.lang,
        visaType: g.visa, visaProcessingTime: g.pt, visaFee: g.fee, intakeMonths: g.intakes,
        avgTuition: g.tuition, avgLivingCost: g.living, workWhileStudying: g.work,
        postStudyVisa: g.psv, popularPrograms: g.programs, topUniversities: g.unis,
        description: g.desc, heroColor: g.color,
      },
    });
  }
  console.log(`✅ Country guides: ${guides.length}`);

  // 14. Branches
  const branches = [
    { name: "Mumbai Central", city: "Mumbai", address: "5th Floor, Trade Centre, BKC, Mumbai 400051", phone: "+91 22 6824 1900", email: "mumbai@educonnect.in", manager: "Rajesh Mehta" },
    { name: "Delhi NCR", city: "Gurugram", address: "Tower B, Cyberhub, Sector 24, Gurugram 122002", phone: "+91 124 468 2200", email: "delhi@educonnect.in", manager: "Anjali Nair" },
    { name: "Bengaluru", city: "Bengaluru", address: "Prestige Atlanta, 80 Feet Road, Koramangala, Bengaluru 560095", phone: "+91 80 4665 8800", email: "bengaluru@educonnect.in", manager: "Sandeep Joshi" },
    { name: "Chennai", city: "Chennai", address: "Tidel Park, Taramani, Chennai 600113", phone: "+91 44 2254 0000", email: "chennai@educonnect.in", manager: "Priya Reddy" },
    { name: "Hyderabad", city: "Hyderabad", address: "Cyber Towers, HITEC City, Hyderabad 500081", phone: "+91 40 2335 0000", email: "hyderabad@educonnect.in", manager: "Krishna Murthy" },
    { name: "Pune", city: "Pune", address: "World Trade Center, Kharadi, Pune 411014", phone: "+91 20 6725 0000", email: "pune@educonnect.in", manager: "Meera Krishnan" },
  ];
  for (const b of branches) {
    await prisma.branch.create({
      data: {
        name: b.name, city: b.city, address: b.address, phone: b.phone, email: b.email, managerName: b.manager,
      },
    });
  }
  console.log(`✅ Branches: ${branches.length}`);

  // 15. Lead Magnets
  const magnets = [
    { n: "UK Eligibility Checker", t: "ELIGIBILITY_CHECKER", s: "uk-eligibility", d: "60-second quiz — finds UK programs matching the visitor's profile.", cta: "Check my UK eligibility", v: 1247, conv: 312 },
    { n: "Scholarship Match Quiz", t: "SCHOLARSHIP_QUIZ", s: "scholarship-quiz", d: "Matches visitors with eligible scholarships from our 39+ database.", cta: "Find my scholarships", v: 2156, conv: 548 },
    { n: "AI University Matcher", t: "UNIVERSITY_MATCHER", s: "ai-matcher", d: "Free 5-question quiz → instant university recommendations.", cta: "Match me to universities", v: 3421, conv: 892 },
    { n: "Canada Visa Eligibility", t: "VISA_ELIGIBILITY", s: "canada-visa", d: "Checks Canada SDS eligibility based on IELTS, GIC, and program.", cta: "Check Canada visa fit", v: 892, conv: 234 },
    { n: "Country Fit Quiz", t: "COUNTRY_QUIZ", s: "country-fit", d: "8-question personality + budget quiz → best destination country.", cta: "Find my country", v: 1876, conv: 445 },
    { n: "SOP Strength Checker", t: "ELIGIBILITY_CHECKER", s: "sop-checker", d: "Paste your SOP → AI scores it on 5 dimensions + feedback.", cta: "Score my SOP", v: 678, conv: 198 },
  ];
  for (const m of magnets) {
    await prisma.leadMagnet.create({
      data: {
        name: m.n, type: m.t, slug: m.s, description: m.d, ctaText: m.cta,
        isActive: true, views: m.v, conversions: m.conv,
        embedCode: `<iframe src="https://educonnect.in/lm/${m.s}" width="100%" height="600" frameborder="0"></iframe>`,
      },
    });
  }
  console.log(`✅ Lead magnets: ${magnets.length}`);

  // 16. Audit logs (sample compliance trail)
  const auditLogs = [
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "LOGIN", res: "USER", det: "Counselor logged in from Mumbai", sev: "INFO" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "CREATE", res: "STUDENT", det: "Created student record: Aarav Sharma", sev: "INFO" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "UPDATE", res: "APPLICATION", det: "Application status changed: DRAFT → SUBMITTED (Oxford)", sev: "INFO" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "VIEW", res: "DOCUMENT", det: "Viewed passport scan for student cmsrvus...", sev: "INFO" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "EXPORT", res: "INVOICE", det: "Exported GST report Q1 2026 (12 invoices)", sev: "WARNING" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "ESCALATE", res: "DEADLINE", det: "Manually escalated deadline: Manchester application (1 day left)", sev: "CRITICAL" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "CREATE", res: "INVOICE", det: "Created invoice INV-2026-1001 for ₹1,24,500 (Manchester commission)", sev: "INFO" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "DELETE", res: "DOCUMENT", det: "Deleted duplicate passport scan (cmsrw80ll...)", sev: "WARNING" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "UPDATE", res: "SETTINGS", det: "Changed language preference: English → Hindi", sev: "INFO" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "VIEW", res: "STUDENT", det: "Viewed 47 student records (exported to PDF)", sev: "WARNING" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "LOGIN", res: "USER", det: "Counselor logged in (session resumed)", sev: "INFO" },
    { ue: "demo@educonnect.in", un: "Rajesh Mehta", act: "CREATE", res: "VISA", det: "Created visa application for Aarav Sharma (UK Tier 4)", sev: "INFO" },
  ];
  for (let i = 0; i < auditLogs.length; i++) {
    const a = auditLogs[i];
    await prisma.auditLog.create({
      data: {
        userId: counselor.id,
        userEmail: a.ue,
        userName: a.un,
        action: a.act,
        resource: a.res,
        details: a.det,
        ipAddress: "103.21.58." + (10 + i),
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        severity: a.sev,
      },
    });
  }
  console.log(`✅ Audit logs: ${auditLogs.length}`);

  // 17. Demo parent account (linked to Aarav Sharma)
  const aarav = await prisma.student.findFirst({ where: { firstName: "Aarav", lastName: "Sharma" } });
  if (aarav) {
    const parent = await prisma.parent.upsert({
      where: { email: "parent@educonnect.in" },
      update: {},
      create: {
        email: "parent@educonnect.in",
        name: "Mr. Mukesh Sharma",
        passwordHash: hashPassword("parent1234"),
        phone: "+91 98200 11223",
        avatarColor: "#0f766e",
      },
    });
    await prisma.parentStudent.upsert({
      where: { parentId_studentId: { parentId: parent.id, studentId: aarav.id } },
      update: {},
      create: { parentId: parent.id, studentId: aarav.id, relation: "PARENT" },
    });
    // Welcome message from counselor
    await prisma.parentMessage.create({
      data: {
        parentId: parent.id,
        studentId: aarav.id,
        fromRole: "COUNSELOR",
        body: "Welcome, Mr. Sharma! Aarav's UK applications are progressing well. He has 1 offer from University of Manchester and 2 more applications under review.",
      },
    });
    console.log(`✅ Parent account: parent@educonnect.in / parent1234 (linked to Aarav)`);
  }

  console.log("🎉 Seeding complete!");
  console.log("   Counselor login: demo@educonnect.in / demo1234");
  console.log("   Parent login:    parent@educonnect.in / parent1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
