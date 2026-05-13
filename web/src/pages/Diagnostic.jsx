import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Timer, Send, ChevronRight, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/client';

export default function Diagnostic() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const company = searchParams.get('company') || 'general';

  const [step, setStep] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins total
  const [timeSpent, setTimeSpent] = useState({}); // Track time spent per question

  useEffect(() => {
    if (step === 'questions' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
        setTimeSpent(prev => ({
          ...prev,
          [currentIdx]: (prev[currentIdx] || 0) + 1
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft, currentIdx]);

  const startAssessment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/assessment/start', { 
        companySlug: company 
      });
      
      setQuestions(res.data.questions);
      setAssessmentId(res.data.assessmentId);
      setStep('questions');
    } catch (err) {
      console.error(err);
      // Fallback for demo if backend isn't ready
      setQuestions([
        { id: 1, title: 'Two Sum', difficulty: 'easy', topic: 'arrays' },
        { id: 2, title: 'Valid Parentheses', difficulty: 'easy', topic: 'strings' },
        { id: 3, title: 'Reverse Linked List', difficulty: 'easy', topic: 'linked-list' },
        { id: 4, title: 'Merge Intervals', difficulty: 'medium', topic: 'arrays' },
        { id: 5, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', topic: 'strings' }
      ]);
      setAssessmentId(999);
      setStep('questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    const q = questions[currentIdx];
    const responseText = responses[currentIdx] || '';
    const seconds = timeSpent[currentIdx] || 0;

    setSubmitting(true);
    try {
      await api.post(`/assessment/${assessmentId}/submit-answer`, {
        questionId: q.id,
        response: responseText,
        timeSpentSeconds: seconds
      });
      
      alert('Answer submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const completeAssessment = async () => {
    setLoading(true);
    try {
      await api.post(`/assessment/${assessmentId}/complete`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to complete assessment.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
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
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto px-4 py-10 h-[80vh]">
        {/* Left Sidebar: Question Numbers */}
        <div className="col-span-2 bg-surface-container border border-outline-variant p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-label-bold mb-2">Questions</h3>
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`py-3 rounded-lg font-bold text-center transition-all ${
                currentIdx === idx 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-surface-container-highest text-on-surface hover:bg-primary/20'
              }`}
            >
              Question {idx + 1}
            </button>
          ))}
          <div className="mt-auto">
            <button
              onClick={completeAssessment}
              disabled={loading}
              className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold hover:bg-secondary-container transition-all"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Finish Assessment'}
            </button>
          </div>
        </div>

        {/* Center Area: Question & Response */}
        <div className="col-span-8 bg-surface-container border border-outline-variant p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md">{q.topic ? q.topic.toUpperCase() : 'TOPIC'}</h2>
            <span className={`text-label-bold px-3 py-1 rounded-full ${
              q.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {q.difficulty?.toUpperCase()}
            </span>
          </div>
          <h3 className="text-display-sm">{q.title}</h3>
          <p className="text-body-md text-on-surface-variant">
            Please explain your approach and write the code for this problem.
            {q.leetcode_link && (
              <a href={q.leetcode_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                View on LeetCode
              </a>
            )}
          </p>
          <textarea
            value={responses[currentIdx] || ''}
            onChange={(e) => setResponses({ ...responses, [currentIdx]: e.target.value })}
            placeholder="Write your response here..."
            className="w-full flex-grow bg-surface-container-highest text-on-surface p-4 rounded-xl border border-outline focus:outline-primary font-mono text-body-md resize-none"
          />
          <div className="flex justify-between items-center mt-auto">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !responses[currentIdx]}
              className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />} Submit Answer
            </button>
            <button
              onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIdx === questions.length - 1}
              className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Countdown Timer */}
        <div className="col-span-2 bg-surface-container border border-outline-variant p-4 rounded-2xl flex flex-col items-center justify-center gap-4">
          <Timer className={`w-12 h-12 ${timeLeft < 300 ? 'text-error' : 'text-primary'}`} />
          <h3 className="text-label-bold">Time Remaining</h3>
          <div className={`font-mono text-display-sm font-bold ${timeLeft < 300 ? 'text-error' : 'text-on-surface'}`}>
            {formatTime(timeLeft)}
          </div>
          {timeLeft < 300 && (
            <div className="text-error text-label-small text-center flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Hurry up!
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
