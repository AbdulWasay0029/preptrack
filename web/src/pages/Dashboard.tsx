import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Star, ChevronRight, TrendingUp, Award, Clock, Link as LinkIcon, Send } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [telegramId, setTelegramId] = useState<string | null>(localStorage.getItem('prep_telegram_id'));
  const [latestAssessment, setLatestAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryId = searchParams.get('telegram_id');
    if (queryId) {
      setTelegramId(queryId);
      localStorage.setItem('prep_telegram_id', queryId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (telegramId) {
      setLoading(true);
      fetch(`/api/assessments/${telegramId}/latest`)
        .then(res => res.json())
        .then(data => {
          if (data.assessment) setLatestAssessment(data);
        })
        .finally(() => setLoading(false));
    }
  }, [telegramId]);

  return (
    <div id="dashboard-page" className="max-w-7xl mx-auto px-page_padding py-10">
      {/* Telegram Link Banner */}
      {!telegramId && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mb-8 bg-primary/10 border border-primary/30 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <LinkIcon className="text-primary" />
            <p className="text-body-sm">Link your Telegram account to sync your progress and daily questions.</p>
          </div>
          <a 
            href="https://t.me/PrepTrackBot?start=link" 
            target="_blank" 
            rel="noreferrer"
            className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-label-bold flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> BOT
          </a>
        </motion.div>
      )}

      {/* Latest Performance Section */}
      {latestAssessment && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-surface-container border border-outline-variant p-6 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30">
              <span className="text-headline-sm font-bold text-primary">{latestAssessment.assessment.overall_score}%</span>
            </div>
            <div>
              <h3 className="text-headline-sm">Latest Assessment: {latestAssessment.assessment.company_name}</h3>
              <p className="text-body-md text-on-surface-variant">Completed on {new Date(latestAssessment.assessment.completed_at).toLocaleDateString()}</p>
            </div>
          </div>
          <Link to="/progress" className="bg-surface-container-high px-4 py-2 rounded-lg text-label-bold hover:bg-primary/20 transition-all">
            VIEW FULL SCORECARD
          </Link>
        </motion.section>
      )}

      {/* Hero Section */}
      <section className="mb-16 relative overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-label-bold text-primary tracking-widest uppercase mb-4 block">Welcome back, Developer</span>
            <h1 className="text-display mb-6">Master the Art of the Technical Interview</h1>
            <p className="text-body-lg text-on-surface-variant mb-8">
              AI-powered paths tailored to your goals. From dynamic programming to distributed systems design.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/curriculum">
                <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                  <Play className="w-5 h-5 fill-current" />
                  Continue Learning
                </button>
              </Link>
              <Link to="/mock">
                <button className="bg-surface-container-high text-on-surface border border-outline-variant px-8 py-3 rounded-lg font-bold hover:bg-surface-container-highest transition-all">
                  Mock Interview
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Background Visuals */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-primary blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: 'Current Streak', value: '12 Days', icon: TrendingUp, color: 'text-primary' },
          { label: 'Modules Ready', value: '8/24', icon: Award, color: 'text-tertiary' },
          { label: 'Interview Score', value: '840', icon: Star, color: 'text-primary-container' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container border border-outline-variant p-6 rounded-xl flex items-center gap-4"
          >
            <div className={cn("p-3 rounded-lg bg-surface-container-high", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant uppercase">{stat.label}</p>
              <p className="text-headline-sm">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suggested Next Steps */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-headline-lg">Continue Path</h2>
          <Link to="/curriculum" className="text-primary text-label-bold flex items-center hover:underline">
            VIEW FULL CURRICULUM <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 1, title: 'Dynamic Programming II', type: 'Concepts', time: '15 min', difficulty: 'hard' },
            { id: 2, title: 'B-Trees & Indexing', type: 'Database', time: '20 min', difficulty: 'medium' },
            { id: 3, title: 'React Performance', type: 'Frontend', time: '12 min', difficulty: 'medium' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-surface-container-low border border-outline-variant p-6 rounded-xl group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-label-md text-primary bg-primary/10 px-2 py-1 rounded">{item.type}</span>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant border border-outline-variant px-2 py-0.5 rounded">{item.difficulty}</span>
              </div>
              <h3 className="text-headline-sm mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
              <div className="flex items-center gap-4 text-on-surface-variant text-body-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {item.time}
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  +50 XP
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Helper to use cn in pages if needed
import { cn } from '@/src/lib/utils';
