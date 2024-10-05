import Link from "next/link";
//import { SignInButton, UserButton } from "@clerk/nextjs";
//import { useUser } from "@clerk/nextjs";
import { Logo } from "@/assets/Logo";

export const MainNavigation = () => {
  // Ensure useUser is being used correctly.
  // const { isLoaded, isSignedIn, user } = useUser();

  // If the user data is not loaded yet, we can return null or a loading state
  /*   if (!isLoaded) {
    return null; // Alternatively, return a loading spinner or placeholder
  }
 */
  return (
    <nav className="flex w-full items-center justify-between px-[60px] h-24 bg-slate-100 max-w-screen-xl">
      <Link href="/">
        {/* You don't need to wrap Logo in an anchor tag here */}
        <Logo />
      </Link>
      <div className="flex gap-6">
        <div className="flex gap-4 items-center">
          <Link href="/upload" className="btn btn-primary text-white">
            Get Started
          </Link>
          {/*     {!isSignedIn ? (
            <>
              <SignInButton>
                <button className="btn btn-outline">Log In</button>
              </SignInButton>
              <Link href="/upload" className="btn btn-primary text-white">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <div className="flex gap-4 mr-4">
                <Link href="/upload">
                  <button className="btn btn-outline">Enhance Resume</button>
                </Link>
                <Link href="/dashboard">
                  <button className="btn btn-outline">My resume</button>
                </Link>
              </div>
              <UserButton />
              <p>{user?.firstName}</p>
            </>
          )} */}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
