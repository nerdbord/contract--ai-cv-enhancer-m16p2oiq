"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/assets/Logo";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const MainNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center justify-between px-[60px] h-24 bg-indigo-50 max-w-screen-xl">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex gap-6 ">
        <div className="flex gap-8 items-center">
          {pathname === "/upload" && (
            <Link
              href="/dashboard"
              className="btn btn-ghost text-normal font-light"
            >
              Dashboard
            </Link>
          )}
          <SignedOut>
            <SignInButton>
              <button className="btn btn-outline">Log in</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          {pathname !== "/upload" && (
            <Link href="/upload" className="btn btn-primary text-white">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
