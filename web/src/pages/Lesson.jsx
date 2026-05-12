import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Terminal, Sparkles, User, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function Lesson() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Initial greeting
    const greet = async () => {
      setIsTyping(true);
      setMessages([
        { 
          role: 'assistant', 
          content: `Hi! I'm your coach for the "${id?.replace('-', ' ')}" module. What would you like to dive into first? Or shall we start with a concept review?`, 
          timestamp: new Date() 
        }
      ]);
      setIsTyping(false);
    };
    greet();
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: newMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are PrepTrack AI, a world-class technical interview coach. You help developers master coding and system design. Be encouraging, precise, and use code examples where helpful. When a user asks about a specific topic, explain it clearly and then ask a follow-up test question."
        }
      });
      
      const assistantMessage = { 
        role: 'assistant', 
        content: response.text || "I couldn't generate a response.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered a glitch. Please make sure your API key is configured correctly.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="lesson-page" className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/curriculum" className="p-2 hover:bg-surface-container rounded-lg">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-headline-md capitalize">{id?.replace('-', ' ')}</h1>
          <div className="flex items-center gap-2 text-label-md text-primary">
            <ShieldCheck className="w-4 h-4" />
            AI TUTOR ACTIVE
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 scrollbar-thin">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex items-start gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-primary"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-body-md shadow-sm",
              msg.role === 'user' 
                ? "bg-primary-container text-on-primary-container rounded-tr-none" 
                : "bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/30"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-on-surface-variant text-label-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Coach is thinking...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="relative group">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about time complexity, implementation details..."
          className="w-full bg-surface-container-low border border-outline-variant p-4 pr-16 rounded-xl focus:outline-none focus:border-primary transition-all text-body-md"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-primary/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
