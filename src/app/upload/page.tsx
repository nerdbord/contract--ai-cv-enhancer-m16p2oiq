"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { Stepper } from "@/components/ui/Stepper";
import { JobOfferForm } from "@/components/JobOfferForm";
import UploadCV from "@/components/UploadCV";
import { EnhancedCV } from "@/components/EnhancedCV";
import { checkUserInDatabase } from "../../../actions/user";
import { cvToJSON } from "../../../actions/cv";
import { Loader } from "@/components/ui/Loader";

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
  const [cv, setCv] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkUserInDatabase();
      setUser(userData);
    };

    fetchUser();
  }, []);

  const handleGoToUploadResume = () => {
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

  const handleGetTailoredResume = async () => {
    if (!file) {
      setFileError("Please upload a file before proceeding.");
      return;
    }
    setFileError(null); // Clear previous errors
    console.log("GET TAILORED RESUME");
    setLoading(true);
    await cvtojson();

    if (cv) {
      setLoading(true);
      try {
        // Your logic here
      } catch (error) {
        console.error("Error getting tailored resume:", error);
        setLoading(false);
      }
    }
    setLoading(false);
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const onFileUpload = async (file: File) => {
    setFile(file);
    setFileError(null); // Clear error when a file is uploaded
  };

  const cvtojson = async () => {
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const cvData = await cvToJSON(buffer);
      setCv(cvData);
      console.log(cv);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center max-w-screen-2xl flex-grow px-[60px] py-9 bg-white h-full">
      <div className="container mx-auto px-4 flex-grow">
        <Stepper activeStep={activeStep} steps={steps} />
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full pt-16">
        {loading ? (
          <div className="pb-32">
            <Loader
              mainText="We're working on your CV..."
              subText="Your document is being enhanced."
              subText2="This will only take a moment!"
            />
          </div>
        ) : (
          <>
            <div className="mb-8 h-[330px] w-[650px]">
              {activeStep === 0 && (
                <JobOfferForm ref={formRef} onSubmit={onJobOfferFormSubmit} />
              )}
              {activeStep === 1 && <UploadCV onFileUpload={onFileUpload} />}
              {activeStep === 2 && <EnhancedCV />}
            </div>

            {fileError && <div className="text-red-500 mb-4">{fileError}</div>}

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
                <Link
                  href="/"
                  className="btn btn-outline flex items-center gap-2"
                >
                  <IoMdArrowBack />
                  Back
                </Link>
              )}

              <button
                onClick={() => {
                  if (activeStep === 1) {
                    handleGetTailoredResume();
                  } else {
                    handleGoToUploadResume();
                  }
                }}
                className="btn btn-primary text-white flex items-center gap-2"
              >
                {activeStep === 1
                  ? "Get tailored Resume"
                  : "Go to Upload resume"}
                <IoMdArrowForward />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
