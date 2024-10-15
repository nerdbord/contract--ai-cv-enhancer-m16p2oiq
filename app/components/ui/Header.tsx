import { useLocation } from "react-router-dom";
import { Logo } from "~/assets/Logo";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/remix";
import { Link } from "@remix-run/react";

export const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="flex w-full items-center justify-between px-[60px] h-24 bg-indigo-50 max-w-screen-xl">
      <Link to="/">
        <Logo />
      </Link>
      <div className="flex gap-6 ">
        <div className="flex gap-8 items-center">
          {pathname === "/cv" && (
            <Link
              to="/dashboard"
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

          {pathname !== "/cv" && (
            <Link to="/cv" className="btn btn-primary text-white">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
