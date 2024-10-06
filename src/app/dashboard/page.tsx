import Link from "next/link";
import React from "react";
import { GoPlus } from "react-icons/go";
import { CVCard } from "../components/ui/CVcard";
type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col max-w-screen-2xl flex-grow px-[60px] py-16 bg-white h-full">
      <div className="container mx-auto px-4 flex-grow">
        <div className="flex gap-4 items-center justify-between w-full py-4">
          <div>
            <h2 className="text-5xl not-italic font-normal pb-7">My resume</h2>
            <p className="text-2xl not-italic font-semibold leading-8">
              Welcome back, user.
            </p>

            <p className="text-xl not-italic font-normal leading-7">
              You don&#39;t have any documents yet
            </p>
          </div>
          {/* <CVCard cv={undefined} index={0} /> */}
          <Link
            className="btn btn-primary text-white flex items-center self-end"
            href={"/upload"}
          >
            <GoPlus className="h-6 w-6 mr-2 " />
            Create new
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
