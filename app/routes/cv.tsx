/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction, redirect, ActionFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { getUserCV, enhanceCV, cvToJSON } from "actions/cv";
import { getUserByClerkId } from "actions/user";
import { useState } from "react";
import crypto from "crypto";
import { Stepper } from "~/components/ui/Stepper";
import { JobOfferForm } from "~/components/JobOfferForm";
import { prisma } from "lib/prisma";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  const userDBId = user?.id;

  if (!userDBId) return redirect("/sign-in");

  try {
    const userCV = await getUserCV(userDBId);
    !userCV && console.log("user has no cv");
    return { userDBId, userCV };
  } catch (error) {
    return { userDBId, error: (error as Error).message };
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const jobDescription =
    formData.get("jobDescription") || "No job offer link provided";
  const file = formData.get("file") as File | null;
  const userId = formData.get("userDBId") as string;
  console.log("file", file);
  console.log("jobDescription", jobDescription);

  function computeFileHash(buffer: Buffer): string {
    const hash = crypto.createHash("sha256");
    hash.update(buffer);
    return hash.digest("hex");
  }

  try {
    if (!file) {
      return { error: "No file uploaded" };
    }
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
    console.log("extractedCV", extractedCV);

    return {
      jobDescription,
      cvData: extractedCV,
      userId,
      message: "CV uploaded and processed successfully",
    };
  } catch (error) {
    console.error("Błąd podczas ekstrakcji tekstu z CV:", error);
    return { error: (error as Error).message };
  }
};

export default function CVRoute() {
  const actionData = useActionData<{
    error?: string;
    jobDescription?: string;
    cvData?: unknown;
    message?: string;
    userId?: string;
    cvId?: string;
  }>();

  const loaderData = useLoaderData<{
    userDBId: string;
    userCV?: object | null;
    error?: string;
    message?: string;
  }>();

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
  };

  // steps
  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    setActiveStep((prev) => prev + 1);
  };

  const steps = [
    { label: "Job description" },
    { label: "Upload resume" },
    { label: "Suggestions" },
  ];

  return (
    <main className="flex flex-col h-full items-center justify-start gap-16">
      <div className="flex items-start justify-between flex-col w-full h-full min-h-[calc(100vh-328px)]">
        <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9 ">
          <Stepper activeStep={activeStep} steps={steps} />
          <div className="flex flex-col items-center justify-end flex-grow w-[650px] pb-4 h-full">
            {actionData?.error && (
              <div className="text-red-500">Error: {actionData.error}</div>
            )}
            {loaderData?.error && (
              <div className="text-red-500">Error: {loaderData.error}</div>
            )}
            {actionData?.message && (
              <div className="text-green-500">
                Message: {actionData.message}
              </div>
            )}
            {loaderData?.message && (
              <div className="text-green-500">
                Message: {loaderData.message}
              </div>
            )}
            {activeStep === 0 && (
              <>
                <JobOfferForm />
                <div className="flex justify-between w-full items-center bg-white pt-3">
                  <Link className="btn btn-outline" to="/">
                    Back
                  </Link>
                  <button
                    className="btn btn-primary text-white"
                    onClick={handleForward}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {activeStep === 1 && (
              <>
                <form
                  className="flex flex-col gap-4"
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit}
                >
                  {/* the hidden input field to pass the userDBId to the action */}
                  <input
                    type="hidden"
                    name="userDBId"
                    value={loaderData.userDBId}
                  />
                  <input type="file" name="file" required />

                  <input
                    type="hidden"
                    id="textInput"
                    name="textInput"
                    placeholder="Give your CV a name, e.g., 'original CV'"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                    disabled={isLoading}
                  >
                    {isLoading ? "Uploading..." : "Upload File"}
                  </button>
                </form>

                <div className="flex justify-between w-full items-center bg-white pt-3">
                  <button className="btn btn-outline" onClick={handleBack}>
                    Back
                  </button>
                  <button
                    className="btn btn-primary text-white"
                    onClick={handleForward}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
