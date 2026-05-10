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

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-red-400">Failed to load data</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {data.user?.name || 'User'}! 👋</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StreakCard streak={data.streak || 0} />
        <div className="bg-surface rounded-xl p-6 border border-gray-800 col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-primary">Today's Focus</h2>
          <div className="text-gray-300">
            Keep practicing your weak areas. You have {data.todayQuestions?.length || 0} questions assigned for today.
          </div>
        </div>
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
