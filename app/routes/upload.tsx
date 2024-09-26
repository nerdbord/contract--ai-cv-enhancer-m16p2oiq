/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction, redirect, ActionFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { saveCV, cvToJSON } from "actions/cv";
import { getUserByClerkId } from "actions/user";
import { prisma } from "lib/prisma";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/sign-in");

  const user = await getUserByClerkId(userId);
  const userDBId = user?.id;
  if (!userDBId) return redirect("/sign-in");
  return { userDBId };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const name = formData.get("textInput") as string;
  const userId = formData.get("userDBId") as string;

  if (!file) {
    return { message: "No file uploaded" };
  }

  if (!userId) {
    return { message: "User ID is missing." };
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

    const savedCV = await saveCV({
      fileBuffer: buffer,
      userId,
      name,
      fileName: file.name,
      mimeType: file.type,
      extractedCV: extractedCV,
    });

    return { cvId: savedCV.id };
  } catch (error) {
    return { message: `Failed to upload file`, error };
  }
};

export default function UploadCVRoute() {
  const actionData = useActionData<{
    message: string;
    structuredData?: Record<string, unknown>;
  }>();
  const loaderData = useLoaderData<{ userDBId: string }>();

  return (
    <main className="flex flex-col h-screen items-center justify-start gap-16 p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Upload your CV here:</p>
      <form
        className="flex flex-col gap-4"
        method="post"
        encType="multipart/form-data"
      >
        {/* the hidden input field to pass the userDBId to the action */}
        <input type="hidden" name="userDBId" value={loaderData.userDBId} />
        <input type="file" name="file" required />
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            id="textInput"
            name="textInput"
            placeholder="Give your CV a name, e.g., 'original CV'"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Upload File
        </button>
      </form>
      {actionData && (
        <div className="mt-4 text-green-500">
          <p>{actionData.message}</p>
        </div>
      )}
    </main>
  );
}
import crypto from "crypto";

function computeFileHash(buffer: Buffer): string {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}
