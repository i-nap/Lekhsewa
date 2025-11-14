import type { Metadata } from "next";
import { Geist} from "next/font/google";
import "./globals.css";
import { AppNavbar } from "@/components/AppNavbar";
import Auth0ClientProvider from "./providers/Auth0ClientProvider";
import { Toaster } from "sonner";
import DotPattern from "@/components/ui/dot-pattern";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lekhsewa - Nepali Canvas',
  description: 'A simple web application to draw and recognize Nepali characters.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} antialiased 
                   text-neutral-300     
                   bg-neutral-950         
                   selection:bg-black-500/30`}
      >
        <div className="relative z-0 min-h-screen">
          <Auth0ClientProvider>
            <DotPattern
              width={24}
              height={24}
              cx={1.5}
              cy={1.5}
              cr={1.5}
              className="fixed inset-0 z-[0] fill-neutral-700/60 [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]"
            />
            <div className="relative z-10">
              <AppNavbar />
              <main>{children}</main>
            </div>
            <Toaster position="top-center" theme="dark" richColors />
          </Auth0ClientProvider>
        </div>
      </body>
    </html>
  );
}
