import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

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

  const handleLogout = () => {
    localStorage.removeItem('telegram_id');
    localStorage.removeItem('telegram_name');
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center text-on-surface-variant font-body-base">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-error font-body-base">Failed to load data</div>;

  const overall = data.overall || {};
  const topicBreakdown = data.topicBreakdown || [];
  const dailyActivity = data.dailyActivity || [];

  // Get max solved for scaling the chart
  const maxSolved = Math.max(...dailyActivity.map(d => parseInt(d.solved) || 0), 1);

  // Take top 4 weak topics
  const topWeakTopics = topicBreakdown.slice(0, 4);

  const telegramName = localStorage.getItem('telegram_name') || data.user?.name || 'User';

  return (
    <div className="font-body-base text-body-base min-h-screen flex flex-col bg-background text-on-background selection:bg-primary selection:text-on-primary">


      <main className="max-w-container-max mx-auto px-lg py-xl flex-grow w-full">
        {/* Page Header */}
        <div className="mb-xl">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Performance Metrics</h1>
          <p className="font-body-base text-body-base text-on-surface-variant">Analytical overview of your technical interview preparation cycle.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
          {/* Solved */}
          <div className="bg-surface-container border border-outline-variant p-lg flex flex-col gap-xs rounded-lg">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Solved</span>
            <span className="font-display-lg text-display-lg text-primary">{overall.total_solved || 0}</span>
            <div className="h-1 bg-outline-variant w-full mt-sm rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${Math.min(((overall.total_solved || 0) / (overall.total_attempted || 1)) * 100, 100)}%` }}></div>
            </div>
          </div>

          {/* Stuck */}
          <div className="bg-surface-container border border-outline-variant p-lg flex flex-col gap-xs rounded-lg">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Stuck</span>
            <span className="font-display-lg text-display-lg text-tertiary">{overall.total_stuck || 0}</span>
            <div className="h-1 bg-outline-variant w-full mt-sm rounded-full overflow-hidden">
              <div className="h-full bg-tertiary" style={{ width: `${Math.min(((overall.total_stuck || 0) / (overall.total_attempted || 1)) * 100, 100)}%` }}></div>
            </div>
          </div>

          {/* Skipped */}
          <div className="bg-surface-container border border-outline-variant p-lg flex flex-col gap-xs rounded-lg">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Skipped</span>
            <span className="font-display-lg text-display-lg text-outline">{overall.total_skipped || 0}</span>
            <div className="h-1 bg-outline-variant w-full mt-sm rounded-full overflow-hidden">
              <div className="h-full bg-outline" style={{ width: `${Math.min(((overall.total_skipped || 0) / (overall.total_attempted || 1)) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Activity Chart Section */}
          <div className="lg:col-span-8 bg-surface-container border border-outline-variant p-lg rounded-lg">
            <div className="flex justify-between items-center mb-xl">
              <h2 className="font-headline-md text-headline-md text-on-surface">30-Day Activity</h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant">Last 30 Days</span>
            </div>
            
            {dailyActivity.length > 0 ? (
              <div className="relative h-64 w-full flex items-end gap-[2px]">
                {dailyActivity.map((day, index) => {
                  const solvedCount = parseInt(day.solved) || 0;
                  const heightPercent = maxSolved > 0 ? (solvedCount / maxSolved) * 100 : 0;
                  return (
                    <div 
                      key={index} 
                      className="flex-1 bg-primary/20 hover:bg-primary transition-colors cursor-pointer"
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      title={`${day.date}: ${solvedCount} solved`}
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 w-full flex items-center justify-center border border-dashed border-outline-variant rounded-lg">
                <span className="text-on-surface-variant font-body-sm">No activity data available yet.</span>
              </div>
            )}

            <div className="mt-md pt-md border-t border-outline-variant flex justify-between text-on-surface-variant font-label-caps text-label-caps">
              <span>30D AGO</span>
              <span>TODAY</span>
            </div>
          </div>

          {/* Weak Topics Section */}
          <div className="lg:col-span-4 bg-surface-container border border-outline-variant p-lg rounded-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xl">Weak Topics</h2>
            <div className="flex flex-col gap-lg">
              {topWeakTopics.length > 0 ? (
                topWeakTopics.map((topic, index) => {
                  const score = Math.round(parseFloat(topic.weak_score) * 100) || 0;
                  return (
                    <div key={index} className="flex flex-col gap-xs">
                      <div className="flex justify-between items-center mb-xs">
                        <span className="font-body-sm text-body-sm text-on-surface">{topic.topic}</span>
                        <span className="font-code-snippet text-code-snippet text-primary">{score}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${score}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-on-surface-variant text-center py-xl">
                  Not enough data to determine weak topics yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty States / Placeholder Section */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{
            background: '#1a221a',
            border: '1px dashed #3d4a3d',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#869585', marginBottom: '16px' }}>analytics</span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#dce5d9', marginBottom: '8px' }}>Detailed Breakdown</h3>
            <p style={{ fontSize: '14px', color: '#bccbb9', lineHeight: 1.6, maxWidth: '320px', margin: 0 }}>Complete 10 more problems to unlock deep-dive performance analysis per difficulty level.</p>
          </div>

          <div style={{
            background: '#1a221a',
            border: '1px dashed #3d4a3d',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#869585', marginBottom: '16px' }}>leaderboard</span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#dce5d9', marginBottom: '8px' }}>Peer Comparison</h3>
            <p style={{ fontSize: '14px', color: '#bccbb9', lineHeight: 1.6, maxWidth: '320px', margin: 0 }}>Global ranking data is currently being synthesized. Check back after your next mock assessment.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline-variant mt-xl">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-lg py-xl max-w-container-max mx-auto">
          <div className="mb-md md:mb-0">
            <span className="text-label-caps font-label-caps text-on-surface">PrepTrack</span>
            <span className="mx-md text-outline-variant">|</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface-variant">Built by Abdul Wasay</span>
          </div>
          <div className="flex gap-lg">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
