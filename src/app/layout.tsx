import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Mentice – Mental Wellness Tracker",
  description:
    "Track your mood, identify stress triggers, and receive personalized wellness support during board exams, JEE, NEET, CUET, CAT, GATE, and UPSC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full overflow-x-hidden`}>
      <body className="h-full antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
