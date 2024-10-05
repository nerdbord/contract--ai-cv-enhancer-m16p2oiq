import Link from "next/link";
import { Logo } from "@/assets/Logo";

export const MainNavigation = () => {
  return (
    <nav className="flex w-full items-center justify-between px-[60px] h-24 bg-slate-100 max-w-screen-xl">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex gap-6">
        <div className="flex gap-4 items-center">
          <Link href="/upload" className="btn btn-primary text-white">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};
