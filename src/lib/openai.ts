import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  fetch: async (url, options) => {
    const fullUrl =
      "https://training.nerdbord.io/api/v1/openai/chat/completions";

    const apiKey = process.env.OPENAI_API_KEY;
    console.log(apiKey);

    if (!apiKey) {
      throw new Error("OpenAI API key not found");
    }

    const headers = {
      ...(options?.headers || {}),
      Authorization: `Bearer ${apiKey}`,
    };

    const result = await fetch(fullUrl, {
      ...options,
      headers,
    });

    return result;
  },
});
