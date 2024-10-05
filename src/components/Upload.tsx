/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { Stepper } from "../components/ui/Stepper";
import { IoMdArrowBack } from "react-icons/io";
import { UploadCV } from "../components/UploadCV";
import { JobDescriptionForm } from "../components/JobDescriptionForm";
import { CV } from "../components/CV";
import Link from "next/link";
import { cvToJSON, saveCV } from "../../actions/cv";
import { useRouter } from "next/navigation";

export default function Upload() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showCV, setShowCV] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userDBId, setUserDBId] = useState<string | null>(null);

  const steps = [
    { label: "Job description" },
    { label: "Upload resume" },
    { label: "Suggestions" },
  ];

  const handleStepChange = (nextStep: number) => {
    setActiveStep(nextStep);
    setShowCV(false);
    setUploadError(null);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (activeStep === 0) {
      handleStepChange(activeStep + 1);
    }
  };

  const handleBackClick = () => {
    if (activeStep > 0) {
      handleStepChange(activeStep - 1);
    }
  };

  const handleGetTailoredResume = () => {
    handleStepChange(2);
    setShowCV(true);
  };

  const handleFileUpload = async (file: File) => {
    /*     if (!userDBId) {
      setUploadError("User ID not found. Please try again.");
      return;
    } */

    try {
      setUploadError(null);
      setIsLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      console.log("ARRAY BUFFER =>", arrayBuffer);
      const buffer = Buffer.from(arrayBuffer);
      console.log("BUFFER =>", buffer);
      const extractedCV = await cvToJSON(buffer);
      console.log(extractedCV);
      /*       await saveCV({
        fileBuffer: buffer,
        name: file.name,
        fileName: file.name,
        mimeType: file.type,
        userId: userDBId || "no user logged in",
        extractedCV,
      }); */
      console.log("CV successfully saved");
    } catch (error) {
      console.error("Error saving CV:", error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to save CV. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center max-w-screen-2xl flex-grow px-[60px] py-9 bg-white h-full">
      <div className="container mx-auto px-4 flex-grow">
        <Stepper activeStep={activeStep} steps={steps} />

        <div className="flex flex-col justify-center items-center mt-20 gap-9">
          {activeStep === 0 && (
            <JobDescriptionForm onSubmit={handleFormSubmit} />
          )}
          {activeStep === 1 && (
            <>
              <UploadCV onFileUpload={(file: File) => handleFileUpload(file)} />
              {uploadError && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {uploadError}
                </div>
              )}
              {isLoading && (
                <div className="text-blue-500 text-sm mt-2 text-center">
                  Uploading your CV...
                </div>
              )}
            </>
          )}
          {activeStep === 2 && showCV && <CV />}

          <div className="flex justify-between w-[650px] mt-6">
            {activeStep === 0 ? (
              <Link href="/">
                <button className="btn btn-outline">
                  <IoMdArrowBack />
                  Back
                </button>
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleBackClick}
                disabled={isLoading}
              >
                <IoMdArrowBack />
                Back
              </button>
            )}

            {!showCV &&
              (activeStep === 0 ? (
                <button
                  type="button"
                  className="btn btn-primary text-white"
                  onClick={() => handleStepChange(activeStep + 1)}
                  disabled={isLoading}
                >
                  Go to Upload resume
                  <IoMdArrowBack className="rotate-arrow" />
                </button>
              ) : (
                activeStep === 1 && (
                  <button
                    className="btn btn-primary text-white"
                    onClick={handleGetTailoredResume}
                    disabled={isLoading || !!uploadError}
                  >
                    Get tailored Resume
                    <IoMdArrowBack className="rotate-arrow" />
                  </button>
                )
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Notes:
// 1. Routing: Next.js uses `Link` from `next/link` instead of `react-router-dom`.
// 2. Removed `useFetcher` and `useNavigation` hooks since Next.js uses a different data fetching and navigation paradigm.
// 3. Added `useRouter` from Next.js to handle potential navigation needs.
// 4. The action functions (`cvToJSON` and `saveCV`) should be updated to handle API calls in Next.js (likely through an API route or server-side function).
