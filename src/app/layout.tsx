import type { Metadata } from "next";
import { Mrs_Saint_Delafield, Inria_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";
import SmoothScroll from "@/components/SmoothScroll";

const script = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const serif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${script.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
