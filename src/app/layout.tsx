import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduConnect India — Smart SaaS for Education Consultants",
  description:
    "EduConnect India is the all-in-one SaaS platform for Indian education consultants. Manage students, applications, partner universities, visas, and analytics — across 1,000+ Indian and overseas institutions.",
  keywords: [
    "education consultants India",
    "study abroad SaaS",
    "university admissions India",
    "student CRM",
    "overseas education platform",
    "visa tracker",
    "EduConnect India",
  ],
  authors: [{ name: "EduConnect India" }],
  openGraph: {
    title: "EduConnect India — Smart SaaS for Education Consultants",
    description:
      "Manage students, applications, partner universities, visas, and analytics across 1,000+ Indian and overseas institutions.",
    siteName: "EduConnect India",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduConnect India — Smart SaaS for Education Consultants",
    description:
      "Manage students, applications, partner universities, visas, and analytics across 1,000+ Indian and overseas institutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
