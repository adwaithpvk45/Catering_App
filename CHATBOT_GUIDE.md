# 🤖 Feastify AI Customer Chatbot Guide
*A guide for managing and understanding the Groq-powered customer event assistant.*

---

## 🌟 What does the AI Chatbot do?
Feastify now features an interactive **AI Event Assistant** floating in the bottom-right corner of the customer screens. It is powered by **Qwen** (model: `qwen/qwen3.8-27b`) running on the ultra-fast **Groq** processor.

When a customer clicks the bubble and types a message, the chatbot does the following:
1. **Pulls Live Context**: The backend queries MongoDB for active caterers, their locations, packages (price per plate), and menu dishes.
2. **Consults Qwen on Groq**: It sends the user's question, the live directory context, and the past conversation history to Groq.
3. **Responds Instantly**: It receives the reply (usually in <0.2 seconds) and displays it with a clean visual formatting.

---

## 🔑 How to Update your Groq API Key in the Future
If you ever need to replace or update your Groq API Key:
1. Go to the [Groq Console](https://console.groq.com/keys).
2. Click **Create API Key**, copy it, and open: [Backend/.env](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/Backend/.env).
3. Replace the key after the `=` sign on this line:
   ```env
   GROQ_API_KEY=gsk_your_new_key_here
   ```
4. Save the file and restart your backend node server.

---

## 🔄 Technical Data Flow (How it works under the hood)

```
[ Customer Browser ]
        │
        ▼ (Type message / Click suggestion)
[ CustomerChatbot.jsx ] ── Sends text & history ──► [ POST /api/ai/chat ]
                                                             │
                                                             ▼ (aiController.js)
                                                    [ Fetch MongoDB data ]
                                                             │
                                                             ▼
                                                    [ System Prompts + History ]
                                                             │
                                                             ▼
                                                    [ Groq API (Qwen) ]
                                                             │
                                                             ▼ (Response <0.2s)
[ Renders response bubble ] ◄── Sends text reply ─── [ Sends JSON response ]
```

### 1. The Frontend Trigger
In [CustomerChatbot.jsx](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/frontend/src/Components/Common/CustomerChatbot.jsx), when a message is submitted, it posts the conversation array to our route:
```javascript
const response = await axios.post(`${appConfig.baseURL}/api/ai/chat`, { messages });
```

### 2. The Backend Controller
In [aiController.js](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/Backend/src/controllers/aiController.js), we fetch active vendors, services, and dishes, formatting them into clear markdown bullets. We then construct the Qwen chat instruction payload:
```javascript
const chatCompletion = await groq.chat.completions.create({
  messages: [
    { role: "system", content: systemPromptWithDBContext },
    ...messages
  ],
  model: "qwen/qwen3.8-27b",
});
```

---

## ❓ Troubleshooting
* **Error message: "AI assistant is currently offline"**: 
  * Make sure your backend node server is running.
  * Check that `GROQ_API_KEY` exists inside [Backend/.env](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/Backend/.env) and starts with `gsk_`.
* **The bot doesn't know about a new caterer**:
  * Ensure the vendor account is **Approved** by the Admin and the vendor's status is set to **Active**.
  * Ensure their services are marked as **Available**. The AI only queries active and available data to avoid proposing outdated options!
