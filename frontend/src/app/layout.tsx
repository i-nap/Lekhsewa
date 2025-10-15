import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppNavbar } from "@/components/AppNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lekhsewa - Nepali Canvas",
  description: "A simple web application to draw and recognize Nepali characters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} antialiased 
                   text-slate-800     
                   bg-gray-100         
                   selection:bg-blue-500/20`}
      >
        <AppNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}