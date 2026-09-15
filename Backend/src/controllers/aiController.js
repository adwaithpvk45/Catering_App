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

export const chatStreamWithAssistant = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Invalid messages format." });
    }

    // Set Server-Sent Events (SSE) Response Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      res.write(`data: ${JSON.stringify({ text: "Hi! Feastify AI assistant is running in demo mode. Please verify that GROQ_API_KEY is configured in your Backend/.env file." })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    const groq = new Groq({ apiKey });

    // 1. Fetch compact live data context from MongoDB
    const vendors = await Vendor.find({ status: "active" }).select("name location description");
    const services = await Service.find({ status: "Available" }).populate("vendor", "name").select("name category price duration vendor");
    const foods = await Food.find({ status: "Available" }).populate("vendor", "name").select("name category price description vendor");

    const vendorsText = vendors.map(v => 
      `- Caterer: "${v.name}", Location: "${v.location || 'All areas'}"`
    ).join("\n");

    const servicesText = services.map(s => {
      const vName = s.vendor?.name || "Feastify Partner";
      return `- Package: "${s.name}" (${s.category}) by "${vName}" at Rs. ${s.price}/plate`;
    }).join("\n");

    const foodsText = foods.map(f => {
      const vName = Array.isArray(f.vendor) 
        ? f.vendor.map(v => v.name).join(", ") 
        : (f.vendor?.name || "Feastify Partner");
      return `- Dish: "${f.name}" (${f.category}) offered by "${vName}" at Rs. ${f.price}`;
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
      5. Keep responses concise, structured, and professional.
      6. Do NOT make up any caterers, dishes, or prices that are not listed in the context above.
    `;

    // 2. Token Optimization: Trim context to last 6 messages (3 turns)
    const recentMessages = messages.slice(-6);

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }))
    ];

    // 3. Call Groq Streaming Completion
    const completionStream = await groq.chat.completions.create({
      messages: groqMessages,
      model: "qwen/qwen3.8-27b",
      temperature: 0.5,
      max_tokens: 768,
      stream: true,
    });

    for await (const chunk of completionStream) {
      const deltaContent = chunk.choices[0]?.delta?.content || "";
      if (deltaContent) {
        res.write(`data: ${JSON.stringify({ text: deltaContent })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    console.error("Groq SSE Chat error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "AI Assistant SSE Error" });
    } else {
      res.write(`data: ${JSON.stringify({ text: "\n\n*[AI assistant encountered a connection issue while streaming. Please try again.]*" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
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
      2. **SWOT Highlights**: Quick strengths/weaknesses (list these as standard text or bullet points; do NOT use markdown tables or pipe character "|" syntax).
      3. **Strategic Recommendations**: Two or three concrete actions to increase booking volume and address complaints.
      
      Keep the tone executive, positive, and direct. Do NOT format any data into markdown tables or use pipe symbols "|".
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: systemPrompt }],
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
      
      Keep the report structured, friendly, and highly actionable. Do NOT use markdown tables or pipe character "|" syntax; format everything as standard lists.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: systemPrompt }],
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

export const generateBudgetPlan = async (req, res) => {
  try {
    const { totalBudget, guestCount, eventType = "Event", dietaryPreference = "Both" } = req.body;

    if (!totalBudget || !guestCount || Number(totalBudget) <= 0 || Number(guestCount) <= 0) {
      return res.status(400).json({ success: false, message: "Please provide a valid total budget and guest count." });
    }

    const budgetNum = Number(totalBudget);
    const guestsNum = Number(guestCount);
    const perHeadBudget = Math.round(budgetNum / guestsNum);

    const apiKey = process.env.GROQ_API_KEY;

    // Fetch database packages and dishes
    const vendors = await Vendor.find({ status: "active" }).select("_id name location email description");
    const services = await Service.find({ status: "Available" }).populate("vendor", "_id name location").select("_id name category price description vendor duration");
    const foods = await Food.find({ status: "Available" }).populate("vendor", "_id name").select("_id name category price description vendor");

    if (!apiKey) {
      const fallbackPlans = buildFallbackBudgetPlans(budgetNum, guestsNum, eventType, dietaryPreference, services, foods, vendors);
      return res.status(200).json({
        success: true,
        perHeadBudget,
        plans: fallbackPlans
      });
    }

    const groq = new Groq({ apiKey });

    const servicesText = services.map(s => 
      `- Package ID "${s._id}": Name: "${s.name}", Category: "${s.category}", Price: Rs. ${s.price}/plate, Caterer: "${s.vendor?.name || 'Feastify Caterer'}"`
    ).join("\n");

    const foodsText = foods.map(f => 
      `- Dish ID "${f._id}": Name: "${f.name}", Category: "${f.category}", Price: Rs. ${f.price}, Caterer: "${Array.isArray(f.vendor) ? f.vendor.map(v=>v.name).join(", ") : f.vendor?.name || 'Feastify Partner'}"`
    ).join("\n");

    const prompt = `
      You are Feastify AI's Smart Budget Planner Engine.
      A customer wants to plan a catering menu for an upcoming event. User requirements:
      - Event Type: ${eventType}
      - Total Budget: Rs. ${budgetNum}
      - Guest Count: ${guestsNum} guests
      - Target Per-Plate Limit: Rs. ${perHeadBudget}/plate
      - Dietary Preference: ${dietaryPreference}

      Here is our live database of available catering packages and dishes:
      
      ### Available Packages (Price per plate):
      ${servicesText || "No packages registered."}

      ### Available Dishes:
      ${foodsText || "No dishes registered."}

      Task: Generate exactly 3 distinct catering plan options (JSON array) matching the user's budget and preferences:
      1. "Saver Plan" (Economy Tier, per plate cost is lower than target)
      2. "Balanced Plan" (Recommended Tier, per plate cost is close to target per head budget)
      3. "Deluxe Plan" (Premium Tier, uses full available budget)

      Format your entire response as a valid JSON object strictly matching this JSON schema:
      {
        "plans": [
          {
            "tier": "Saver Plan",
            "tagline": "Economical essential feast for budget conscious events",
            "pricePerPlate": ${Math.round(perHeadBudget * 0.75)},
            "totalCost": ${Math.round(perHeadBudget * 0.75 * guestsNum)},
            "serviceId": "Service ID if matching package exists else null",
            "catererName": "Name of caterer from available list or Feastify Partner",
            "packageName": "Name of package or Custom Bundle",
            "starters": ["Crispy Paneer Tikka", "Spring Rolls"],
            "mains": ["Dal Makhani", "Butter Naan", "Veg Biryani"],
            "desserts": ["Gulab Jamun"],
            "beverages": ["Fresh Lime Soda"],
            "whyItFits": "Great value saving budget for extra decorations."
          }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "qwen/qwen3.8-27b",
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    let rawText = chatCompletion.choices[0]?.message?.content || "{}";
    let parsedData = {};
    try {
      parsedData = JSON.parse(rawText);
    } catch (e) {
      console.warn("JSON parse error from Groq response, using fallback calculation logic", e);
    }

    if (!parsedData.plans || !Array.isArray(parsedData.plans) || parsedData.plans.length === 0) {
      parsedData.plans = buildFallbackBudgetPlans(budgetNum, guestsNum, eventType, dietaryPreference, services, foods, vendors);
    }

    return res.status(200).json({
      success: true,
      perHeadBudget,
      plans: parsedData.plans
    });

  } catch (error) {
    console.error("Budget planner controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const buildFallbackBudgetPlans = (totalBudget, guestCount, eventType, preference, services = [], foods = [], vendors = []) => {
  const perHeadTarget = Math.round(totalBudget / guestCount);
  
  // Find matching service packages sorted by price
  const availableServices = [...services].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));

  const saverPrice = Math.max(150, Math.round(perHeadTarget * 0.75));
  const balancedPrice = perHeadTarget;
  const deluxePrice = Math.round(perHeadTarget * 1.15);

  const matchedSaverService = availableServices.find(s => parseFloat(s.price) <= saverPrice) || availableServices[0];
  const matchedBalancedService = availableServices.find(s => parseFloat(s.price) <= balancedPrice && parseFloat(s.price) > saverPrice) || availableServices[1] || availableServices[0];
  const matchedDeluxeService = availableServices.find(s => parseFloat(s.price) <= deluxePrice) || availableServices[availableServices.length - 1] || availableServices[0];

  return [
    {
      tier: "Saver Plan",
      tagline: "Smart & Economical — Maximum savings for essential celebrations",
      pricePerPlate: matchedSaverService ? parseFloat(matchedSaverService.price) : saverPrice,
      totalCost: (matchedSaverService ? parseFloat(matchedSaverService.price) : saverPrice) * guestCount,
      serviceId: matchedSaverService?._id || null,
      catererName: matchedSaverService?.vendor?.name || vendors[0]?.name || "Feastify Partner Caterers",
      packageName: matchedSaverService?.name || "Standard Economy Feast",
      starters: ["Crispy Veg Spring Rolls", "Hara Bhara Kebab"],
      mains: ["Dal Makhani", "Jeera Rice", "Butter Naan", "Mixed Veg Handi"],
      desserts: ["Gulab Jamun (2 pcs)"],
      beverages: ["Fresh Mint Limeade"],
      whyItFits: `Saves Rs. ${Math.max(0, totalBudget - ((matchedSaverService ? parseFloat(matchedSaverService.price) : saverPrice) * guestCount))} from your original budget while delivering a satisfying 6-item spread.`
    },
    {
      tier: "Balanced Recommended",
      tagline: "Best Value Choice — Premium taste perfectly matched to your budget limit",
      pricePerPlate: matchedBalancedService ? parseFloat(matchedBalancedService.price) : balancedPrice,
      totalCost: (matchedBalancedService ? parseFloat(matchedBalancedService.price) : balancedPrice) * guestCount,
      serviceId: matchedBalancedService?._id || null,
      catererName: matchedBalancedService?.vendor?.name || vendors[0]?.name || "Royal Gourmet Feastify",
      packageName: matchedBalancedService?.name || "Royal Celebration Buffet",
      starters: ["Paneer Malai Tikka", "Chicken 65 / Mushroom Manchurian"],
      mains: ["Shahi Paneer", "Hyderabadi Dum Biryani", "Butter Naan", "Dal Tadka"],
      desserts: ["Rasmalai", "Warm Moong Dal Halwa"],
      beverages: ["Spiced Butter Milk / Masala Mocktail"],
      whyItFits: `Fits right at Rs. ${matchedBalancedService ? parseFloat(matchedBalancedService.price) : balancedPrice}/plate, providing rich variety and top caterer rating.`
    },
    {
      tier: "Grand Deluxe Feast",
      tagline: "Ultimate Experience — Full-course luxury catering with live counters",
      pricePerPlate: matchedDeluxeService ? parseFloat(matchedDeluxeService.price) : deluxePrice,
      totalCost: (matchedDeluxeService ? parseFloat(matchedDeluxeService.price) : deluxePrice) * guestCount,
      serviceId: matchedDeluxeService?._id || null,
      catererName: matchedDeluxeService?.vendor?.name || vendors[vendors.length - 1]?.name || "Grand Master Chefs",
      packageName: matchedDeluxeService?.name || "Grand Imperial Banquet",
      starters: ["Tandoori Platter (Veg/Non-Veg)", "Dahi Puri Live Counter"],
      mains: ["Paneer Lababdar", "Mutton Rogan Josh / Kadai Mushroom", "Kashmiri Pulao", "Assorted Roti Basket"],
      desserts: ["Saffron Rasgulla", "Sizzling Brownie with Ice Cream"],
      beverages: ["Cold Coffee & Exotic Fruit Punch"],
      whyItFits: "Maximizes guests' culinary experience with live live counters and multi-cuisine spreads."
    }
  ];
};

