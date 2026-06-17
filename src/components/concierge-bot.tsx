'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { HiddenHeart } from './guest-activities/treasure-hunt';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ConciergeBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I am your **Wedding Concierge**. I am here to help you coordinate your plans for Sanya and Anoop's wedding. What can I answer for you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const chips = [
    "When are the ceremonies?",
    "What is the dress code?",
    "Recommend nearby hotels",
    "How did they meet?"
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMessage];
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "I apologize, but I am having trouble connecting to the server. Please try asking again shortly, or review the event details on the main page!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    handleSendMessage(chipText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end">
      
      {/* Floating Trigger Bubble Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#C5A880] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#A27B5C] active:scale-[0.95] transition-all interactive"
          aria-label="Open Wedding Concierge Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22 }}
            className="w-[320px] md:w-[360px] h-[480px] bg-white border border-[#C5A880]/30 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            
            {/* Chat Header */}
            <div className="bg-[#FAF8F3] border-b border-[#C5A880]/20 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-semibold text-zinc-800 tracking-wider flex items-center gap-1">
                    Wedding Concierge
                    <Sparkles className="w-3 h-3 text-[#C5A880] fill-current" />
                  </span>
                  <span className="text-[9px] text-[#A27B5C] font-mono tracking-widest uppercase font-bold">
                    Virtual Helper
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-100 transition-colors interactive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Feed Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#FAF8F3]/30 scrollbar-none flex flex-col gap-3">
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] text-xs text-left
                      ${isUser ? 'self-end items-end' : 'self-start items-start'}
                    `}
                  >
                    <div
                      className={`p-3 rounded-2xl leading-relaxed font-sans
                        ${isUser 
                          ? 'bg-[#C5A880] text-white rounded-tr-none' 
                          : 'bg-white border border-zinc-150 text-zinc-700 rounded-tl-none shadow-sm'
                        }
                      `}
                      style={{
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {/* Simple Markdown Bold parsing */}
                      {msg.content.split('**').map((chunk, cIdx) => 
                        cIdx % 2 === 1 ? <strong key={cIdx} className="font-bold">{chunk}</strong> : chunk
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Typing indicator */}
              {loading && (
                <div className="self-start flex flex-col max-w-[80%] text-xs items-start">
                  <div className="p-3 rounded-2xl bg-white border border-zinc-150 rounded-tl-none shadow-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Quick chips suggested queries */}
            <div className="px-4 py-2 border-t border-zinc-100 bg-white/70 overflow-x-auto scrollbar-none flex gap-2 flex-nowrap select-none">
              {chips.map((chip, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleChipClick(chip)}
                  className="flex-shrink-0 text-[10px] font-sans font-medium text-[#A27B5C] bg-[#FAF8F3] border border-[#C5A880]/30 py-1 px-2.5 rounded-full hover:bg-[#C5A880]/10 interactive transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input form field */}
            <div className="bg-[#FAF8F3] border-t border-zinc-100 p-3 flex gap-2 items-center relative">
              <input
                type="text"
                placeholder="Ask about dress codes, locations..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendMessage(input);
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 outline-none focus:border-[#C5A880] text-xs bg-white text-zinc-700"
              />
              <button
                onClick={() => handleSendMessage(input)}
                className="p-2 rounded-xl bg-[#C5A880] text-white hover:bg-[#A27B5C] transition-colors interactive"
              >
                <Send className="w-3.5 h-3.5" />
              </button>

              {/* Heart #5 hidden inside chatbot widget */}
              <div className="absolute -left-1 bottom-1">
                <HiddenHeart id="h-5" />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
