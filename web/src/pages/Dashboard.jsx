import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const telegramId = localStorage.getItem('telegram_id');
    if (!telegramId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get(`/analytics/${telegramId}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpgrade = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
      amount: 19900, // ₹199 in paise
      currency: 'INR',
      name: 'PrepTrack',
      description: 'Upgrade to PrepTrack Pro',
      image: 'https://cdn.lucide.react/zap.png',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}. Your account will be upgraded shortly via webhook.`);
      },
      prefill: {
        name: localStorage.getItem('telegram_name') || 'User',
        contact: '9999999999'
      },
      theme: {
        color: '#4be277' // Use primary color from design
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('telegram_id');
    localStorage.removeItem('telegram_name');
    navigate('/login');
  };

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [submittingCompany, setSubmittingCompany] = useState(false);

  useEffect(() => {
    if (data && !data.user?.company) {
      api.get('/questions/companies').then(res => setCompanies(res.data)).catch(console.error);
    }
  }, [data]);

  const handleCompanySubmit = async () => {
    if (!selectedCompany) return;
    setSubmittingCompany(true);
    try {
      const telegramId = localStorage.getItem('telegram_id');
      await api.patch(`/users/${telegramId}`, { target_company_slug: selectedCompany });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to set company. Please try again.');
      setSubmittingCompany(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-on-surface-variant font-body-base">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-error font-body-base">Failed to load data</div>;

  const telegramName = localStorage.getItem('telegram_name') || data.user?.name || 'User';

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-[#22c55e] border-[#22c55e]/30';
      case 'medium': return 'text-[#eab308] border-[#eab308]/30';
      case 'hard': return 'text-[#ef4444] border-[#ef4444]/30';
      default: return 'text-on-surface-variant border-outline-variant/30';
    }
  };

  // If user hasn't selected a company
  if (!data.user?.company) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-surface-container p-8 rounded-lg border border-outline-variant max-w-md w-full shadow-2xl">
          <h2 className="text-display-lg-mobile font-display-lg-mobile mb-xs text-on-surface">Welcome to PrepTrack! 🚀</h2>
          <p className="text-on-surface-variant mb-xl font-body-base">Let's get started. Which company are you targeting?</p>
          <div className="space-y-sm mb-xl max-h-60 overflow-y-auto pr-xs">
            {companies.map(c => (
              <label key={c.slug} className={`flex items-center p-md rounded-lg border cursor-pointer transition-colors ${selectedCompany === c.slug ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-outline'}`}>
                <input
                  type="radio"
                  name="company"
                  value={c.slug}
                  checked={selectedCompany === c.slug}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="mr-md text-primary focus:ring-primary bg-surface-variant border-outline-variant"
                  disabled={c.is_pro_only && !data.user?.is_pro}
                />
                <span className="flex-1 font-body-base text-on-surface">{c.name}</span>
                {c.is_pro_only && !data.user?.is_pro && (
                  <span className="text-label-caps font-label-caps bg-surface-variant text-on-surface-variant px-xs py-0.5 rounded uppercase">PRO</span>
                )}
              </label>
            ))}
          </div>
          <button
            onClick={handleCompanySubmit}
            disabled={!selectedCompany || submittingCompany}
            className="w-full py-md bg-primary text-on-primary font-bold rounded-lg transition-colors disabled:opacity-50 hover:brightness-110"
          >
            {submittingCompany ? 'Setting up...' : 'Start Practicing'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body-base text-body-base min-h-screen flex flex-col bg-background">


      {/* Main Content */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl">
        {/* Header Section: Greeting & Streak */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl items-end">
          <div className="md:col-span-8">
            <h1 className="font-display-lg text-display-lg mb-xs">Good morning, {telegramName}</h1>
            <p className="text-on-surface-variant font-body-base text-body-base">Ready to tackle today's algorithms?</p>
          </div>
          <div className="md:col-span-4">
            <div className="bg-surface-container border border-outline-variant p-md flex items-center justify-between rounded-lg">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="font-headline-md text-headline-md">{data.user?.streak || 0} Day Streak</span>
              </div>
              <div className="h-1.5 w-24 bg-surface-variant overflow-hidden rounded-full">
                <div className="bg-primary h-full" style={{ width: `${Math.min((data.user?.streak || 0) * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero: Today's Focus */}
        <section className="mb-xl">
          <div className="bg-surface-container-high border border-outline-variant p-xl relative overflow-hidden rounded-lg">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-xs px-sm py-xs bg-primary/10 text-primary border border-primary/20 mb-md rounded-lg">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span className="font-label-caps text-label-caps uppercase">Today's Focus</span>
              </div>
              <h2 className="font-display-lg-mobile text-display-lg-mobile mb-sm">Your target: {data.user?.company || 'DSA'}</h2>
              <p className="text-on-surface-variant font-body-base text-body-base mb-lg">
                Keep practicing consistently. You have {data.todayQuestions?.length || 0} questions assigned for today to improve your patterns.
              </p>
              <div className="mb-lg">
                <button 
                  onClick={() => navigate('/diagnostic')}
                  className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">quiz</span>
                  Start Diagnostic Assessment
                </button>
              </div>
              <div className="flex flex-wrap gap-md">
                <div className="bg-surface-container border border-outline-variant p-sm flex items-center gap-sm rounded-lg">
                  <span className="material-symbols-outlined text-on-surface-variant">history</span>
                  <span className="text-body-sm font-body-sm">Active Track</span>
                </div>
              </div>
            </div>
            {/* Abstract visual element */}
            <div className="absolute right-[-10%] top-[-20%] w-64 h-64 border border-outline-variant/30 rotate-45 pointer-events-none"></div>
            <div className="absolute right-[5%] bottom-[-10%] w-48 h-48 border border-outline-variant/20 -rotate-12 pointer-events-none"></div>
          </div>
        </section>

        {/* Question List */}
        <section className="mb-xl">
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-md text-headline-md">Daily Problem Set</h3>
            <span className="text-on-surface-variant font-body-sm text-body-sm uppercase tracking-widest">
              {data.todayQuestions?.length || 0} Problems Remaining
            </span>
          </div>
          <div className="grid grid-cols-1 gap-base">
            {data.todayQuestions && data.todayQuestions.length > 0 ? (
              data.todayQuestions.map(q => (
                <div key={q.id} className="bg-surface-container border border-outline-variant hover:border-outline transition-colors p-md flex flex-col md:flex-row md:items-center justify-between gap-md rounded-lg">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 flex items-center justify-center bg-surface-variant text-primary rounded-lg">
                      <span className="material-symbols-outlined">code</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-headline-md leading-tight">{q.title}</h4>
                      <div className="flex gap-sm mt-xs">
                        <span className="font-label-caps text-label-caps bg-surface-variant px-xs py-0.5 rounded text-on-surface-variant">Topic: {q.topic_name}</span>
                        <span className={`font-label-caps text-label-caps border px-xs py-0.5 rounded ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-xl">
                    <a className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href={q.leetcode_link} target="_blank" rel="noopener noreferrer">
                      View on LeetCode
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-on-surface-variant text-center py-xl bg-surface-container border border-outline-variant rounded-lg">
                No questions for today. You might have finished them all!
              </div>
            )}
          </div>
        </section>

        {/* Upgrade Banner */}
        {!data.user?.is_pro && (
          <section>
            <div className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col md:flex-row md:items-center justify-between gap-md rounded-lg">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-full">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                </div>
                <div>
                  <p className="font-body-base text-body-base font-bold">Unlock company-specific questions with PrepTrack Pro.</p>
                  <p className="text-on-surface-variant font-body-sm text-body-sm">Target Google, Meta, and Amazon interview patterns.</p>
                </div>
              </div>
              <button onClick={handleUpgrade} className="bg-primary text-on-primary font-label-caps text-label-caps px-xl py-md hover:brightness-110 transition-all rounded-lg uppercase">Upgrade Now</button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline-variant mt-xl">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-lg py-xl max-w-container-max mx-auto gap-md">
          <div className="text-label-caps font-label-caps text-on-surface uppercase tracking-widest">PrepTrack</div>
          <div className="flex gap-xl">
            <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Terms</a>
            <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Support</a>
          </div>
          <div className="text-on-surface-variant font-body-sm text-body-sm opacity-60">Built by Abdul Wasay</div>
        </div>
      </footer>
    </div>
  );
}
