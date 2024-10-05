"use client";
import React from "react";
import { useState } from "react";
import { Stepper } from "../components/ui/Stepper";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";

type Props = {};

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

const page = (props: Props) => {
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
      <div className="flex flex-col items-center justify-center h-full border">
        <div>KOMPONENT UPLOAD CV</div>

        <div className="w-[650px] flex justify-between items-center">
          {activeStep > 0 ? (
            <button
              onClick={handlePreviousStep}
              disabled={activeStep === 0}
              className="btn btn-outline"
            >
              <IoMdArrowBack />
              Back
            </button>
          ) : (
            <Link href="/" className="btn btn-outline">
              <IoMdArrowBack />
              Back
            </Link>
          )}
          <button
            type="button"
            onClick={handleNextStep}
            className="btn btn-primary text-white"
          >
            Go to Upload resume
            <IoMdArrowBack className="rotate-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
