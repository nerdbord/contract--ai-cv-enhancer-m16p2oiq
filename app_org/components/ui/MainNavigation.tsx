import { NavLink } from "@remix-run/react";
import { SignInButton, UserButton, useUser } from "@clerk/remix";
import { Logo } from "~/assets/Logo";

export const MainNavigation = () => {
  const { user } = useUser();

  return (
    <nav className="flex w-full items-center justify-between px-[60px] h-24 bg-slate-100 absolute top-0 left-0 right-0">
      <Logo />
      <div className="flex gap-6">
        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <SignInButton>
                <button className="btn btn-outline ">Log In</button>
              </SignInButton>
              <NavLink to="/get-started" className="btn btn-primary text-white">
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              <div className="flex gap-4 mr-4">
                <button className="btn btn-ghost">Enhance Resume</button>
                <button className="btn btn-ghost">My resume</button>
              </div>
              <UserButton /> <p>{user?.firstName}</p>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

//color: var(--d--colors-base-base-content, #1F2937);
//color: var(--d--colors-semantic-primary-content, #C7D2FE);
