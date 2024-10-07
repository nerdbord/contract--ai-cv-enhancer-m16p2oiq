import { openai } from "../lib/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const CVSchema = z.object({
  name: z.string(),
  profession: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    portfolio: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
  bio: z.string().optional(),
  soft_skills: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  native_language: z.string().optional(),
  languages: z.array(z.string()).optional(),
  experience: z.array(
    z
      .object({
        company: z.string(),
        position: z.string(),
        duration: z.string(),
        description: z.string(),
      })
      .optional()
  ),
  education: z.array(
    z
      .object({
        institution: z.string(),
        degree: z.string(),
        duration: z.string(),
      })
      .optional()
  ),
  projects: z
    .array(
      z
        .object({
          url: z.string(),
          description: z.string(),
          technologies: z.array(z.string()),
        })
        .optional()
    )
    .optional(),
});

export const cvToJSON = async (buffer: Buffer) => {
  try {
    const text = buffer.toString();
    const prompt = `
      Analyze and extract data from the CV provided below. Use the CVSchema to extract the information.
      If there are fields in the CV that do not match the schema, add them as additional fields.
      CV:
      ${text}
    `;

    const result = await generateObject({
      model: openai("gpt-4"),
      schema: CVSchema,
      prompt: prompt,
    });

    console.log("Extracted text:", result.object);
    return result.object;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error("Extracting text from CV failed.");
  }
};
