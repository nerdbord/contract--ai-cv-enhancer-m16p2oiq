import { SignIn } from "@clerk/remix";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center w-full h-full bg-white min-h-[calc(100vh-328px)]">
      <SignIn />
    </div>
  );
}
