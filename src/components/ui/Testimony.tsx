import Image from "next/image";
import avatar from "@/assets/avatar.png";

export const Testimony = () => {
  return (
    <div className="py-14 bg-white flex flex-col items-center justify-center">
      <h2 className="text-center text-4xl not-italic font-normal leading-10 mb-9">
        Trusted by over 30k jobseekers around the world
      </h2>
      <div className="flex gap-6">
        <div className="flex flex-col items-start w-[204px]">
          <div className="bg-indigo-900 text-white p-4 rounded-lg text-start max-w-xs ">
            <p>
              "This tool transformed my resume in minutes! I got a callback
              within days!"
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Sarah T.</span>
          </div>
        </div>
        <div className="flex flex-col items-start w-[204px]">
          <div className="bg-indigo-900 text-white p-4 rounded-lg text-start max-w-xs w-full">
            <p>
              "I finally have a CV that stands out! I started getting interview
              invites almost immediately."
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Mark L.</span>
          </div>
        </div>
        <div className="flex flex-col items-start  w-[204px]">
          <div className="bg-indigo-900 text-white p-4 rounded-lg text-start max-w-xs w-full">
            <p>
              “The AI knew exactly what to high light from my experience to land
              me interviews.”
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Emily R.</span>
          </div>
        </div>
        <div className="flex flex-col items-start  w-[204px]">
          <div className="bg-indigo-900 text-white p-4 rounded-lg text-start max-w-xs w-full">
            <p>
              “It matched my skills to the job description perfectly, and it
              wasso easy to use."
            </p>
          </div>
          <div className="mt-4 flex items-center w-full">
            <Image
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="Profile Image"
            />
            <span className="ml-2 text-sm">- Olivia W.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
