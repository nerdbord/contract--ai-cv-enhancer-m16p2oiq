/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { LoaderFunction, redirect, ActionFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { getUserCV, enhanceCV, cvToJSON, saveCV } from "actions/cv";
import { getUserByClerkId } from "actions/user";
import crypto from "crypto";
import { Stepper } from "~/components/ui/Stepper";
import { JobOfferForm } from "~/components/JobOfferForm";
import { prisma } from "lib/prisma";
import { Loader } from "~/components/ui/Loader";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { UploadIcon } from "~/components/ui/UploadIcon";
import { TfiDownload } from "react-icons/tfi";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    //console.log("User ID is null");
    return { userDBId: null, userCV: null };
  }

  const user = await getUserByClerkId(userId);
  const userDBId = user?.id;

  if (!userDBId) {
    //console.log("User DB ID is null");
    return { userDBId: null, userCV: null };
  }

  try {
    const userCV = await getUserCV(userDBId);
    /*  !userCV && console.log("user has no cv"); */
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
  //console.log("file", file);
  //console.log("jobDescription", jobDescription);

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

    if (userId) {
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
          step: 1,
        };
      }
    }

    const extractedCV = await cvToJSON(buffer);
    const enhancedCV = await enhanceCV(extractedCV);

    return {
      jobDescription,
      cvData: enhancedCV,
      userId,
      message: "CV uploaded and processed successfully",
      step: 2,
    };
  } catch (error) {
    //console.error("Błąd podczas ekstrakcji tekstu z CV:", error);
    return { error: (error as Error).message, step: 2 };
  }
};

type CVData = {
  name: string;
  contact: {
    email: string;
    phone: string;
    portfolio?: string;
    linkedin?: string;
  };
  languages: string[];
  bio?: string;
  skills: string[];
  technologies: string[];
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    duration: string;
  }[];
};

