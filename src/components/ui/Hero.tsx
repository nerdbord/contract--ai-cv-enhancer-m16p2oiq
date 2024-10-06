import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { HeroImg } from "@/assets/HeroImg";
import { Head, Lightning, Flower } from "@/assets/TestimonyIcons";

const benefitsData = [
  {
    title: "Personalized for You",
    description:
      "AI analyzes your skills and experience to create a resume that aligns with your career goals.",
    icon: <Head />,
  },
  {
    title: "Fast and Efficient",
    description:
      "Save time by letting our technology do the heavy lifting, delivering a polished CV in minutes.",
    icon: <Lightning />,
  },
  {
    title: "Optimized for Success",
    description:
      "Increase your chances of standing out with a resume to meet the requirements of your job.",
    icon: <Flower />,
  },
];

export const Hero = () => {
  return (
    <div className="hero bg-indigo-900 flex flex-col text-white">
      <div className="hero-content flex-col gap-6 lg:flex-row-reverse w-full lg:w-full lg:items-center py-20 px-[60px]">
        <HeroImg className="w-auto h-full lg:w-1/2 object-cover" />

        <div className="text-content w-full lg:w-1/2 p-9">
          <h1 className="text-7xl font-bold not-italic font-normal leading-md">
            Unlock Your <br />
            Dream Job with AI
          </h1>
          <p className="py-6 text-slate-200 text-2xl not-italic font-normal leading-md">
            Powered by ChatGPT, Enhancv is the easiest way to create a tailored
            resume containing all the right keywords, improve your writing &
            highlight your strengths.
          </p>
          <Link href="/upload" className="btn btn-primary">
            Enhance My Resume
          </Link>
          <div className="flex gap-6 items-start mt-9">
            <div className="flex gap-1 items-center">
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="h-6 w-6" />
            </div>
            <p>3,908 happy customers shared their experience.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 py-14 px-[60px] w-full">
        <h2 className="text-center text-5xl not-italic font-normal leading-normal">
          Discover the Benefits
        </h2>
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-5 justify-center">
            {benefitsData.map((benefit, index) => (
              <div
                key={index}
                className="text-start flex gap-2 p-2.5 w-[250px]"
              >
                <div className="w-1/4">
                  <div className="w-10 h-10 rounded-full bg-teal-400 text-black flex items-center justify-center mx-auto mb-4 text-2xl not-italic font-normal leading-10 text-base-neutral ">
                    {benefit.icon}
                  </div>
                </div>

                <div className="w-3/4">
                  <h3 className="text-base not-italic font-semibold leading-6 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-200 text-sm not-italic font-normal leading-5 text-pretty">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
