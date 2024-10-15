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
import jsPDF from "jspdf";

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
      fileName: file.name,
      step: 2,
    };
  } catch (error) {
    //console.error("Błąd podczas ekstrakcji tekstu z CV:", error);
    return { error: (error as Error).message, step: 2 };
  }
};
type CVData = {
  name: string;
  occupation: string;
  contact: {
    email: string;
    phone: string;
    portfolio?: string;
    linkedin?: string;
  };
  languages: string[];
  summaryStatement?: string;
  skills: string[];
  technologies: string[];
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
    duties: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    duration: string;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    link: string;
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
    fileName?: string;
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
  const [fileName, setFileName] = useState("");
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

  useEffect(() => {
    if (actionData?.fileName) {
      setFileName(actionData.fileName || "");
    }
  }, [actionData]);
  const downloadCVAsPDF = () => {
    if (!generatedCV) return;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(generatedCV.name, 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(generatedCV.occupation, 105, 23, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    let currentY = 35;
    const pageHeight = doc.internal.pageSize.height; // wysokość strony

    const checkPageEnd = (y: number) => {
      if (y > pageHeight - 20) {
        // 20px marginesu na dole
        doc.addPage();
        return 15; // resetuje Y dla nowej strony
      }
      return y;
    };

    doc.text(`Email: ${generatedCV.contact.email}`, 10, currentY);
    currentY += 6;
    doc.text(`Phone: ${generatedCV.contact.phone}`, 10, currentY);
    currentY += 6;
    if (generatedCV.contact.portfolio) {
      doc.text(`Portfolio: ${generatedCV.contact.portfolio}`, 10, currentY);
      currentY += 6;
    }
    if (generatedCV.contact.linkedin) {
      doc.text(`LinkedIn: ${generatedCV.contact.linkedin}`, 10, currentY);
      currentY += 6;
    }

    currentY += 4;
    currentY = checkPageEnd(currentY);
    if (generatedCV.summaryStatement) {
      doc.setFont("helvetica", "bold");
      doc.text("Summary statement:", 10, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.text(generatedCV.summaryStatement, 10, currentY, { maxWidth: 180 });
      currentY += 12;
      currentY = checkPageEnd(currentY);
    }

    if (generatedCV.languages && generatedCV.languages.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Languages:", 10, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.text(generatedCV.languages.join(", "), 10, currentY);
      currentY += 12;
      currentY = checkPageEnd(currentY);
    }

    if (generatedCV.technologies && generatedCV.technologies.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Technologies:", 10, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.text(generatedCV.technologies.join(", "), 10, currentY);
      currentY += 12;
      currentY = checkPageEnd(currentY);
    }

    if (generatedCV.experience && generatedCV.experience.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Experience:", 10, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      generatedCV.experience.forEach((exp) => {
        doc.text(`${exp.position} at ${exp.company}`, 10, currentY);
        currentY += 6;
        doc.text(`Duration: ${exp.duration}`, 10, currentY);
        currentY += 6;
        doc.text(`Description: ${exp.description}`, 10, currentY, {
          maxWidth: 180,
        });
        currentY += 6;
        if (exp.duties && exp.duties.length > 0) {
          doc.text("Duties:", 10, currentY);
          currentY += 6;
          exp.duties.forEach((duty) => {
            doc.text(`- ${duty}`, 10, currentY);
            currentY += 6;
          });
        }
        currentY += 6;
        currentY = checkPageEnd(currentY);
      });
    }

    if (generatedCV.projects && generatedCV.projects.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Projects:", 10, currentY);
      currentY += 6;

      generatedCV.projects.forEach((project) => {
        doc.setFont("helvetica", "bold");
        // Tytuł projektu z linkiem obok
        doc.textWithLink(project.title, 10, currentY, { url: project.link });
        doc.setFont("helvetica", "normal");
        doc.text(
          `(${project.link})`,
          doc.getTextWidth(project.title) + 12,
          currentY
        ); // Link obok tytułu projektu

        currentY += 6;

        // Opis projektu
        doc.text(`Description: ${project.description}`, 10, currentY, {
          maxWidth: 180,
        });

        currentY += 6;

        // Technologie użyte w projekcie
        doc.text(
          `Technologies: ${project.technologies.join(", ")}`,
          10,
          currentY
        );

        currentY += 12;

        // Sprawdzenie, czy konieczne jest dodanie nowej strony
        currentY = checkPageEnd(currentY);
      });
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    const rodoConsent = `
Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO).
`;

    const rodoConsentLines = doc.splitTextToSize(rodoConsent, 180);
    doc.text(rodoConsentLines, 10, currentY);
    currentY += rodoConsentLines.length * 4;
    currentY = checkPageEnd(currentY);

    const englishConsent = `
I hereby consent to my personal data being processed by (company name) for the purpose of considering my application for the vacancy advertised under reference number (123XX6 etc.).
`;

    const englishConsentLines = doc.splitTextToSize(englishConsent, 180);
    doc.text(englishConsentLines, 10, currentY);
    currentY += englishConsentLines.length * 4;
    currentY = checkPageEnd(currentY);

    doc.save(`${generatedCV.name}_CV.pdf`);
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
                      {actionData?.fileName ? (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-lg">
                            File uploaded: {actionData.fileName}
                          </p>
                        </div>
                      ) : (
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center gap-2 border border-slate-300 rounded-lg w-[650px] h-[220px] p-6 bg-inherit resize-none flex-grow focus:outline-none focus:ring-0 focus:border-slate-300"
                        >
                          <UploadIcon />
                          <p className="text-black text-center text-lg not-italic font-normal leading-7">
                            Click the icon above or drop your resume in here!
                          </p>
                          <p className="text-center text-xs not-italic font-normal leading-4 text-slate-500">
                            Resumes in PDF or DOCS. Readable text only (no
                            scans). Max 2MB file size.
                          </p>
                          <input
                            id="file-upload"
                            type="file"
                            name="file"
                            className="hidden"
                            required
                          />
                        </label>
                      )}
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
                    <button
                      className="btn btn-primary text-white self-end"
                      onClick={downloadCVAsPDF}
                    >
                      <TfiDownload /> Download as PDF
                    </button>
                  ))}
                {generatedCV && (
                  <div className="text-left w-full mt-4 p-5 border border-gray-300 rounded-lg overflow-auto">
                    <h2 className="text-3xl font-bold mt-6 text-end">
                      {generatedCV.name}
                    </h2>
                    <p className="mt-4 text-end text-slate-500">
                      {generatedCV.occupation}
                    </p>
                    <div className="mb-4 mt-10">
                      <h3 className="font-bold text-xl">
                        Contact Information:
                      </h3>
                      <p>Email: {generatedCV.contact.email}</p>
                      <p>Phone: {generatedCV.contact.phone}</p>
                      {generatedCV.contact.portfolio && (
                        <p>Portfolio: {generatedCV.contact.portfolio}</p>
                      )}
                      {generatedCV.contact.linkedin && (
                        <p>LinkedIn: {generatedCV.contact.linkedin}</p>
                      )}
                    </div>

                    {generatedCV.summaryStatement && (
                      <div className="mb-4">
                        <h3 className="font-bold text-xl">
                          Summary statement:
                        </h3>
                        <p>{generatedCV.summaryStatement}</p>
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="font-bold text-xl">Languages:</h3>
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
                      <h3 className="font-bold text-xl">Technologies:</h3>
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
                      <h3 className="font-bold text-xl">Experience:</h3>
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
                      <h3 className="font-bold text-xl">Education:</h3>
                      {generatedCV.education.map((edu: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="font-bold">
                            {edu.degree} at {edu.institution}
                          </p>
                          <p>Duration: {edu.duration}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold text-xl">Projects:</h3>
                      {generatedCV.projects.map(
                        (project: any, index: number) => (
                          <div key={index} className="mb-2">
                            <p className="font-bold">
                              {project.title} - {project.link}
                            </p>
                            <p> {project.description}</p>
                            <p>technologies used - {project.technologies}</p>
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex flex-col items-start justify-center gap-2 text-sm text-slate-500 mt-6">
                      <p>
                        Wyrażam zgodę na przetwarzanie moich danych osobowych
                        dla potrzeb niezbędnych do realizacji procesu rekrutacji
                        zgodnie z Rozporządzeniem Parlamentu Europejskiego i
                        Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie
                        ochrony osób fizycznych w związku z przetwarzaniem
                        danych osobowych i w sprawie swobodnego przepływu takich
                        danych oraz uchylenia dyrektywy 95/46/WE (RODO).
                      </p>
                      <p>
                        I hereby consent to my personal data being processed by
                        (company name) for the purpose of considering my
                        application for the vacancy advertised under reference
                        number (123XX6 etc.)
                      </p>
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
