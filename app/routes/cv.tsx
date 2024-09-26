/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { useLoaderData } from "@remix-run/react";
import { getUserByClerkId } from "actions/user";
import { getCV } from "actions/cv";

// Loader function to get user database ID and CV data
export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  const userDBId = user?.id;
  if (!userDBId) return redirect("/sign-in");

  try {
    const CV = await getCV(userDBId);

    if (!CV) {
      return {
        message: "CV data not found or invalid format",
        structuredData: null,
      };
    }

    return {
      userDBId,
      message: "CV data loaded successfully",
      structuredData: CV,
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in loader function:", error);
    return {
      userDBId,
      message: `Failed to load CV data`,
      error,
      structuredData: null,
    };
  }
};

// Page Component to display CV
export default function CVRoute() {
  const loaderData = useLoaderData<{
    userDBId: string;
    message: string;
    structuredData?: {
      name: string;
      education: { degree: string; institution: string; year: string }[];
      experience: { role: string; company: string; duration: string }[];
      skills: string[];
    };
  }>();

  // Render the CV Data
  return (
    <main className="flex flex-col h-screen items-center justify-start gap-8 p-8">
      <h1 className="text-3xl font-bold">CV Dashboard</h1>

      {/* Check for valid structuredData before rendering */}
      {!loaderData.structuredData ? (
        <div className="text-red-500">No CV data available</div>
      ) : (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">
            CV for {loaderData.structuredData.name}
          </h2>
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            <ul className="list-disc pl-5">
              {loaderData.structuredData.education.map((edu, index) => (
                <li key={index} className="mb-1">
                  <strong>{edu.degree}</strong>, {edu.institution} ({edu.year})
                </li>
              ))}
            </ul>
          </section>
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            <ul className="list-disc pl-5">
              {loaderData.structuredData.experience.map((exp, index) => (
                <li key={index} className="mb-1">
                  <strong>{exp.role}</strong>, {exp.company} ({exp.duration})
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <ul className="list-disc pl-5">
              {loaderData.structuredData.skills.map((skill, index) => (
                <li key={index} className="mb-1">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
      {loaderData && (
        <div className="mt-4 text-green-500">
          <p>{loaderData.message}</p>
        </div>
      )}
    </main>
  );
}
