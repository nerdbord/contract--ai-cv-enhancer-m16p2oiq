import Image from "next/image";
import avatar from "@/assets/avatar.png";

export const Testimony = () => {
  return (
    <div className="py-14 bg-slate-100 flex flex-col items-center justify-center">
      <h2 className="text-center text-4xl not-italic font-normal leading-10 mb-9">
        Trusted by over 30k jobseekers around the world
      </h2>
      <div className="flex gap-6">
        <div className="flex flex-col items-start w-[204px]">
          <div className="bg-gray-800 text-white p-4 rounded-lg text-start max-w-xs ">
            <p>
              Lorem ipsum dolor sit amet consectetur. Arcu dolor accumsan arcu
              neque.
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Name</span>
          </div>
        </div>
        <div className="flex flex-col items-start w-[204px]">
          <div className="bg-gray-800 text-white p-4 rounded-lg text-start max-w-xs w-full">
            <p>
              Lorem ipsum dolor sit amet consectetur. Arcu dolor accumsan arcu
              neque.
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Name</span>
          </div>
        </div>
        <div className="flex flex-col items-start  w-[204px]">
          <div className="bg-gray-800 text-white p-4 rounded-lg text-start max-w-xs w-full">
            <p>
              Lorem ipsum dolor sit amet consectetur. Arcu dolor accumsan arcu
              neque.
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Name</span>
          </div>
        </div>
        <div className="flex flex-col items-start  w-[204px]">
          <div className="bg-gray-800 text-white p-4 rounded-lg text-start max-w-xs w-full">
            <p>
              Lorem ipsum dolor sit amet consectetur. Arcu dolor accumsan arcu
              neque.
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};
