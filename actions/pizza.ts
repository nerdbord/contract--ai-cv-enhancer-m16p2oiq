import { generateText } from "ai";
import { openai } from "lib/openai";

export const pizzaAction = async () => {
  try {
    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: "Write a pizza recipe.",
    });
    return text;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
};
