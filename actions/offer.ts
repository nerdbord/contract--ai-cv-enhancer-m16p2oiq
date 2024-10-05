import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "../src/lib/openai";

const JobDescriptionSchema = z.object({
  title: z.string(),
  location: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  company: z.string().optional(),
  salary: z.string().optional(),
});

export async function jobDescriptionToJSON(url: string) {
  try {
    // Korzystanie z OpenAI do analizy URL i wydobycia danych oferty pracy
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: JobDescriptionSchema,
      prompt: `You are given a URL: ${url}. Please attempt to extract relevant job offer information such as the title, location, company name, responsibilities, requirements, and salary information if available. If you cannot access the URL directly, provide an estimated set of details based on typical job postings from this domain.`,
    });

    console.log("Extracted job description:", result.object);
    return result.object;
  } catch (error) {
    console.error("Error extracting job description:", error);
    throw new Error("Extracting job description failed.");
  }
}
