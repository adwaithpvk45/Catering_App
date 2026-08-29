import React, { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Pizza, 
  Clock, 
  HelpCircle,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import appConfig from "../../api/common/appConfig";
import { motion, AnimatePresence } from "framer-motion";

const CustomerChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your Feastify Copilot. Ask me about wedding, birthday, or graduation party packages, check menu items, or get a custom caterer recommendation! How can I help you plan today?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick Action Prompts
  const quickActions = [
    { label: "Recommend Wedding caterers", query: "Can you recommend some caterers who offer Wedding packages?" },
    { label: "Check dessert menu", query: "What kind of desserts or sweet menu items do you have available?" },
    { label: "How do bookings work?", query: "How can I book a catering service on Feastify?" }
  ];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Append user message
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputText("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${appConfig.baseURL}/api/ai/chat`,
        { messages: newMessages },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${appConfig.token}`
          }
        }
      );

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.reply }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Oops! I encountered an error drafting my reply. Please try again." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I am offline. Please verify that the backend server is running and has your GROQ_API_KEY configured." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (content, isUser) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      let processedLine = line;
      
      const isListItem = processedLine.trim().startsWith("* ") || processedLine.trim().startsWith("- ");
      if (isListItem) {
        processedLine = processedLine.replace(/^[\s]*[\*\-]\s/, "");
      }
      
      const parts = processedLine.split(/\*\*([^*]+)\*\*/g);
      const parsedText = parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <strong 
              key={i} 
              className={`font-black ${isUser ? "text-white underline decoration-white/30" : "text-[#FF7D44]"}`}
            >
              {part}
            </strong>
          );
        }
        return part;
      });

      if (isListItem) {
        return (
          <li key={idx} className="list-disc ml-4 mt-1">
            {parsedText}
          </li>
        );
      }
      
      return (
        <p key={idx} className="mt-1">
          {parsedText}
        </p>
      );
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-outfit select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-96 max-w-[calc(100vw-2rem)] h-[540px] rounded-[2rem] border border-base-content/10 shadow-2xl bg-base-100/90 backdrop-blur-xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#FF7D44] to-[#ff976a] text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center border border-white/25">
                  <Sparkles className="size-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-tight leading-none">Feastify Assistant</h4>
                  <span className="text-[10px] font-bold opacity-80 flex items-center gap-1 mt-1">
                    <span className="size-1.5 rounded-full bg-success animate-ping" />
                    Powered by Qwen on Groq
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-base-200/30">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-[#FF7D44] text-white rounded-br-none"
                        : "bg-base-100 border border-base-content/5 text-base-content/90 rounded-bl-none"
                    }`}
                  >
                    {/* Render parsed list items & bold nodes */}
                    <div className="space-y-1">
                      {renderMessageContent(msg.content, msg.role === "user")}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Loader */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-base-100 border border-base-content/5 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                    <span className="size-2 bg-[#FF7D44] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-2 bg-[#FF7D44] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-2 bg-[#FF7D44] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Panel */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-base-200/50 border-t border-base-content/5 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-40">Suggestions</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action.query)}
                      className="px-2.5 py-1.5 rounded-xl bg-base-100 hover:bg-[#FF7D44] hover:text-white border border-base-content/10 hover:border-transparent text-[10px] font-black tracking-tight transition-all duration-200 cursor-pointer"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Input */}
            <div className="p-3 bg-base-100 border-t border-base-content/10 flex items-center gap-2">
              <textarea
                rows={1}
                placeholder="Ask about caterers, menus, or pricing..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-grow bg-base-200 py-2.5 px-4 rounded-xl outline-none resize-none font-semibold text-xs border border-transparent focus:border-[#FF7D44]/30 max-h-16"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#FF7D44] disabled:opacity-40 text-white shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
              >
                <Send className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="size-14 rounded-full bg-gradient-to-tr from-[#FF7D44] to-[#ff976a] hover:from-[#ff6b2a] hover:to-[#ff8d58] text-white flex items-center justify-center shadow-xl shadow-orange-500/20 cursor-pointer border border-white/10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="size-6" />
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-success border-2 border-[#FF7D44]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default CustomerChatbot;
