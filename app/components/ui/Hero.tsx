import { Link } from "@remix-run/react";
//import { FaStar } from "react-icons/fa";
import { HeroImg } from "~/assets/HeroImg";
import { Head, Lightning, Flower } from "~/assets/TestimonyIcons";

const benefitsData = [
  {
    title: "Personalized",
    description:
      "AI analyzes your skills and experience to create a resume that aligns with your career goals.",
    icon: <Head />,
  },
  {
    title: "Fast & Easy",
    description:
      "Save time by letting our technology do the heavy lifting, delivering a polished CV in minutes.",
    icon: <Lightning />,
  },
  {
    title: "Success-Driven",
    description:
      "Increase your chances of standing out with a CV that meets the job requirements.",
    icon: <Flower />,
  },
];

export const Hero = () => {
  return (
    <div className="hero bg-indigo-900 flex flex-col text-white w-full max-w-screen-xl">
      <div className="flex  hero-content text-start flex-col gap-6 lg:flex-row-reverse w-full lg:w-full lg:items-start py-20 px-[60px]">
        <HeroImg className="w-auto h-auto lg:w-1/2 object-cover px-9" />

        <div className="text-content flex flex-col items-start gap-6 w-full lg:w-1/2 p-9">
          <h1 className="text-7xl font-bold not-italic font-normal leading-md">
            Unlock Your <br />
            Dream Job with AI
          </h1>
          <p className="text-slate-200 text-lg not-italic font-normal leading-md">
            Powered by ChatGPT, Enhancv is the easiest way to create a tailored
            resume containing all the right keywords, improve your writing &
            highlight your strengths.
          </p>
          <Link to="/cv" className="btn btn-primary text-white">
            Enhance My Resume
          </Link>
          <p className="text-base text-indigo-200 not-italic font-normal leading-6">
            Get started for free and see the results!
          </p>
          {/*  <div className="flex gap-6 items-start mt-9">
            <div className="flex gap-1 items-center">
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="text-accent h-6 w-6" />
              <FaStar className="h-6 w-6" />
            </div>
            <p>3,908 happy customers shared their experience.</p>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col gap-8 py-14 px-[60px] w-full text-start">
        <h2 className="text-center text-5xl not-italic font-normal leading-normal">
          Discover the Benefits
        </h2>
        <div className="flex justify-center">
          <div className="flex  gap-5 justify-center w-4/5">
            {benefitsData.map((benefit, index) => (
              <div key={index} className="text-start flex gap-2 p-2 w-2/3">
                <div className="w-1/4">
                  <div className="w-10 h-10 rounded-full bg-teal-400 text-black flex items-center justify-center mx-auto mb-4 text-2xl not-italic font-normal leading-10 text-base-neutral ">
                    {benefit.icon}
                  </div>
                </div>

                <div className="w-3/4">
                  <h3 className="text-xl not-italic font-semibold leading-6 mb-2">
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
