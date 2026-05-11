import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Lock, Play, Search, Filter, Loader2 } from 'lucide-react';
import DifficultyBadge from '@/src/components/DifficultyBadge';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

export default function Curriculum() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [telegramId] = useState(localStorage.getItem('prep_telegram_id'));
  const [latestAssessment, setLatestAssessment] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tRes = await fetch('/api/questions/topics');
        const tData = await tRes.json();
        setTopics(tData);

        if (telegramId) {
          const aRes = await fetch(`/api/assessments/${telegramId}/latest`);
          const aData = await aRes.json();
          if (aData.assessment) setLatestAssessment(aData);
        }
      } catch (err) {
        console.error('Failed to fetch curriculum:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [telegramId]);

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group into modules (mock logic)
  const modules = [
    { title: 'Foundations', topics: filteredTopics.slice(0, 3) },
    { title: 'Advanced Data Structures', topics: filteredTopics.slice(3, 6) },
    { title: 'Algorithms & Optimization', topics: filteredTopics.slice(6) },
  ].filter(m => m.topics.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div id="curriculum-page" className="max-w-5xl mx-auto px-page_padding py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-display">Curriculum</h1>
          <p className="text-body-lg text-on-surface-variant">Step-by-step mastery paths.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container border border-outline-variant pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-primary transition-all text-body-sm w-full md:w-64"
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {modules.map((module, mIdx) => (
          <section key={mIdx}>
            <h3 className="text-headline-md mb-6">{module.title}</h3>
            <div className="grid gap-4">
              {module.topics.map((topic) => {
                const isRecommended = latestAssessment?.responses?.some((r: any) => 
                  r.question_title.toLowerCase().includes(topic.name.toLowerCase()) || 
                  topic.name.toLowerCase().includes(r.question_title.toLowerCase())
                );

                return (
                  <Link 
                    key={topic.id} 
                    to={`/lesson/${topic.slug}`}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-xl border transition-all bg-surface-container-low border-outline-variant hover:border-primary hover:bg-surface-container",
                      isRecommended && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-body-lg font-medium">{topic.name}</h4>
                          {isRecommended && (
                            <span className="text-[10px] font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded leading-none">RECOMMENDED</span>
                          )}
                        </div>
                        <DifficultyBadge difficulty="medium" className="mt-1" />
                      </div>
                    </div>
                    
                    <div className="text-on-surface-variant">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
