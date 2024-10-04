/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { useLoaderData } from "@remix-run/react";
import { getUserByClerkId } from "actions/user";
import { getCVById } from "actions/cv";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  const userDBId = user?.id;
  if (!userDBId) return redirect("/sign-in");

  try {
    const CV = await getCVById(4);

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
    console.error("Error in loader function:", error);
    return {
      userDBId,
      message: `Failed to load CV data`,
      error,
      structuredData: null,
    };
  }
};

export default function CVRoute() {
  const loaderData = useLoaderData<{
    userDBId: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    structuredData?: any; // Changed to accept any type of data
  }>();

  return (
    <main className="flex flex-col h-screen items-center justify-start gap-8 p-8">
      <h1 className="text-3xl font-bold">CV Dashboard</h1>

      {/* Display the whole structuredData object as JSON */}

      <pre className="w-full max-w-4xl bg-gray-100 p-4 rounded bg-inherit">
        {JSON.stringify(loaderData.structuredData, null, 2)}
      </pre>

      {loaderData && (
        <div className="mt-4 text-green-500">
          <p>{loaderData.message}</p>
        </div>
      )}
    </main>
  );
}
