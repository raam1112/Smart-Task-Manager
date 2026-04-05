import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Smart Task Manager",
  description: "A highly interactive, modern task manager built with Next.js, Supabase, and Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <Chatbot />
        </div>
      </body>
    </html>
  );
}
