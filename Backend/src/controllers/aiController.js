import Groq from "groq-sdk";
import Vendor from "../models/vendorModel.js";
import Service from "../models/serviceModel.js";
import Food from "../models/foodModel.js";

export const chatWithAssistant = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Invalid messages format." });
    }

    // 1. Initialize Groq client
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        reply: "Hi! Feastify AI assistant is running in demo mode. Please verify that GROQ_API_KEY is configured in your .env file."
      });
    }
    const groq = new Groq({ apiKey });

    // 2. Fetch live data context from MongoDB
    const vendors = await Vendor.find({ status: "active" }).select("name email description location");
    const services = await Service.find({ status: "Available" }).populate("vendor", "name");
    const foods = await Food.find({ status: "Available" }).populate("vendor", "name");

    // 3. Format context text blocks safely
    const vendorsText = vendors.map(v => 
      `- Caterer: "${v.name}", Location: "${v.location || 'All areas'}", Description: "${v.description || 'Premium Caterer'}"`
    ).join("\n");

    const servicesText = services.map(s => {
      const vName = s.vendor?.name || "Feastify Partner";
      return `- Package: "${s.name}" (${s.category}) by "${vName}" at Rs. ${s.price}/plate (Duration: ${s.duration || 'N/A'})`;
    }).join("\n");

    const foodsText = foods.map(f => {
      const vName = Array.isArray(f.vendor) 
        ? f.vendor.map(v => v.name).join(", ") 
        : (f.vendor?.name || "Feastify Partner");
      return `- Dish: "${f.name}" (${f.category}) offered by "${vName}" at Rs. ${f.price}. Description: "${f.description || ''}"`;
    }).join("\n");

    const systemPrompt = `
      You are the official Feastify AI Event Assistant, an expert, polite, and premium event planning copilot for the Feastify Catering platform.
      
      Here is the live, active context of caterers, services, and menu items currently available on Feastify:
      
      ### Registered Caterers & Brands:
      ${vendorsText || "No active vendors registered."}
      
      ### Catering Services (Price is per head/plate):
      ${servicesText || "No active services configured."}
      
      ### Menu Items / Dishes:
      ${foodsText || "No menu items registered."}
      
      ### Guidelines for your answers:
      1. Provide helpful catering recommendations based on the user's details (e.g. event category like Wedding or Birthday, guest counts, and dishes).
      2. If matching caterers, services, or dishes exist in the context, name them clearly and specify the price.
      3. If a customer asks for a recommendation but hasn't specified guest counts or event types, ask polite follow-up questions.
      4. If the user asks about something outside catering (e.g. weather, general coding, sports), politely redirect them back to Feastify catering assistance.
      5. Keep responses concise, well-formatted using markdown bullets, and professional.
      
      Do NOT make up any caterers, dishes, or prices that are not listed in the context above. If no matching caterer exists, recommend general options or invite them to check back soon.
    `;

    // 4. Map conversational messages to Groq format
    // Groq message roles are "system", "user", "assistant"
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }))
    ];

    // 5. Call Groq Completion
    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
    });

    const replyText = chatCompletion.choices[0]?.message?.content || "I couldn't formulate a response. Please try again.";

    res.status(200).json({
      success: true,
      reply: replyText
    });
  } catch (error) {
    console.error("Groq AI chatbot error:", error);
    res.status(500).json({ success: false, message: "AI assistant encountered an error." });
  }
};
