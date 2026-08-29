import Groq from "groq-sdk";
import Vendor from "../models/vendorModel.js";
import Service from "../models/serviceModel.js";
import Food from "../models/foodModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import Complaint from "../models/complaintModel.js";

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
      3. For recommendations, group details logically. Put each caterer/package name as a header (e.g., "### 1. Caterer Name - Package Name" or "**Caterer Name - Package Name**"). 
      4. Place specific properties (like Total Cost, Duration, Best For) as indented sub-bullets under that caterer's header using two spaces:
         "  - **Total Cost:** Rs. X"
         "  - **Best For:** Small gatherings"
         Do NOT display everything in a flat, single-level list of dots.
      5. If a customer asks for a recommendation but hasn't specified guest counts or event types, ask polite follow-up questions.
      6. If the user asks about something outside catering (e.g. weather, general coding, sports), politely redirect them back to Feastify catering assistance.
      7. Keep responses concise, well-formatted, and professional.
      
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
      model: "qwen/qwen3.8-27b",
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

export const getAdminInsights = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        insights: "### Demo Mode Insights\nFeastify is running smoothly! Set up a valid GROQ_API_KEY to see dynamic insights."
      });
    }
    const groq = new Groq({ apiKey });

    // Fetch database statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendors = await Vendor.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalComplaints = await Complaint.countDocuments({ status: 'Pending' });

    const bookings = await Booking.find();
    const categoryMap = {};
    bookings.forEach(b => {
      const cat = b.category || "Others";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const systemPrompt = `
      You are a senior business analyst and consultant for Feastify, a premium catering marketplace.
      Analyze the following live platform-wide metrics:
      - Total Registered Customers: ${totalUsers}
      - Total Registered Caterers/Vendors: ${totalVendors}
      - Total Bookings Placed: ${totalBookings}
      - Pending Support Complaints: ${totalComplaints}
      - Booking Categories: ${JSON.stringify(categoryMap)}
      
      Generate a concise, professional Business Performance Report in markdown. Include:
      1. **Overview & Health Check**: A brief analysis of customer-to-vendor ratios and overall platform traction.
      2. **SWOT Highlights**: Quick strengths/weaknesses.
      3. **Strategic Recommendations**: Two or three concrete actions to increase booking volume and address complaints.
      
      Keep the tone executive, positive, and direct. Do not mention dummy placeholders.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "qwen/qwen3.8-27b",
      temperature: 0.6,
      max_tokens: 1024,
    });

    res.status(200).json({
      success: true,
      insights: chatCompletion.choices[0]?.message?.content || "No insights could be generated."
    });
  } catch (error) {
    console.error("Admin insights error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorInsights = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        insights: "### Demo Insights\nCaterer dashboard is performing well! Setup a GROQ_API_KEY to see your custom growth report."
      });
    }
    const groq = new Groq({ apiKey });

    // Fetch vendor specific metrics
    const bookings = await Booking.find({ vendor: vendorId });
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === "Pending").length;
    const acceptedBookings = bookings.filter(b => b.status === "Accepted").length;
    const cancelledBookings = bookings.filter(b => b.status === "Cancelled").length;
    const totalServices = await Service.countDocuments({ vendor: vendorId });

    let totalRevenue = 0;
    bookings.forEach(b => {
      if (b.status === "Accepted" && b.price) {
        const numericPrice = parseFloat(b.price.replace(/[^\d.]/g, ''));
        if (!isNaN(numericPrice)) {
          totalRevenue += numericPrice;
        }
      }
    });

    const systemPrompt = `
      You are a senior growth marketing consultant for a catering vendor registered on Feastify.
      Analyze this vendor's live performance stats:
      - Total Bookings Received: ${totalBookings}
      - Accepted Bookings: ${acceptedBookings}
      - Pending Bookings (Awaiting confirmation): ${pendingBookings}
      - Cancelled Bookings: ${cancelledBookings}
      - Total Services Offered: ${totalServices}
      - Estimated Earned Revenue: Rs. ${totalRevenue}
      
      Generate a customized, encouraging Performance Insight Report in markdown. Include:
      1. **Performance Rating**: A brief summary of their booking acceptance vs cancellation rate.
      2. **Revenue & Pricing Insights**: Suggest pricing adjustments or packaging strategies (e.g. upselling drinks/desserts).
      3. **Growth Action Items**: Two specific tips to optimize their catering profile or dishes to drive more sales.
      
      Keep the report structured, friendly, and highly actionable.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "qwen/qwen3.8-27b",
      temperature: 0.6,
      max_tokens: 1024,
    });

    res.status(200).json({
      success: true,
      insights: chatCompletion.choices[0]?.message?.content || "No insights could be generated."
    });
  } catch (error) {
    console.error("Vendor insights error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
