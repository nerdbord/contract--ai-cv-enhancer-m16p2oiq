/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  Link,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type {
  ActionFunction,
  AppLoadContext,
  LoaderFunction,
} from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Stepper } from "~/components/ui/Stepper";
import { JobOfferForm } from "~/components/JobOfferForm";
import { UploadCV } from "~/components/UploadCV";
import { EnhancedCV } from "~/components/EnhancedCV";
import { Loader } from "~/components/ui/Loader";
import { createUserFromClerk } from "actions/user";

const steps = [
  { label: "Job description" },
  { label: "Upload resume" },
  { label: "Suggestions" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await getAuth({
    request,
    params: {},
    context: {} as AppLoadContext,
  });
  if (!userId) {
    throw redirect("/login");
  }

  const user = await createUserFromClerk(userId);
  return json({ userId: user?.id });
};

type ActionData = {
  errors?: {
    jobDescription?: string;
    file?: string;
  };
  values?: {
    jobDescription?: string;
  };
  success?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "submitJobDescription": {
      const jobDescription = formData.get("jobDescription");

      if (!jobDescription) {
        return json<ActionData>({
          errors: {
            jobDescription: "Job description is required",
          },
        });
      }

      // Save job description logic here
      return json({ success: true, values: { jobDescription } });
    }

    case "uploadCV": {
      const file = formData.get("file");

      if (!file) {
        return json<ActionData>({
          errors: {
            file: "CV file is required",
          },
        });
      }

      // Process file upload logic here
      return json({ success: true });
    }

    default:
      return json({ success: false });
  }
};

export default function UploadPage() {
  const [activeStep, setActiveStep] = useState(0);
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();
  const { userId } = useLoaderData<typeof loader>();

  const isLoading = navigation.state === "submitting";
  const isProcessing = navigation.state === "loading";

  const handleStepChange = (direction: "forward" | "back") => {
    setActiveStep((prev) =>
      direction === "forward"
        ? Math.min(prev + 1, steps.length - 1)
        : Math.max(prev - 1, 0)
    );
  };

  return (
    <div className="flex items-start justify-between flex-col w-full h-full min-h-[calc(100vh-328px)]">
      <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9">
        <Stepper activeStep={activeStep} steps={steps} />

        <div className="flex flex-col items-center justify-end flex-grow w-[650px] pb-4 relative">
          {activeStep === 0 && (
            <Form method="post" className="w-full">
              <input type="hidden" name="intent" value="submitJobDescription" />
              <JobOfferForm
                errorMessage={actionData?.errors?.jobDescription}
                defaultValue={actionData?.values?.jobDescription}
              />
            </Form>
          )}

          {activeStep === 1 && (isLoading || isProcessing) && (
            <Loader
              mainText="We're working on your CV..."
              subText="Your document is being enhanced."
              subText2="This will only take a moment!"
            />
          )}

          {activeStep === 1 && !isLoading && !isProcessing && (
            <Form method="post" encType="multipart/form-data">
              <input type="hidden" name="intent" value="uploadCV" />
              <UploadCV errorMessage={actionData?.errors?.file} />
            </Form>
          )}

          {activeStep === 2 && <EnhancedCV />}

          {actionData?.errors && (
            <div className="flex justify-center items-center gap-2 text-red-700 bg-red-100 border border-red-700 w-full text-center py-2 mt-2 rounded-xl text-sm">
              <AiOutlineExclamationCircle className="text-red-700 h-6 w-6" />
              <p className="text-red-700 font-bold">
                {Object.values(actionData.errors)[0]}
              </p>
            </div>
          )}

          {!isLoading && !isProcessing && activeStep !== 2 && (
            <div className="flex justify-between w-full items-center gap-6 py-4">
              {activeStep > 0 ? (
                <button
                  onClick={() => handleStepChange("back")}
                  className="btn btn-outline flex items-center gap-2"
                  type="button"
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
                  onClick={() => handleStepChange("forward")}
                  className="btn btn-primary text-white flex items-center gap-2"
                  type="submit"
                >
                  {activeStep === 0
                    ? "Go to Upload resume"
                    : "Go to Suggestions"}
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
