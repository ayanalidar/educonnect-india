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

  // 7. Demo parent account (linked to Aarav Sharma)
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
