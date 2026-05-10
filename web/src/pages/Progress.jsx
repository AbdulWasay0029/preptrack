import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import WeakTopicChart from '../components/WeakTopicChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Progress() {
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
        console.error('Failed to fetch progress data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-red-400">Failed to load data</div>;

  const weakTopics = (data.weakTopics || []).map(t => ({
    ...t,
    weak_score: Math.round(t.weak_score * 100)
  }));

  const activityData = data.activityData || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Progress 📈</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-primary">Weak Topics</h2>
          <p className="text-gray-400 text-sm mb-4">Focus on these to improve your chances.</p>
          {weakTopics.length > 0 ? (
             <WeakTopicChart data={weakTopics} />
          ) : (
            <div className="text-gray-500 py-8 text-center">Not enough data to determine weak topics yet.</div>
          )}
        </div>

        <div className="bg-surface rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-primary">Activity (Last 30 Days)</h2>
          <div className="h-64 w-full">
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
                    itemStyle={{ color: '#22c55e' }}
                  />
                  <Area type="monotone" dataKey="solved" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 py-8 text-center">No activity data available yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
