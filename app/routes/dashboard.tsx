import { useUser } from "@clerk/remix";
import { Link } from "@remix-run/react";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="flex flex-col justify-center items-center p-4 bg-inherit text-white w-full  flex-grow">
      <h1 className="text-3xl mb-4">Welcome, {user?.firstName}</h1>
      <Link to="/logout" className="text-blue-400 hover:underline">
        Logout
      </Link>
    </div>
  );
}
