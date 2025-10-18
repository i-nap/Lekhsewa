import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppNavbar } from "@/components/AppNavbar";
import Auth0ClientProvider from "./providers/Auth0ClientProvider";

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
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} antialiased 
                   text-neutral-300     
                   bg-neutral-950         
                   selection:bg-black-500/30`}
      >
        <Auth0ClientProvider>
          <AppNavbar />
          <main>{children}</main>
        </Auth0ClientProvider>
      </body>
    </html>
  );
}