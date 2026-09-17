import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "POWER LENS | Edwards Godspower (@gpoweredward)",
  description:
    "Mobile Photography Portfolio by Edwards Godspower (@gpoweredward). High-contrast chiaroscuro photography, urban rhythm, and mobile lens mastery from Niger State to the world.",
  keywords: [
    "Power Lens",
    "Edwards Godspower",
    "gpoweredward",
    "Mobile Photography",
    "Niger State Photography",
    "Chiaroscuro",
    "Fine Art Mobile Photography",
  ],
  authors: [{ name: "Edwards Godspower" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} dark h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0e0e0e] text-[#e5e2e1] font-sans min-h-screen flex flex-col selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