export default function CVRoute() {
  const actionData = useActionData<{
    error?: string;
    jobDescription?: string;
    cvData?: CVData;
    message?: string;
    userId?: string;
    cvId?: string;
    step?: number;
  }>();

  const loaderData = useLoaderData<{
    userDBId: string;
    userCV?: object | null;
    error?: string;
    message?: string;
  }>();

  const [activeStep, setActiveStep] = useState(actionData?.step ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    (e.target as HTMLFormElement).submit();
  };

  // cv data
  useEffect(() => {
    if (actionData?.cvData) {
      setGeneratedCV(actionData.cvData);
    }
  }, [actionData]);

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
    { label: "Your new Resume" },
  ];

  return (
    <main className="flex flex-col h-full items-center justify-start gap-16">
      <div className="flex items-start justify-between flex-col w-full h-full min-h-[calc(100vh-328px)]">
        <div className="flex gap-9 flex-col flex-grow w-full items-center bg-white pt-9 ">
          <Stepper activeStep={activeStep} steps={steps} />
          <div className="flex flex-col items-center justify-end flex-grow w-[650px] pb-4 py-4 h-full ">
            {isLoading ? (
              <div className="flex py-12 items-center justify-center">
                <Loader
                  mainText="We're working on your CV..."
                  subText="Your document is being enhanced."
                  subText2="This will only take a moment!"
                />
              </div>
            ) : (
              <>
                {activeStep === 0 && (
                  <>
                    <JobOfferForm />
                    <div className="flex justify-between w-full items-center bg-white pt-4">
                      <Link className="btn btn-outline" to="/">
                        <GoArrowLeft className="h-5 w-5 " />
                        Back
                      </Link>
                      <button
                        className="btn btn-primary text-white"
                        onClick={handleForward}
                      >
                        Go to Upload Resume{" "}
                        <GoArrowRight className="h-5 w-5 " />
                      </button>
                    </div>
                  </>
                )}
                {activeStep === 1 && (
                  <div className="flex flex-col items-center w-full">
                    <h1 className="text-center text-5xl not-italic font-normal pb-9">
                      Add your job description
                    </h1>
                    <p className="text-base text-start not-italic font-normal leading-6 pb-9">
                      Paste link to a job offer or the job description you want
                      to compare your resume to.
                    </p>
                    <form
                      className="flex flex-col gap-4 w-full"
                      method="post"
                      encType="multipart/form-data"
                      onSubmit={(e) => {
                        setIsLoading(true);
                        handleSubmit(e);
                      }}
                    >
                      <input
                        type="hidden"
                        name="userDBId"
                        value={loaderData.userDBId}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2 border border-slate-300 rounded-lg w-[650px] h-[220px] p-6 bg-inherit resize-none flex-grow focus:outline-none focus:ring-0 focus:border-slate-300"
                      >
                        <UploadIcon />
                        <p className="text-black text-center text-lg not-italic font-normal leading-7">
                          Click the icon above or drop your resume in here!
                        </p>
                        <p className="text-center text-xs not-italic font-normal leading-4 text-slate-500">
                          Resumes in PDF or DOCS. Readable text only (no scans).
                          Max 2MB file size.
                        </p>
                        <input
                          id="file-upload"
                          type="file"
                          name="file"
                          className="hidden"
                          required
                        />
                      </label>
                      <input
                        type="hidden"
                        placeholder="Give your CV a name, e.g., 'original CV'"
                        className="gap-6 border border-slate-300 rounded-lg w-h-[188px] p-6 cursor-pointer bg-inherit resize-none flex-grow focus:outline-none focus:ring-0 focus:border-slate-300"
                      />
                      <div className="flex justify-between w-full items-center bg-white ">
                        <button
                          className="btn btn-outline"
                          onClick={handleBack}
                        >
                          <GoArrowLeft className="h-5 w-5 " />
                          Back
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary text-white"
                        >
                          Get an Enhanced Resume
                          <GoArrowRight className="h-5 w-5 " />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {activeStep === 2 &&
                  (!loaderData.userDBId ? (
                    <div className="flex flex-col items-center w-full">
                      <Link
                        to="/sign-in"
                        className="self-end btn btn-primary text-white"
                      >
                        Log in to download Resume
                      </Link>
                    </div>
                  ) : (
                    <button className="btn btn-primary text-white self-end">
                      <TfiDownload /> Download
                    </button>
                  ))}
                {generatedCV && (
                  <div className="text-left w-full mt-4 p-5 border border-gray-300 rounded-lg overflow-auto">
                    <h2 className="text-2xl font-bold mb-4">
                      {generatedCV.name}
                    </h2>
                    <div className="mb-4">
                      <h3 className="font-bold">Contact Information:</h3>
                      <p>Email: {generatedCV.contact.email}</p>
                      <p>Phone: {generatedCV.contact.phone}</p>
                      {generatedCV.contact.portfolio && (
                        <p>Portfolio: {generatedCV.contact.portfolio}</p>
                      )}
                      {generatedCV.contact.linkedin && (
                        <p>LinkedIn: {generatedCV.contact.linkedin}</p>
                      )}
                    </div>

                    {generatedCV.bio && (
                      <div className="mb-4">
                        <h3 className="font-bold">Bio:</h3>
                        <p>{generatedCV.bio}</p>
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="font-bold">Languages:</h3>
                      <ul className="flex flex-wrap">
                        {generatedCV.languages.map(
                          (lang: string, index: number) => (
                            <li className="mr-2" key={index}>
                              {lang}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold">Skills:</h3>
                      <ul className="flex flex-wrap">
                        {generatedCV.skills.map(
                          (skill: string, index: number) => (
                            <li className="mr-2" key={index}>
                              {skill}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold">Technologies:</h3>
                      <ul className="flex flex-wrap">
                        {generatedCV.technologies.map(
                          (tech: string, index: number) => (
                            <li className="mr-2" key={index}>
                              {tech}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold">Experience:</h3>
                      {generatedCV.experience.map((exp: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="font-bold">
                            {exp.position} at {exp.company}
                          </p>
                          <p>Duration: {exp.duration}</p>
                          <p>{exp.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold">Education:</h3>
                      {generatedCV.education.map((edu: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="font-bold">
                            {edu.degree} at {edu.institution}
                          </p>
                          <p>Duration: {edu.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
