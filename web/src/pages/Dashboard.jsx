import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import StreakCard from '../components/StreakCard';
import DifficultyBadge from '../components/DifficultyBadge';

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
    // Standard Razorpay Checkout Integration
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy', // Replace with real test key
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      name: 'PrepTrack',
      description: 'Upgrade to PrepTrack Pro',
      image: 'https://cdn.lucide.react/zap.png', // dummy logo
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}. Your account will be upgraded shortly via webhook.`);
      },
      prefill: {
        name: localStorage.getItem('telegram_name') || 'User',
        contact: '9999999999'
      },
      theme: {
        color: '#4f46e5'
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      // Reload page to re-fetch analytics properly
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to set company. Please try again.');
      setSubmittingCompany(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-red-400">Failed to load data</div>;

  const telegramName = localStorage.getItem('telegram_name') || data.user?.name || 'User';

  if (!data.user?.company) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-surface p-8 rounded-xl border border-gray-800 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Welcome to PrepTrack! 🚀</h2>
          <p className="text-gray-400 mb-6">Let's get started. Which company are you targeting?</p>
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
            {companies.map(c => (
              <label key={c.slug} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedCompany === c.slug ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-800 hover:border-gray-600'}`}>
                <input
                  type="radio"
                  name="company"
                  value={c.slug}
                  checked={selectedCompany === c.slug}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="mr-3"
                  disabled={c.is_pro_only && !data.user?.is_pro}
                />
                <span className="flex-1">{c.name}</span>
                {c.is_pro_only && !data.user?.is_pro && (
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">PRO</span>
                )}
              </label>
            ))}
          </div>
          <button
            onClick={handleCompanySubmit}
            disabled={!selectedCompany || submittingCompany}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {submittingCompany ? 'Setting up...' : 'Start Practicing'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {telegramName}! 👋</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StreakCard streak={data.user?.streak || 0} />
        <div className="bg-surface rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-primary">Today's Focus</h2>
          <div className="text-gray-300">
            Keep practicing your weak areas. You have {data.todayQuestions?.length || 0} questions assigned for today.
          </div>
        </div>
        {!data.user?.is_pro && (
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-400">PrepTrack Pro</h2>
              <p className="text-gray-400 text-sm mb-4">Unlock Google, Apple, and specific company tracking.</p>
            </div>
            <button 
              onClick={handleUpgrade}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Upgrade Now - ₹499
            </button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Today's Questions</h2>
      <div className="space-y-4">
        {data.todayQuestions && data.todayQuestions.length > 0 ? (
          data.todayQuestions.map(q => (
            <div key={q.id} className="bg-surface p-4 rounded-xl border border-gray-800 flex justify-between items-center">
              <div>
                <a href={q.leetcode_link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-400 hover:underline">
                  {q.title}
                </a>
                <div className="text-sm text-gray-400 mt-1">{q.topic_name}</div>
              </div>
              <DifficultyBadge difficulty={q.difficulty} />
            </div>
          ))
        ) : (
          <div className="text-gray-400">No questions for today. You might have finished them all!</div>
        )}
      </div>
    </div>
  );
}
