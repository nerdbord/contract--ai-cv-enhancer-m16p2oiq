import { SignUp } from "@clerk/remix";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center w-full h-full bg-white min-h-[calc(100vh-328px)]">
      <SignUp />
    </div>
  );
}
