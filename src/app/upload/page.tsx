"use client";
import React, { useState, useRef } from "react";
import { Stepper } from "../components/ui/Stepper";
import Link from "next/link";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { UploadCV } from "../../notes/UploadCV2";
import { JobOfferForm } from "../components/JobOfferForm";
import { EnhancedCV } from "../components/EnhancedCV";
import { on } from "events";

type Props = {};

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

const Page = (props: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleNextStep = () => {
    if (activeStep === 0 && formRef.current) {
      formRef.current.requestSubmit();
    } else {
      setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const onJobOfferFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const jobDescription = formData.get("jobDescription") as string;

    console.log("Job offer form submitted");
    console.log("Job Description:", jobDescription);

    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const onFileUpload = (file: File) => {
    console.log("File uploaded:", file);
  };

  return (
    <div className="flex flex-col justify-between items-center max-w-screen-2xl flex-grow px-[60px] py-9 bg-white h-full">
      <div className="container mx-auto px-4 flex-grow">
        <Stepper activeStep={activeStep} steps={steps} />
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full pt-16">
        <div className="mb-8 h-[330px] w-[650px]">
          {activeStep === 0 && (
            <JobOfferForm ref={formRef} onSubmit={onJobOfferFormSubmit} />
          )}
          {activeStep === 1 && <UploadCV onFileUpload={onFileUpload} />}
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
            onClick={handleNextStep}
            className="btn btn-primary text-white flex items-center gap-2"
          >
            {activeStep === 1 ? "Get tailored Resume" : "Go to Upload resume"}
            <IoMdArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
