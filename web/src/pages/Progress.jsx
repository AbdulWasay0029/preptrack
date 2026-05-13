import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { TrendingUp, Award, Clock, Star, ChevronRight, BarChart3, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import api from '../api/client';

export default function Progress() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/assessment/latest')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error('Fetch Latest Error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-on-surface-variant">Fetching your latest progress...</p>
      </div>
    );
  }

  if (!data?.assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-8 border border-outline-variant">
            <BarChart3 className="w-12 h-12 text-on-surface-variant" />
          </div>
          <h1 className="text-display-sm mb-4">No Data Points Yet</h1>
          <p className="text-body-lg text-on-surface-variant mb-12 max-w-lg mx-auto">
            We haven't tracked any assessments for this account. Start a diagnostic to see your company-readiness score.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/diagnostic" 
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-headline-sm hover:scale-105 transition-all"
            >
              Start Web Diagnostic
            </Link>
            <Link 
              to="/dashboard" 
              className="bg-surface-container border border-outline-variant px-8 py-4 rounded-xl font-bold text-headline-sm hover:bg-surface-container-high transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const { assessment, responses } = data;

  return (
    <div className="max-w-5xl mx-auto px-page_padding py-10">
      <div className="mb-12">
        <h1 className="text-display mb-2">Progress Dashboard</h1>
        <p className="text-body-lg text-on-surface-variant">Your readiness score for {assessment.company_name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl flex flex-col items-center justify-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-2">Overall Score</p>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - assessment.overall_score / 100)}`} />
            </svg>
            <span className="absolute text-headline-md font-bold">{assessment.overall_score}</span>
          </div>
        </div>
        {[
          { label: 'DSA Mastery', value: '72%', color: 'text-primary' },
          { label: 'Time Env.', value: '14m avg', color: 'text-tertiary' },
          { label: 'Rank', value: 'Top 15%', color: 'text-primary-container' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
            <p className="text-label-md text-on-surface-variant uppercase mb-4">{stat.label}</p>
            <p className={cn("text-display-sm", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-headline-lg mb-8">Question Breakdown</h2>
      <div className="space-y-4">
        {responses.map((resp, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-headline-sm">{resp.question_title}</h3>
                <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded font-bold text-on-surface-variant border border-outline-variant uppercase">
                  {resp.difficulty || 'Medium'}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant italic">"{resp.ai_feedback}"</p>
            </div>
            <div className="flex items-center gap-8 shrink-0">
              <div className="text-center">
                <p className="text-label-md text-on-surface-variant uppercase">Score</p>
                <p className={cn("text-headline-sm font-bold", resp.ai_score > 70 ? "text-primary" : "text-error")}>
                  {resp.ai_score}/100
                </p>
              </div>
              <div className="text-center">
                <p className="text-label-md text-on-surface-variant uppercase">Time</p>
                <p className="text-headline-sm font-bold">
                  {Math.floor(resp.time_taken_seconds / 60)}m
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
