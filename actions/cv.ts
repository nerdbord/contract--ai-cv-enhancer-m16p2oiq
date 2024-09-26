import { z } from "zod";
import { prisma } from "lib/prisma";
import { openai } from "lib/openai";
import { generateObject } from "ai";
import { Prisma } from "@prisma/client";
import crypto from "crypto";

export const CVSchema = z.object({
  name: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    portfolio: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  skills: z.array(z.string()),
  technologies: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      duration: z.string(),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      duration: z.string(),
    })
  ),
});

export const cvToJSON = async (buffer: Buffer) => {
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: CVSchema,
      prompt: "Extract the text from the attached CV." + buffer.toString(),
    });
    console.log("Extracted text:", result.object);
    return result.object;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error("Extracting text from CV failed.");
  }
};

const computeFileHash = (buffer: Buffer): string => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

type SaveCVParams = {
  fileBuffer: Buffer;
  name: string;
  fileName: string;
  mimeType: string;
  userId: string;
  extractedCV: object;
};

export async function saveCV({
  fileBuffer,
  name,
  fileName,
  mimeType,
  userId,
  extractedCV,
}: SaveCVParams) {
  try {
    const cvHash = computeFileHash(fileBuffer);

    const savedCV = await prisma.cV.create({
      data: {
        cv: fileBuffer,
        name,
        fileName,
        mimeType,
        userId,
        cvHash,
        extractedCV: extractedCV as Prisma.JsonObject,
      },
    });

    //console.log("successfully saved CV");
    return savedCV;
  } catch (error) {
    //console.error("Error saving CV:", error);
    throw new Error(`Failed to save CV - ${error}`);
  }
}

export async function getCV(userId: string) {
  try {
    const cv = await prisma.cV.findFirst({
      where: {
        userId,
      },
    });

    if (!cv || !cv.extractedCV) {
      throw new Error("CV not found or extracted data is missing");
    }

    console.log("Retrieved CV:", cv.extractedCV);

    const parsedCV = CVSchema.safeParse(cv.extractedCV);
    if (!parsedCV.success) {
      throw new Error("Extracted CV data does not match the expected format");
    }

    return parsedCV.data;
  } catch (error) {
    throw new Error(`Failed to get CV - ${error}`);
  }
}
