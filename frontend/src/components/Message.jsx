import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const Message = ({ sender, text }) => {
    const isUser = sender === 'user';
    const [copied, setCopied] = useState(false);

    // Text ko copy karne ka function (AI replies ke liye)
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`group flex gap-4 max-w-4xl mx-auto w-full mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
            
            {/* --- AVATAR SECTION --- */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ${
                isUser 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-purple-500/20' 
                : 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-cyan-500/10'
            }`}>
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* --- MESSAGE BUBBLE --- */}
            <div className={`relative p-4 rounded-2xl max-w-[85%] leading-relaxed shadow-sm transition-all duration-300 ${
                isUser 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
                
                {/* Message Content */}
                <div className="text-[15px] tracking-wide break-words">
                    {/* Simple Markdown Logic: Code Blocks ko highlight karna */}
                    {text.split('```').map((part, i) => (
                        i % 2 === 1 ? (
                            <pre key={i} className="my-3 p-3 bg-black/40 rounded-lg border border-white/10 overflow-x-auto font-mono text-sm text-cyan-300">
                                <code>{part.trim()}</code>
                            </pre>
                        ) : (
                            <span key={i} className="whitespace-pre-wrap">{part}</span>
                        )
                    ))}
                </div>

                {/* --- FOOTER TOOLS (Only for AI) --- */}
                {!isUser && (
                    <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-cyan-400 transition-colors"
                        >
                            {copied ? (
                                <><Check className="w-3 h-3"/> Copied</>
                            ) : (
                                <><Copy className="w-3 h-3"/> Copy</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;