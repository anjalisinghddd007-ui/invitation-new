import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const cinzelDeco = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Anoop & Sanya's Wedding Invitation",
  description: "Together with their families, Anoop & Sanya invite you to celebrate their wedding on 20 November 2026 at Rock Yard, Prayagraj.",
  openGraph: {
    title: "Anoop & Sanya's Wedding",
    description: "An interactive digital invitation experience for the union of Sanya and Anoop Singh.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${cinzelDeco.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F3] text-zinc-800 font-sans selection:bg-[#C5A880]/20 selection:text-[#A27B5C]">
        {children}
      </body>
    </html>
  );
}
