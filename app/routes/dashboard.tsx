/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction, redirect, ActionFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { createUserFromClerk } from "../../actions/user";
import React from "react";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");
  const user = await createUserFromClerk(userId);
  const userDBId = user?.id;
  if (!userDBId) return redirect("/sign-in");
  return { userDBId };
};

export const action: ActionFunction = async ({ request }) => {};

export default function DashboardRoute() {
  const actionData = useActionData<{
    message: string;
    structuredData?: Record<string, unknown>;
  }>();
  const loaderData = useLoaderData<{ userDBId: string }>();

  return (
    <main className="flex flex-col h-screen items-center justify-start gap-16 p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex  gap-4">
        <Link to="/upload">
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Upload and Enhance CV
          </button>
        </Link>
        <Link to="/cv">
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            View your CV
          </button>
        </Link>
      </div>
    </main>
  );
}
