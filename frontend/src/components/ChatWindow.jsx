import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Sparkles, Menu, Copy } from "lucide-react";

function ChatWindow({ currentSession, onSendMessage, loading, openSidebar }) {
  const [input, setInput] = useState("");
  const [expandedMessages, setExpandedMessages] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput("");
  };

  const toggleExpand = (index) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  const messagesList = currentSession?.messages || [];

  const markdownComponents = {
    p({ children }) {
      return <div className="mb-2">{children}</div>;
    },
    code({ inline, children, ...props }) {
      if (!inline) {
        return (
          <pre className="bg-black/50 border border-slate-800 rounded-xl p-3 overflow-x-auto my-2 text-sm text-emerald-400">
            <code {...props}>{children}</code>
          </pre>
        );
      }
      return (
        <code
          className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex flex-col h-full min-w-0 text-slate-100 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="glass flex items-center px-4 md:px-6 py-3 md:py-4 border-b border-slate-800 shrink-0">
        <button
          onClick={openSidebar}
          className="md:hidden mr-3 text-slate-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h2 className="ml-2 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent truncate">
          {currentSession?.title || "Gemini AI Pro"}
        </h2>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-5 space-y-5">
        {messagesList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-4">
            <div className="glass p-6 rounded-3xl">
              <Bot size={42} className="text-cyan-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to Gemini AI Pro</h1>
            <p className="text-slate-400">Ask anything to Gemini AI</p>
          </div>
        ) : (
          messagesList.map((msg, index) => {
            const text = String(msg.text || "");
            const isLong = text.length > 600;
            const showFull = expandedMessages[index];

            return (
              <div
                key={index}
                className={`flex gap-3 md:gap-4 max-w-4xl mx-auto ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center shrink-0 border ${msg.sender === "user" ? "bg-indigo-600 border-indigo-500" : "bg-slate-800 border-slate-700"}`}>
                  {msg.sender === "user" ? <User size={17} /> : <Bot size={17} className="text-cyan-400" />}
                </div>

                {/* Replaced Part */}
                <div className="glass rounded-2xl px-4 py-3 max-w-[85%] text-sm md:text-base leading-relaxed break-words">
                  <div className="relative group">
                    <div className={!showFull && isLong ? "line-clamp-6" : ""}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {text}
                      </ReactMarkdown>
                    </div>

                    {msg.sender !== "user" && (
                      <button
                        onClick={() => copyMessage(text)}
                        className="copy-btn opacity-0 group-hover:opacity-100"
                        title="Copy"
                      >
                        <Copy size={15} />
                      </button>
                    )}

                    {isLong && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="mt-2 text-cyan-400 text-xs hover:underline"
                      >
                        {showFull ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-slate-800 border border-slate-700 text-cyan-400">
              <Bot size={18} />
            </div>
            <div className="glass px-5 py-3 rounded-2xl text-sm text-slate-400">
              Gemini is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 md:p-4 border-t border-slate-800 bg-slate-950/70 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 md:gap-3 max-w-4xl mx-auto items-center"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask Gemini..."
            className="flex-1 glass rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm text-white placeholder-slate-500 outline-none border border-slate-800"
          />
          <button
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 p-3 md:p-4 rounded-2xl disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 border-t border-slate-900 bg-slate-950 shrink-0">
        <p className="text-xs text-slate-400">
          Designed & Developed by{" "}
          <span className="font-bold text-cyan-400">Akash Chaudhary</span>
        </p>
      </footer>
    </div>
  );
}

export default ChatWindow;