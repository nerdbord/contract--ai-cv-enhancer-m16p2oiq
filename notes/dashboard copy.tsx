import { LoaderFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { useUser } from "@clerk/remix";
import { GoPlus } from "react-icons/go";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    redirect("/sign-in");
  }

  return { data: { userId } };
};

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="flex flex-col max-w-screen-2xl flex-grow p-10 bg-white border border-purple-900">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 items-center justify-between w-full border-b py-4">
          <div>
            <h2 className="text-3xl">My resume</h2>
            <p>Welcome back, {user?.firstName}</p>
            <p>You don&#39;t have any documents yet</p>
          </div>
          <button className="btn btn-primary text-white flex items-center">
            <GoPlus className="h-6 w-6 mr-2" />
            Create new
          </button>
        </div>
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md w-full max-w-lg mt-6">
          <div className="flex items-center justify-center w-24 h-24 bg-blue-50 border border-blue-300 rounded-lg">
            <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
              +
            </button>
          </div>
          <div className="ml-6">
            <h3 className="text-lg font-semibold text-blue-600">New resume</h3>
            <p className="mt-2 text-sm text-gray-600">
              Don&#39;t hesitate to tailor your resume to the job description,
              this will double your chances of getting an interview!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
