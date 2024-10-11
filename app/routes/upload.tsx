/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Stepper } from "../components/ui/Stepper";
import { JobOfferForm } from "../components/JobOfferForm";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Link, useLoaderData, useActionData, Form } from "@remix-run/react";
import { EnhancedCV } from "../components/EnhancedCV";
import { Loader } from "../components/ui/Loader";
import { UploadCV } from "../components/UploadCV";
import {
  LoaderFunction,
  ActionFunction,
  json,
  redirect,
} from "@remix-run/node";
import { createUserFromClerk } from "actions/user";
import { getAuth } from "@clerk/remix/ssr.server";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { saveOriginalCV, cvToJSON } from "actions/cv";
import { Buffer } from "buffer";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args); // Correctly pass entire args to getAuth
  if (!userId) {
    return null;
  }
  let user;
  if (userId) {
    user = await createUserFromClerk(userId);
  }
  return json({ userDBId: user?.id });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const step = formData.get("step");

  if (step === "jobOffer") {
    const jobDescription = formData.get("jobDescription") as string;
    console.log(
      jobDescription ? "Job offer received" : "No job offer provided"
    );
    console.log("Job Offer: ", jobDescription);
    console.log("Form Data: ", formData); // Console log the job offer after it's added
    // Job description is no longer required
    return json({ jobDescription: jobDescription ?? "" });
  }

  if (step === "uploadCV") {
    const uploadedFile = formData.get("cvFile") as File;
    const jobDescription = formData.get("jobDescription") as string; // Get the job offer for logging
    if (!uploadedFile) {
      return json({ error: "CV file is required" }, { status: 400 });
    }
    try {
      const text = await uploadedFile.text();
      const jsonResult = await cvToJSON(Buffer.from(text));
      console.log("Job Offer: ", jobDescription); // Console log the job offer after CV is uploaded
      console.log("CV Data: ", jsonResult);
      console.log("Form Data: ", formData); // Console log the CV data after CV is uploaded
      return json({ cvData: jsonResult });
    } catch (err) {
      console.error("Error processing CV:", err);
      return json({ error: "Error processing CV content" }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

export default function UploadPage() {
  const actionData = useActionData<{
    error?: string;
    jobDescription?: string;
    cvData?: unknown;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // steps
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    setActiveStep((prev) => prev + 1);
  };

  const getButtonText = () => {
    switch (activeStep) {
      case 0:
        return "Go to Upload resume";
      case 1:
        return "Go to Suggestions";
      default:
        return "Next";
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            <input type="hidden" name="step" value="jobOffer" />
            <JobOfferForm
              onChange={(e) => setError(null)}
              actionData={{
                jobDescription: actionData?.jobDescription ?? "",
              }}
              errorMessage={actionData?.error}
            />
            <div className="flex justify-between w-full items-center mt-4">
              <Link to="/" className="btn btn-outline flex items-center gap-2">
                <GoArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <button
                type="button"
                onClick={handleForward}
                className="btn btn-primary text-white flex items-center gap-2"
              >
                {getButtonText()}
                <GoArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      case 1:
        return isLoading ? (
          <Loader
            mainText="We're working on your CV..."
            subText="Your document is being enhanced."
            subText2="This will only take a moment!"
          />
        ) : (
          <div className="w-full">
            <UploadCV
              onFileUpload={(file) => setUploadedFile(file)}
              file={uploadedFile}
              errorMessage={actionData?.error}
            />
            {!error && (
              <div className="text-red-500 mt-2 flex items-center gap-2">
                <AiOutlineExclamationCircle className="h-5 w-5" />
                {error}
              </div>
            )}
            <div className="flex justify-between w-full items-center mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-outline flex items-center gap-2"
              >
                <GoArrowLeft className="h-5 w-5" />
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 1 && !uploadedFile) {
                    setError("CV file is required to proceed.");
                  } else {
                    handleForward();
                  }
                }}
                className="btn btn-primary text-white flex items-center gap-2"
              >
                {getButtonText()}
                <GoArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      case 2:
        return <EnhancedCV cvData={actionData?.cvData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start justify-between flex-col w-full h-full min-h-[calc(100vh-328px)]">
      <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9 ">
        <Stepper activeStep={activeStep} steps={steps} />
        <div className="flex flex-col items-center justify-end flex-grow w-[650px] pb-4 h-full">
          {renderStep()}
          {!isLoading && activeStep !== 2 && activeStep > 0 && (
            <div className="flex justify-between w-full items-center gap-6 py-4"></div>
          )}
        </div>
      </div>
    </div>
  );
}
