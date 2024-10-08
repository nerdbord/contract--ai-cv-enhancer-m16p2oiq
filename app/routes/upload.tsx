/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Stepper } from "~/components/ui/Stepper";
import { JobOfferForm } from "~/components/JobOfferForm";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Link } from "@remix-run/react";
import { UploadCV } from "~/components/UploadCV";
import { EnhancedCV } from "~/components/EnhancedCV";
import { Loader } from "~/components/ui/Loader";

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

export default function UploadPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onJobOfferSubmit = () => {
    console.log("onJobOfferSubmit");
    setActiveStep((prev) => prev + 1);
  };

  const onFileUpload = () => {
    console.log("onFileUpload");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveStep((prev) => prev + 1);
    }, 2000); // Simulating loading delay
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex items-start justify-between flex-col w-full h-full min-h-[calc(100vh-328px)]">
      <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9 ">
        <Stepper activeStep={activeStep} steps={steps} />
        <div className="flex flex-col items-center justify-end flex-grow w-[650px]  pb-4 border">
          {activeStep === 0 && <JobOfferForm onSubmit={onJobOfferSubmit} />}
          {activeStep === 1 && isLoading && (
            <Loader
              mainText="We're working on your CV..."
              subText="Your document is being enhanced."
              subText2="This will only take a moment!"
            />
          )}
          {activeStep === 1 && !isLoading && (
            <UploadCV onFileUpload={onFileUpload} />
          )}
          {activeStep === 2 && <EnhancedCV />}

          {/* Hide buttons when loading or on step 2 */}
          {!isLoading && activeStep !== 2 && (
            <div className="flex justify-between w-full items-center gap-6 py-4">
              {activeStep > 0 && activeStep !== 2 ? (
                <button
                  onClick={handleBack}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <GoArrowLeft className="h-5 w-5" />
                  Back
                </button>
              ) : (
                <Link
                  to="/"
                  className="btn btn-outline flex items-center gap-2"
                >
                  <GoArrowLeft className="h-5 w-5" />
                  Back
                </Link>
              )}
              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => {
                    if (activeStep === 0) {
                      onJobOfferSubmit();
                    } else if (activeStep === 1) {
                      onFileUpload();
                    }
                  }}
                  className="btn btn-primary text-white flex items-center gap-2"
                >
                  {activeStep === 0 && "Go to Upload resume"}
                  {activeStep === 1 && "Go to Suggestions"}
                  <GoArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/*       <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9">
        <Stepper activeStep={activeStep} steps={steps} />
        <div className="flex flex-col items-center justify-center flex-grow w-[650px]">
          {activeStep === 0 && <JobOfferForm onSubmit={onJobOfferSubmit} />}
          {activeStep === 1 && isLoading && (
            <Loader
              mainText="We're working on your CV..."
              subText="Your document is being enhanced."
              subText2="This will only take a moment!"
            />
          )}
          {activeStep === 1 && !isLoading && (
            <UploadCV onFileUpload={onFileUpload} />
          )}
          {activeStep === 2 && <EnhancedCV />}

 
          {!isLoading && activeStep !== 2 && (
            <div className="flex justify-between w-full items-center gap-6 py-4">
              {activeStep > 0 && activeStep !== 2 ? (
                <button
                  onClick={handleBack}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <GoArrowLeft className="h-5 w-5" />
                  Back
                </button>
              ) : (
                <Link
                  to="/"
                  className="btn btn-outline flex items-center gap-2"
                >
                  <GoArrowLeft className="h-5 w-5" />
                  Back
                </Link>
              )}
              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => {
                    if (activeStep === 0) {
                      onJobOfferSubmit();
                    } else if (activeStep === 1) {
                      onFileUpload();
                    }
                  }}
                  className="btn btn-primary text-white flex items-center gap-2"
                >
                  {activeStep === 0 && "Go to Upload resume"}
                  {activeStep === 1 && "Go to Suggestions"}
                  <GoArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div> </div>; */
