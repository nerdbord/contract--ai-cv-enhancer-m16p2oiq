// app/utils/openai.js
import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  fetch: async (url, options) => {
    const fullUrl =
      "https://training.nerdbord.io/api/v1/openai/chat/completions";
    console.log(`Fetching ${fullUrl}`);
    const result = await fetch(fullUrl, options);
    console.log(`Fetched ${fullUrl}`);
    return result;
  },
});
