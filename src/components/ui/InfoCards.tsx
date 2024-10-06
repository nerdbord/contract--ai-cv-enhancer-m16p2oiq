import heroimg from "@/assets/mockimg.png";
import Image from "next/image";
import { InfoCards1 } from "@/assets/InfoCards1";
import { InfoCards2 } from "@/assets/InfoCards2";
import { InfoCards3 } from "@/assets/InfoCards3";

export const InfoCards = () => {
  return (
    <div className="flex flex-col gap-9 items-center p-4 bg-white px-60 py-14">
      <div className="flex gap-5 items-center">
        <InfoCards1 className="w-1/3 h-auto" />
        <div className="p-6 w-2/3">
          <h2 className="text-3xl pb-[30px]">
            Scan Your Job Listing
            <br />
            and Let AI Do the Work
          </h2>
          <p>
            Upload or paste your job offer, and our AI instantly analyzes the
            key requirements. It scans for skills, qualifications,and keywords,
            making sure you know exactly what the employer is looking for.
          </p>
        </div>
      </div>
      <div className="flex gap-5 items-center ">
        <div className="p-6  w-2/3">
          <h2 className="text-3xl pb-[30px]">
            Tailor Your CV in Just
            <br /> a Few Clicks
          </h2>
          <p>
            Based on the job description, the AI suggests personalized changes
            to your resume. From optimizing bullet points to highlighting the
            most relevant experience, you can tweak and perfect your CV
            effortlessly.
          </p>
        </div>
        <InfoCards2 className="w-1/3 h-auto" />
      </div>
      <div className="flex gap-5 items-center">
        <InfoCards3 className="w-1/3 h-auto" />
        <div className="p-6 w-2/3">
          <h2 className="text-3xl  pb-[30px]">
            Download and Apply
            <br /> with Confidence
          </h2>
          <p>
            Once your CV is optimized, simply download the final version. With
            the right keywords and structure, you can be sure it’s ready to
            impress recruiters and get you through the application filters.
          </p>
        </div>
      </div>
    </div>
  );
};
