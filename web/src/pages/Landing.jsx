import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Terminal, Send, Code, BarChart3, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Landing() {
  const navigate = useNavigate();
  const [telegramId] = useState(localStorage.getItem('prep_telegram_id'));
  const TELEGRAM_BOT_URL = `https://t.me/PrepTrackBot?start=${telegramId ? 'dashboard' : 'assess'}`;
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch('/api/questions/companies')
      .then(res => res.json())
      .then(data => setCompanies(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch companies:', err));
  }, []);

  return (
    <div id="landing-page" className="min-h-screen bg-background text-on-surface">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-page_padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-label-bold">AI-DRIVEN PLACEMENT COACH</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-display sm:text-[4.5rem] leading-[1.1] font-bold tracking-tight"
            >
              Stop grinding randomly. <br />
              <span className="text-primary italic">Fix your weaknesses.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-headline-sm text-on-surface-variant max-w-xl leading-relaxed"
            >
              PrepTrack analyzes your DSA patterns, predicts company-specific questions, and coaches you in real-time. Tailored prep delivered straight to Telegram.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              {telegramId ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  <BarChart3 className="w-5 h-5" />
                  GO TO DASHBOARD
                </button>
              ) : (
                <a 
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                  START FREE ON TELEGRAM
                </a>
              )}
              <Link 
                to="/curriculum" 
                className="bg-surface-container border border-outline-variant text-on-surface px-8 py-4 rounded-xl font-bold hover:bg-surface-container-high transition-all"
              >
                BROWSE PATHS
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="bg-surface-container border border-outline-variant p-6 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-4">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono tracking-widest text-on-surface-variant">DIAGNOSTIC_ANALYSIS.PY</span>
              </div>
              <div className="font-mono text-sm space-y-2 text-primary">
                <p>class AdaptivePrep:</p>
                <p className="ml-4">def analyze_performance(userData):</p>
                <p className="ml-8 text-on-surface-variant"># Detected gap in Sliding Window</p>
                <p className="ml-8 text-on-surface-variant"># Recommended: LC#3, LC#76</p>
                <p className="ml-8">if userData.accuracy {'<'} 0.7:</p>
                <p className="ml-12">return Curriculum.Foundations()</p>
                <p className="ml-4 cursor-blink">|</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Companies Bar */}
      <section className="bg-surface-container-low border-y border-outline-variant py-10 px-page_padding">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
          {(companies.length > 0 ? companies : [{name:'Amazon'},{name:'Microsoft'},{name:'Google'},{name:'Meta'}]).slice(0, 5).map((c, i) => (
            <span key={i} className="text-headline-sm font-bold tracking-tighter uppercase">{c.name}</span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-page_padding max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-display-sm mb-4">Precision Placement Prep</h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Everything you need to go from "coding" to "interview ready".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Send, 
              title: 'Telegram Daily Feed', 
              desc: 'Get curated problems delivered to your morning routine. No more scrolling through 3000 problems.',
              color: 'bg-blue-500/10 text-blue-500'
            },
            { 
              icon: BarChart3, 
              title: 'Weak Spot Detection', 
              desc: 'Our AI analyzes every response to identify exactly which DSA patterns you keep failing at.',
              color: 'bg-primary/10 text-primary'
            },
            { 
              icon: Sparkles, 
              title: 'AI Video Mock', 
              desc: 'Practice behavioral and technical rounds with an AI interviewer that provides instant feedback.',
              color: 'bg-secondary/10 text-secondary'
            }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-surface-container border border-outline-variant hover:border-primary/50 transition-all group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", f.color)}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-headline-sm mb-3">{f.title}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-page_padding">
        <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center text-on-primary relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
          <h2 className="text-display-sm md:text-display font-bold mb-8 relative z-10">Ready to beat the odds?</h2>
          <p className="text-headline-sm opacity-90 mb-12 max-w-xl mx-auto relative z-10">
            Join 2,000+ students landing jobs at MAANG and top startups. Start your diagnostic now.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={TELEGRAM_BOT_URL}
              className="bg-on-primary text-primary px-10 py-5 rounded-2xl font-bold text-headline-sm hover:scale-105 transition-all shadow-2xl"
            >
              Open Telegram Bot
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
