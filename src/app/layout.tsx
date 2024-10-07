import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MainNavigation } from "@/components/ui/MainNavigation";
import { Footer } from "@/components/ui/Footer";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumify | AI-powered CV enhancer",
  description:
    "AI-powered CV enhancer that boosts your chances with tailored, keyword-optimized resumes designed to pass ATS filters and impress recruiters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${roboto.variable} antialiased flex flex-col min-h-screen w-full max-w-screen-xl mx-auto`}
        >
          <MainNavigation />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
