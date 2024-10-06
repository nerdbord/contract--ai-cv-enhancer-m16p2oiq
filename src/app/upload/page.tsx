"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { Stepper } from "@/components/ui/Stepper";
import { JobOfferForm } from "@/components/JobOfferForm";
import UploadCV from "@/components/UploadCV";
import { EnhancedCV } from "@/components/EnhancedCV";
import { checkUserInDatabase } from "../../../actions/user";

type Props = {};

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

type User = {
  id: string;
  email: string;
  name: string | null;
  clerkId: string;
};

const Page = (props: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [jobLink, setJobLink] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkUserInDatabase();
      setUser(userData);
    };

    fetchUser();
  }, []);

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
    const jobLink = formData.get("jobDescription") as string;
    setJobLink(jobLink);
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const onFileUpload = (file: File) => {
    setFile(file);
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
