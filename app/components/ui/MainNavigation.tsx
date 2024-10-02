import { NavLink } from "@remix-run/react";
import { SignInButton, UserButton, useUser } from "@clerk/remix";

export const MainNavigation = () => {
  const { user } = useUser();

  return (
    <nav className="flex w-full items-center justify-between p-6 bg-slate-100 absolute top-0 left-0 right-0">
      <h2>LOGO</h2>
      <div className="flex gap-6">
        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <SignInButton>
                <button className="btn btn-outline">Log In</button>
              </SignInButton>
              <NavLink to="/get-started" className="btn btn-primary">
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              <div className="flex gap-4 mr-4">
                <p>Enhance Resume</p>
                <p>My resume</p>
              </div>
              <UserButton /> <p>{user?.firstName}</p>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
