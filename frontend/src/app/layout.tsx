import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Auth0ClientProvider from '../providers/Auth0ClientProvider';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lekhsewa - Nepali Canvas',
  description: 'A simple web application to draw and recognize Nepali characters.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Auth0ClientProvider>{children}</Auth0ClientProvider>
      </body>
    </html>
  );
}
