import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "L'Âge d'Or | The Fine Art of Culinary Design",
  description: "Experience the genesis of flavor. A sensory scrollytelling journey through the crafting of our signature masterwork, curated by award-winning WebGL visual artists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-cream text-luxury-black selection:bg-gold/20 selection:text-gold">
        {children}
      </body>
    </html>
  );
}
