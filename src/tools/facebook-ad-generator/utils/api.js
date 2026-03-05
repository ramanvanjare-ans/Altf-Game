"use-client";
import { ResponseSchema } from "./constants";

const MODEL_NAME = "gemini-2.5-flash";
const apiKey = "AIzaSyAJ49Pjefb6hGWKDSNFQMrmKtTy8ffhQOE";

const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

export const fetchAdCopy = async (productDetails, selectedTone) => {
  const systemPrompt = `
You are a world-class Facebook ad copywriter.
Follow the JSON schema strictly.
Produce:
- primaryText
- headlines (exactly 3 short headlines)
`;

  const userQuery = `
Product Details: ${productDetails}
Desired Tone: ${selectedTone}
Generate output now.
`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt + "\n" + userQuery }],
      },
    ],

    generationConfig: {
      temperature: 0.9,
      response_mime_type: "application/json",
      response_schema: ResponseSchema,
    },
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log("API RESPONSE >>>", result);

  // If error — show full error
  if (result.error) {
    console.error("GEMINI ERROR >>>", result.error);
    throw new Error(result.error.message || "Gemini API error");
  }

  // Extract JSON string
  const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!jsonText) {
    throw new Error("Empty response from model.");
  }

  return JSON.parse(jsonText);
};
