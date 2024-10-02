import { useUser } from "@clerk/remix";
import { GoPlus } from "react-icons/go";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="flex flex-col justify-center  items-center p-4 bg-inherit  w-full  flex-grow p-28">
      <div className="flex max-w-screen-lg  gap-4 items-center justify-between w-full border">
        <div>
          <h2 className="text-3xl">My resume</h2>
          <p>Welcome back, {user?.firstName}</p>
          <p>You dont have any documents yet</p>
        </div>
        <button className="btn btn-primary text-white">
          <GoPlus className="h-6 w-6" />
          Create new
        </button>
      </div>
      <div className="flex items-center p-6 bg-white rounded-lg shadow-md w-1/2 h-[276px] bg-inherit self-start">
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
  );
}
