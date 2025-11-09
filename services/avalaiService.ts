// Fix: Use GoogleGenAI from "@google/genai" instead of OpenAI
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Fix: API key must be obtained from process.env.API_KEY as per guidelines.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // Fix: Updated error message to reflect the correct environment variable.
  throw new Error("API_KEY is missing! Check environment variables.");
}

// Fix: Initialize GoogleGenAI client as per guidelines.
// Remove AvalAI proxy and dangerouslyAllowBrowser.
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateTopicSuggestions(keywords: string): Promise<string[]> {
  const prompt = `
    کاربر کلمات کلیدی زیر را وارد کرده است:
    "${keywords}"

    لطفاً ۵ موضوع جذاب، خلاقانه و کاربردی بر اساس این کلمات کلیدی پیشنهاد دهید.
    هر موضوع باید یک جمله کامل و واضح باشد.
    فقط موضوعات را به صورت لیست شماره‌دار برگردانید، بدون توضیح اضافی.
  `;

  try {
    // Fix: Use ai.models.generateContent instead of client.chat.completions.create.
    // System instruction moved to config.
    // Contents updated to directly use the prompt string.
    // max_tokens maps to maxOutputTokens, and thinkingBudget is added for gemini-2.5-flash.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",  // ← مدل هوش مصنوعی
      contents: prompt,
      config: {
        systemInstruction: "You are an expert topic generator.",
        temperature: 0.7,
        maxOutputTokens: 300,
        // Fix: When setting maxOutputTokens for gemini-2.5-flash,
        // a thinkingBudget should also be set.
        thinkingConfig: { thinkingBudget: 100 },
      },
    });

    // Fix: Extract text directly from response.text as per guidelines.
    const text = response.text || "";
    return text
      .split("\n")
      .map(line => line.replace(/^\d+\.\s*/, "").trim())
      .filter(line => line.length > 0);
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error("خطا در ارتباط با هوش مصنوعی. لطفاً دوباره تلاش کنید.");
  }
}