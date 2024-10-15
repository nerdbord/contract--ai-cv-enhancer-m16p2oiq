/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Stepper } from "../components/ui/Stepper";
import { JobOfferForm } from "../components/JobOfferForm";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Link, useLoaderData, useActionData } from "@remix-run/react";
import { UploadCV } from "../components/UploadCV";
import { EnhancedCV } from "../components/EnhancedCV";
import { Loader } from "../components/ui/Loader";
import { LoaderFunction, ActionFunction, json } from "@remix-run/node";
import { createUserFromClerk } from "actions/user";
import { getAuth } from "@clerk/remix/ssr.server";
import { AiOutlineExclamationCircle } from "react-icons/ai";
//import { saveOriginalCV, cvToJSON } from "actions/cv";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args); // Correctly pass entire args to getAuth
  if (!userId) {
    console.error("User ID is null");
  }
  let user;
  if (userId) {
    user = await createUserFromClerk(userId);
  }
  return json({ userDBId: user?.id });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const jobDescription = formData.get("jobDescription") as string;
  if (!jobDescription) {
    return json({ error: "Job description is required" }, { status: 400 });
  }
  return json({ jobDescription });
};

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

export default function UploadPage() {
  //const { userDBId } = useLoaderData();
  const actionData = useActionData<{ error?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [jobOffer, setJobOffer] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [base64CV, setBase64CV] = useState<string | null>(null);

  // job offer
  const handleJobOfferCheck = () => {
    if (jobOffer) {
      console.log("Going to Upload Resume with Job Offer: ", jobOffer);
    } else {
      console.log("Going to Upload Resume with no Job Offer provided");
    }
    handleForward();
  };

  // cv upload
  const handleFileSelect = (file: File | null) => {
    if (file) {
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        if (fileReader.result) {
          const base64String = fileReader.result.toString().split(",")[1];
          setBase64CV(base64String);
        }
      };

      fileReader.onerror = () => {
        setError("Error reading file");
      };

      fileReader.readAsDataURL(file);
      setUploadedFile(file);
      setError(null);
    } else {
      setUploadedFile(null);
      setBase64CV(null);
    }
  };

  // steps
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleStepAction = () => {
    if (activeStep === 0) {
      handleJobOfferCheck();
    } else if (activeStep === 1) {
      handleUploadStep();
    }
  };

  const handleUploadStep = () => {
    if (!uploadedFile) {
      setError(
        "We couldn't process your CV. Please check if the file format or size is correct or try again"
      );
      return;
    }
    setError(null);
    handleForward();
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

  return (
    <div className="flex items-start justify-between flex-col w-full h-full min-h-[calc(100vh-328px)]">
      <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9 ">
        <Stepper activeStep={activeStep} steps={steps} />
        <div className="flex flex-col items-center justify-end flex-grow w-[650px] pb-4 h-full">
          {activeStep === 0 && (
            <JobOfferForm
              onSubmit={(e) => {
                e.preventDefault();
                handleJobOfferCheck();
              }}
              onChange={(e) => setJobOffer(e.target.value)}
              actionData={{ jobDescription: jobOffer ?? "" }}
              errorMessage={actionData?.error}
            />
          )}
          {activeStep === 1 && isLoading && (
            <Loader
              mainText="We're working on your CV..."
              subText="Your document is being enhanced."
              subText2="This will only take a moment!"
            />
          )}

          {activeStep === 1 && !isLoading && (
            <UploadCV onFileUpload={handleFileSelect} file={uploadedFile} />
          )}

          {/*    {activeStep === 2 && <EnhancedCV />} */}
          {error && (
            <div className="flex justify-center items-center gap-2 text-red-700 bg-red-100 border border-red-700 w-full text-center py-2 mt-2 rounded-xl text-sm">
              <AiOutlineExclamationCircle className="text-red-700 h-6 w-6" />
              <p className="text-red-700 font-bold ">{error}</p>
            </div>
          )}
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
                  onClick={handleStepAction}
                  className="btn btn-primary text-white flex items-center gap-2"
                >
                  {getButtonText()}
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
