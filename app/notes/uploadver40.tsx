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
import { createUserFromClerk, getUserByClerkId } from "actions/user";
import { getAuth } from "@clerk/remix/ssr.server";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { cvToJSON, getUserCV, saveCV } from "actions/cv";
import { Buffer } from "buffer";
import crypto from "crypto";
import { prisma } from "lib/prisma";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  const userDBId = user?.id;
  if (!userDBId) return redirect("/sign-in");

  try {
    const userCV = await getUserCV(userDBId);
    if (!userCV) {
      return { userDBId, userCV: null };
    }
    return { userDBId, userCV };
  } catch (error) {
    return { userDBId, error: (error as Error).message };
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const jobDescription = formData.get("jobDescription") as string;
  const file = formData.get("cvFile") as File;
  const userId = formData.get("userDBId") as string;
  const step = formData.get("step");

  if (file) {
    console.log("file", file);
  } else {
    console.log("file", null);
  }

  function computeFileHash(buffer: Buffer): string {
    const hash = crypto.createHash("sha256");
    hash.update(buffer);
    return hash.digest("hex");
  }

  if (!file) {
    return { message: "No file uploaded" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const cvHash = computeFileHash(buffer);
    const existingCV = await prisma.cV.findUnique({
      where: {
        cvHash,
      },
    });

    if (existingCV) {
      return {
        message: `The file ${file.name} has already been uploaded.`,
        cvId: existingCV.id,
      };
    }

    const extractedCV = await cvToJSON(buffer);

    const name = "original_cv";
    const savedCV = await saveCV({
      fileBuffer: buffer,
      userId,
      name: name,
      fileName: file.name,
      mimeType: file.type,
      extractedCV: extractedCV,
    });

    /*  return redirect(`/cv`); */
    return { message: `Successfully uploaded ${file.name}`, cvId: savedCV.id };
  } catch (error) {
    return { message: `Failed to upload file`, error };
  }
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
            {/*  {!error && (
              <div className="text-red-500 mt-2 flex items-center gap-2">
                <AiOutlineExclamationCircle className="h-5 w-5" />
                {error}
              </div>
            )} */}
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
