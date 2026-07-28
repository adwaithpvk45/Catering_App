# 🤖 Feastify AI Assistant & Smart Reply Guide
*A simple guide for managing and understanding the support ticket helper.*

---

## 🌟 What does the AI Assistant do?
When a customer submits a complaint or question on Feastify, the Admin Panel now has a smart helper powered by Google Gemini AI. 

When you open a ticket, you will see a panel called **AI Support Copilot**. Clicking **"Generate AI Assistant"** does three things automatically:
1. **Reads the Message**: The AI instantly reads the customer's text.
2. **Analyzes Urgency & Sentiment**: It rates how urgent the issue is (`Low`, `Medium`, or `High`) and detects the customer's emotional tone (`Angry`, `Disappointed`, etc.).
3. **Drafts a Reply**: It automatically writes a polite, professional reply. You can edit this reply right in the text box before sending it.

When you click **"Resolve & Send AI Reply"**, it marks the ticket as resolved in the database and automatically sends your customized response to the customer's email!

---

## 🔑 How to Update your Gemini API Key in the Future
The AI needs a secret password called an **API Key** to talk to Google's systems. You get this key for free from Google.

If you ever need to replace or update the key:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click the copy icon next to your key.
3. Open your project's configuration file: [Backend/.env](file:///c:/Users/ACER/Desktop/fsd/final%20project/Catering-App/Backend/.env).
4. Look for the line that says:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
5. Delete the old key after the `=` sign, paste your new key, and save the file.
6. Restart your server.

---

## ❓ Troubleshooting
* **Error message: "AI service is currently unavailable"**: This means the server cannot read your API key or you have run out of the free quota (Google's free tier permits 15 requests per minute). Wait a minute and click Generate again.
* **Why did the AI draft look generic?**: If the Gemini API key is missing or blank, the system automatically falls back to a safe, default message template so the app does not break.
