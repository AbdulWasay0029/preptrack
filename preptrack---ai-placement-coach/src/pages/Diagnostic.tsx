import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Send, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '@/src/lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Question {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  leetcode_link?: string;
}

export default function Diagnostic() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const telegramId = searchParams.get('telegram_id');
  const company = searchParams.get('company') || 'general';

  const [step, setStep] = useState<'intro' | 'questions' | 'summary'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins total

  useEffect(() => {
    if (step === 'questions' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const startAssessment = async () => {
    setLoading(true);
    try {
      if (telegramId) {
        localStorage.setItem('prep_telegram_id', telegramId);
      }
      const res = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id: telegramId, company_slug: company })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setQuestions(data.questions);
      setAssessmentId(data.assessment_id);
      setStep('questions');
    } catch (err) {
      console.error(err);
      // Fallback for demo if backend isn't ready
      setQuestions([
        { id: 1, title: 'Two Sum', difficulty: 'easy', topic: 'arrays' },
        { id: 2, title: 'Valid Parentheses', difficulty: 'easy', topic: 'strings' },
        { id: 3, title: 'Reverse Linked List', difficulty: 'easy', topic: 'linked-list' }
      ]);
      setAssessmentId(999);
      setStep('questions');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const q = questions[currentIdx];
    const responseText = responses[q.id] || '';

    setEvaluating(true);
    try {
      let score = 0;
      let feedback = 'No response';

      if (responseText.trim().length >= 10) {
        const prompt = `Evaluate this DSA interview response from an Indian CS placement student.
Problem: "${q.title}" (${q.difficulty}, topic: ${q.topic})
Student response: "${responseText}"
Score on: approach correctness, complexity awareness, communication clarity.`;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
                approach_correct: { type: Type.BOOLEAN }
              },
              required: ["score", "feedback", "approach_correct"]
            }
          }
        });

        try {
          const parsed = JSON.parse(aiResponse.text || '{}');
          score = parsed.score;
          feedback = parsed.feedback;
        } catch (e) {
          score = 50;
          feedback = 'AI evaluation parsed failed.';
        }
      }

      await fetch(`/api/assessments/${assessmentId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: q.id,
          user_response: responseText,
          time_taken_seconds: 0,
          score,
          feedback
        })
      });

      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        await completeAssessment();
      }
    } catch (err) {
      console.error(err);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setStep('summary');
      }
    } finally {
      setEvaluating(false);
    }
  };

  const completeAssessment = async () => {
    try {
      await fetch(`/api/assessments/${assessmentId}/complete`, { method: 'POST' });
    } finally {
      setStep('summary');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'intro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Timer className="w-10 h-10" />
          </div>
          <h1 className="text-display mb-4">Interview Diagnostic</h1>
          <p className="text-body-lg text-on-surface-variant mb-12">
            This 20-minute assessment will evaluate your core DSA patterns and design thinking. 
            Targeting <b>{company.toUpperCase()}</b> roles.
          </p>
          <button 
            onClick={startAssessment}
            disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all text-headline-sm"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Start Assessment'}
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'questions') {
    const q = questions[currentIdx];
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-label-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
              Q{currentIdx + 1} / {questions.length}
            </span>
            <h2 className="text-headline-md">{q.topic.toUpperCase()}</h2>
          </div>
          <div className={cn("flex items-center gap-2 font-mono text-headline-sm", timeLeft < 300 ? "text-error" : "text-primary")}>
            <Timer className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <motion.div 
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface-container border border-outline-variant p-8 rounded-2xl mb-8"
        >
          <h3 className="text-display-sm mb-4">{q.title}</h3>
          <p className="text-body-md text-on-surface-variant mb-8">
            Explain your approach to solve this problem optimally. Focus on the core algorithm and time/space complexity.
          </p>
          <textarea 
            className="w-full h-64 bg-surface-container-low border border-outline-variant p-4 rounded-xl focus:outline-none focus:border-primary text-body-md"
            placeholder="Type your approach here..."
            value={responses[q.id] || ''}
            onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
          />
        </motion.div>

        <div className="flex justify-end gap-4">
          <button 
            onClick={handleNext}
            disabled={evaluating}
            className="bg-primary text-on-primary px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {evaluating ? 'Evaluating...' : (currentIdx === questions.length - 1 ? 'Finish Assessment' : 'Next Question')}
            {!evaluating && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-8" />
        <h1 className="text-display mb-4">Assessment Complete!</h1>
        <p className="text-body-lg text-on-surface-variant mb-12">
          Your responses have been evaluated by PrepTrack AI. Check your progress dashboard for the detailed breakdown.
        </p>
        <button 
          onClick={() => navigate('/progress')}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-headline-sm"
        >
          View Score Card
        </button>
      </motion.div>
    </div>
  );
}
