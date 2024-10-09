import { useState } from "react";
import { Stepper } from "~/components/ui/Stepper";
import { JobOfferForm } from "~/components/JobOfferForm";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Link } from "@remix-run/react";
import { UploadCV } from "~/components/UploadCV";
import { EnhancedCV } from "~/components/EnhancedCV";
import { Loader } from "~/components/ui/Loader";
import { LoaderFunction } from "@remix-run/node";
import { createUserFromClerk } from "actions/user";
import { getAuth } from "@clerk/remix/ssr.server";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    throw new Error("User ID is null");
  }
  const user = await createUserFromClerk(userId);
  const userDBId = user?.id;
  return { userDBId };
};

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [jobOffer, setJobOffer] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // job offer
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const jobOfferText = formData.get("jobDescription") as string;
    setJobOffer(jobOfferText);
    console.log("Job Offer: ", jobOfferText);
  };

  const onJobOfferChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobOffer(event.target.value);
  };

  const handleJobOfferCheck = () => {
    if (jobOffer) {
      console.log("Going to Upload Resume with Job Offer: ", jobOffer);
    } else {
      console.log("Going to Upload Resume with no Job Offer provided");
    }
    handleForward();
  };

  // cv upload
  const onFileUpload = () => {
    setError(null);
    if (!uploadedFile) {
      setError(
        "We couldn't process your CV. Please check if the file format or size is correct or try again"
      );
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setError(null);
  };

  // steps
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };
  const handleForward = () => {
    setActiveStep((prev) => prev + 1);
  };

  return (
    <div className="flex items-start justify-between flex-col w-full h-full min-h-[calc(100vh-328px)]">
      <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9 ">
        <Stepper activeStep={activeStep} steps={steps} />
        <div className="flex flex-col items-center justify-end flex-grow w-[650px] pb-4 relative">
          {activeStep === 0 && (
            <JobOfferForm
              onSubmit={handleFormSubmit}
              onChange={onJobOfferChange}
              actionData={{ jobDescription: jobOffer ?? "" }}
              errorMessage={error ?? undefined}
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
            <UploadCV onFileUpload={handleFileSelect} />
          )}
          {activeStep === 2 && <EnhancedCV />}
          {error && (
            <div className="flex justify-center items-center gap-2 text-red-700 bg-red-100 border border-red-700 w-full text-center py-2 mt-2 rounded-xl text-sm">
              <AiOutlineExclamationCircle className="text-red-700 h-6 w-6" />
              <p className="text-red-700 font-bold ">{error}</p>
            </div>
          )}
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
                      handleJobOfferCheck();
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
