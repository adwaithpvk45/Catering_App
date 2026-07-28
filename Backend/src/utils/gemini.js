import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getTicketAnalysis = async (subject, message) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined in .env. Returning mock response.");
      return getMockResponse(subject);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are an expert customer support manager for Feastify, a premium catering & event service platform.
      Analyze the following customer support ticket/complaint:
      
      Subject: "${subject}"
      Customer Message: "${message}"
      
      Provide a JSON object containing exactly the following keys:
      - "summary": A concise, 1-sentence summary of the customer's core complaint or question.
      - "urgency": A string indicating the severity. Must be one of: "Low", "Medium", "High".
      - "sentiment": A string indicating the customer's tone. Must be one of: "Angry", "Disappointed", "Neutral", "Curious".
      - "draftReply": A professionally written, polite, and highly helpful response draft addressing the customer's concerns. Apologize if they are reporting a late delivery, food issue, or poor service, and reassure them that the team is actively investigating this with the vendor to provide a resolution.
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Gemini API generation error:", error);
    return getMockResponse(subject);
  }
};

const getMockResponse = (subject) => {
  return {
    summary: `Customer filed a support request regarding "${subject}".`,
    urgency: "Medium",
    sentiment: "Neutral",
    draftReply: `Dear Customer,\n\nThank you for reaching out to Feastify Support. We have received your ticket regarding "${subject}". Our team is looking into this issue and will follow up with you shortly.\n\nWarm regards,\nFeastify Support Team`
  };
};
