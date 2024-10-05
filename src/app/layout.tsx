import type { Metadata } from "next";
import { Footer } from "../components/ui/Footer";
import { MainNavigation } from "../components/ui/MainNavigation";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI CV Enhancer",
  description: "Enhance your CV with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI CV Enhancer</title>
      </head>
      <body
        className={`${roboto.variable} antialiased flex flex-col min-h-screen w-full max-w-screen-xl mx-auto`}
      >
        <MainNavigation />
        <main className="flex-grow w-full flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
