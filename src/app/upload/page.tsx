"use client";
import React, { useState } from "react";
import { Stepper } from "../components/ui/Stepper";
import Link from "next/link";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { UploadCV } from "../components/UploadCV";
import { JobOfferForm } from "../components/JobOfferForm";
import { EnhancedCV } from "../components/EnhancedCV";

type Props = {};

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

const Page = (props: Props) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <div className="flex flex-col justify-between items-center max-w-screen-2xl flex-grow px-[60px] py-9 bg-white h-full">
      <div className="container mx-auto px-4 flex-grow">
        <Stepper activeStep={activeStep} steps={steps} />
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full pt-20">
        <div
          className="mb-8 border h-[270px] w-[650px]
        "
        >
          {activeStep === 0 && <JobOfferForm />}
          {activeStep === 1 && <UploadCV />}
          {activeStep === 2 && <EnhancedCV />}
        </div>

        <div className="w-[650px] flex justify-between items-center">
          {activeStep > 0 ? (
            <button
              onClick={handlePreviousStep}
              disabled={activeStep === 0}
              className="btn btn-outline flex items-center gap-2"
            >
              <IoMdArrowBack />
              Back
            </button>
          ) : (
            <Link href="/" className="btn btn-outline flex items-center gap-2">
              <IoMdArrowBack />
              Back
            </Link>
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="btn btn-primary text-white flex items-center gap-2"
          >
            {activeStep === 1 ? "Go to Suggestions" : "Go to Upload resume"}
            <IoMdArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
