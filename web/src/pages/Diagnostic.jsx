import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import DifficultyBadge from '../components/DifficultyBadge';

export default function Diagnostic() {
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Check auth and fetch assessment
  useEffect(() => {
    const telegramId = localStorage.getItem('telegram_id');
    if (!telegramId) {
      navigate('/login');
      return;
    }

    async function initAssessment() {
      try {
        setLoading(true);
        // For now, we always start a new assessment when visiting this page
        // as per the plan "Accessible via the prominent 'Start Diagnostic' call-to-action"
        // and we assume the user wants to take it.
        // In a real app, we might check for an active one first.
        
        // We need a company slug. Default to 'amazon' for free tier or if not set.
        // Ideally we fetch the user's target company first.
        const userRes = await api.get(`/users/${telegramId}`);
        const companySlug = userRes.data.company_slug || 'amazon';

        const res = await api.post('/assessments/start', { 
          telegram_id: telegramId, 
          company_slug: companySlug 
        });
        
        setAssessment(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to start assessment:', err);
        setError('Failed to start assessment. Please try again.');
        setLoading(false);
      }
    }

    initAssessment();
  }, [navigate]);

  // Timer
  useEffect(() => {
    if (loading || isCompleted || !assessment) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, loading, isCompleted, assessment]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const isWarning = timeLeft < 120; // 2 minutes

  const currentQuestion = assessment?.questions?.[currentIndex];

  const handleSubmit = async () => {
    if (!currentQuestion) return;
    
    setIsSubmitting(true);
    try {
      const telegramId = localStorage.getItem('telegram_id');
      await api.post(`/assessments/${assessment.assessment_id}/respond`, {
        question_id: currentQuestion.id,
        user_response: response,
        time_taken_seconds: 15 * 60 - timeLeft,
        question_title: currentQuestion.title,
        difficulty: currentQuestion.difficulty,
        topic: currentQuestion.topic
      });

      // Move to next question or complete
      if (currentIndex < assessment.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setResponse('');
        setTimeLeft(15 * 60); // Reset timer for next question
      } else {
        // Complete assessment
        const completeRes = await api.post(`/assessments/${assessment.assessment_id}/complete`);
        setResults(completeRes.data);
        setIsCompleted(true);
      }
    } catch (err) {
      console.error('Failed to submit response:', err);
      alert('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setResponse('Skipped');
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
          <p className="text-headline-sm text-primary font-bold">Loading Assessment...</p>
          <p className="text-body-md text-on-surface-variant">Gathering questions tailored for you.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-error text-5xl">error</span>
          <p className="text-headline-sm text-error font-bold">Error</p>
          <p className="text-body-md text-on-surface-variant">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary text-on-primary px-6 py-2 rounded font-bold hover:opacity-90 active:scale-95 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const score = results?.overall_score || 0;
    const scoreColor = score > 70 ? 'text-primary' : score > 40 ? 'text-tertiary' : 'text-error';
    
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center h-20 px-page_padding max-w-7xl mx-auto w-full border-b border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center gap-unit_sm">
            <span className="material-symbols-outlined text-primary">terminal</span>
            <span className="text-headline-md font-bold text-primary">PrepTrack</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow py-unit_xxl px-page_padding max-w-4xl mx-auto w-full flex flex-col gap-unit_lg">
          <section className="bg-surface-container border border-outline-variant p-unit_xl rounded-xl text-center">
            <h1 className="text-headline-lg font-bold mb-unit_md">Assessment Completed!</h1>
            
            {/* Score Circle */}
            <div className="relative w-32 h-32 mx-auto mb-unit_lg flex items-center justify-center">
              <div className={`text-5xl font-bold ${scoreColor}`}>
                {score}
              </div>
              <div className="absolute inset-0 border-4 border-outline-variant rounded-full"></div>
              <div className={`absolute inset-0 border-4 border-current ${scoreColor} rounded-full`} style={{ clipPath: `polygon(50% 50%, -50% -50%, ${score >= 25 ? '150% -50%' : '50% -50%'}, ${score >= 50 ? '150% 150%' : '50% -50%'}, ${score >= 75 ? '-50% 150%' : '50% -50%'}, -50% -50%)` }}></div>
            </div>

            <p className="text-body-lg text-on-surface-variant mb-unit_xl">
              Your overall readiness score is <span className={`font-bold ${scoreColor}`}>{score}/100</span>.
            </p>

            {/* Topic Scores */}
            <div className="flex flex-col gap-unit_md text-left">
              <h2 className="text-headline-sm font-bold">Topic Breakdown</h2>
              {results?.topic_scores && Object.entries(results.topic_scores).map(([topic, tScore]) => (
                <div key={topic} className="flex flex-col gap-unit_xs">
                  <div className="flex justify-between text-label-bold">
                    <span className="capitalize">{topic}</span>
                    <span>{tScore}/100</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${tScore > 70 ? 'bg-primary' : tScore > 40 ? 'bg-tertiary' : 'bg-error'}`}
                      style={{ width: `${tScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-unit_xl w-full md:w-auto px-unit_xl py-unit_sm rounded-lg bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(111,255,146,0.2)] hover:brightness-110 active:scale-95 transition-all"
            >
              Go to Dashboard
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* TopAppBar */}
      <header className="flex justify-between items-center h-14 md:h-20 px-page_padding sticky top-0 w-full z-40 border-b border-outline-variant bg-surface">
        <div className="flex items-center gap-unit_sm">
          <span 
            className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform"
            onClick={() => navigate('/dashboard')}
          >
            arrow_back
          </span>
          <span className="text-headline-sm font-bold text-primary hidden md:inline">PrepTrack Diagnostic</span>
          <span className="text-headline-sm font-bold text-primary md:hidden">Diagnostic</span>
        </div>
        <div className={`flex items-center gap-unit_sm font-medium ${isWarning ? 'text-error' : 'text-primary'}`}>
          <span className="material-symbols-outlined" data-icon="timer">timer</span>
          <span className="text-label-bold font-label-bold">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-unit_md pb-unit_xxl px-page_padding max-w-4xl mx-auto w-full flex flex-col gap-unit_lg">
        {/* Progress Section */}
        <section className="w-full mt-unit_md">
          <div className="flex justify-between items-end mb-unit_xs">
            <span className="text-on-surface-variant text-label-md font-label-md uppercase tracking-wider">Diagnostic Progress</span>
            <span className="text-primary text-label-bold font-label-bold">Question {currentIndex + 1} of {assessment?.questions?.length}</span>
          </div>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className="bg-primary-container h-full transition-all duration-500 shadow-[0_0_8px_rgba(75,226,119,0.4)]"
              style={{ width: `${((currentIndex + 1) / assessment?.questions?.length) * 100}%` }}
            ></div>
          </div>
        </section>

        {/* Question Card Bento Grid Style */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-unit_md">
          {/* Metadata Side */}
          <div className="md:col-span-3 flex flex-row md:flex-col gap-unit_sm">
            <div className="bg-surface-container border border-outline-variant p-unit_md rounded-xl flex-1 md:flex-none">
              <span className="text-on-surface-variant text-label-md font-label-md block mb-unit_xs uppercase">Difficulty</span>
              <DifficultyBadge difficulty={currentQuestion?.difficulty?.toLowerCase() || 'medium'} />
            </div>
            <div className="bg-surface-container border border-outline-variant p-unit_md rounded-xl flex-1 md:flex-none">
              <span className="text-on-surface-variant text-label-md font-label-md block mb-unit_xs uppercase">Topic</span>
              <div className="flex items-center gap-unit_xs text-on-surface font-medium">
                <span className="material-symbols-outlined text-[18px]" data-icon="data_object">data_object</span>
                <span className="text-body-sm font-body-sm">{currentQuestion?.topic}</span>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="md:col-span-9 bg-surface-container border border-outline-variant p-unit_xl rounded-xl">
            <h1 className="text-headline-lg font-bold text-on-surface mb-unit_md">{currentQuestion?.title}</h1>
            <p className="text-body-md text-on-surface-variant mb-unit_lg leading-relaxed whitespace-pre-wrap">
              {currentQuestion?.description}
            </p>

            {/* Input Area */}
            <div className="flex flex-col gap-unit_sm">
              <label className="text-label-bold font-label-bold text-on-surface" for="approach">Your Approach</label>
              <div className="relative">
                <textarea 
                  className={`w-full bg-surface-container-low border ${isWarning ? 'border-error' : 'border-outline-variant'} rounded-lg p-unit_md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-on-surface-variant/40`}
                  id="approach" 
                  placeholder="Describe your approach, time/space complexity..." 
                  rows="6"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                ></textarea>
                <div className="absolute bottom-unit_sm right-unit_sm flex items-center gap-unit_xs text-on-surface-variant text-label-md bg-surface-container-low px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[14px]" data-icon="edit_note">edit_note</span>
                  <span>{response.length} characters</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetric Action Area */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-unit_lg mt-unit_md pb-unit_xxl">
          <button 
            onClick={handleSkip}
            className="w-full md:w-auto px-unit_xl py-unit_sm rounded-lg border border-outline-variant text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors active:scale-95 flex items-center justify-center gap-unit_sm order-2 md:order-1"
          >
            <span className="material-symbols-outlined" data-icon="skip_next">skip_next</span>
            Skip this question
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || response.trim().length < 10}
            className={`w-full md:w-64 py-unit_md rounded-lg bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(111,255,146,0.2)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-unit_sm order-1 md:order-2 ${ (isSubmitting || response.trim().length < 10) ? 'opacity-50 cursor-not-allowed' : '' }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
          </button>
        </section>
      </main>
    </div>
  );
}
