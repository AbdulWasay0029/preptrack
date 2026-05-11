import { useState, useEffect } from 'react';
import api from '../api/client';

const COLORS = {
  bg: '#0e150e',
  surface: '#1a221a',
  surfaceHigh: '#242c24',
  border: '#3d4a3d',
  primary: '#4be277',
  primaryDim: 'rgba(75,226,119,0.1)',
  onPrimary: '#003915',
  text: '#dce5d9',
  textMuted: '#bccbb9',
  textDim: '#869585',
};

export default function Landing() {
  const TELEGRAM_BOT_URL = "https://t.me/PrepTrackBot?start=web";
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get('/questions/companies')
      .then(res => setCompanies(res.data))
      .catch(err => console.error('Failed to fetch companies:', err));
  }, []);

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Hero */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '32px',
          alignItems: 'center',
          padding: '80px 0 64px',
        }}>
          <div style={{
            gridColumn: 'span 7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px',
          }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: COLORS.text,
              margin: 0,
            }}>
              Stop grinding randomly.<br />
              <span style={{ color: COLORS.primary }}>Start fixing your weaknesses.</span>
            </h1>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: COLORS.textMuted,
              margin: 0,
              maxWidth: '520px',
            }}>
              PrepTrack sends you company-specific DSA questions daily and adapts based on what you keep getting stuck on. Tailored technical interview prep delivered straight to your workflow.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
              <a
                href={TELEGRAM_BOT_URL}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: COLORS.primary, color: COLORS.onPrimary,
                  padding: '12px 24px', borderRadius: '4px',
                  fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                  transition: 'filter 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                Start Free on Telegram
              </a>
              <a
                href="/dashboard"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  border: `1px solid ${COLORS.border}`, color: COLORS.text,
                  padding: '12px 24px', borderRadius: '4px',
                  fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = COLORS.surface}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                View Dashboard
              </a>
            </div>
          </div>

          {/* Code preview panel — hidden on mobile */}
          <div style={{ gridColumn: 'span 5' }} className="hidden md:block">
            <div style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              padding: '24px',
              height: '380px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '12px', marginBottom: '16px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: COLORS.textDim }}>terminal</span>
                <span style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: COLORS.textDim }}>Daily_Question_042.py</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.7, color: COLORS.primary, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>class Solution:</span>
                <span style={{ paddingLeft: '16px' }}>def trap(self, height):</span>
                <span style={{ paddingLeft: '32px', color: COLORS.textDim }}># Analyzing your weak spots...</span>
                <span style={{ paddingLeft: '32px', color: COLORS.textDim }}># Topic: Two Pointers / Hard</span>
                <span style={{ paddingLeft: '32px' }}>left, right = 0, len(height) - 1</span>
                <span style={{ paddingLeft: '32px' }}>ans = 0</span>
                <span style={{ paddingLeft: '32px' }}>left_max, right_max = 0, 0</span>
                <span style={{ display: 'inline-block', width: '8px', height: '16px', background: COLORS.primary, verticalAlign: 'middle', marginLeft: '4px', animation: 'pulse 1s infinite' }}></span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: '64px 0', borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: COLORS.primary }}>Workflow</span>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.text, marginTop: '8px', marginBottom: 0 }}>The Preparatory Loop</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { icon: 'mail', title: '1. Receive', desc: 'Get a handpicked DSA problem every morning via Telegram based on your target company.' },
              { icon: 'code', title: '2. Solve', desc: 'Solve the problem in your favorite IDE and mark it as solved, stuck, or skipped.' },
              { icon: 'analytics', title: '3. Adapt', desc: 'Our engine identifies pattern gaps and adjusts tomorrow\'s questions to reinforce your weaknesses.' },
            ].map((step, i) => (
              <div key={i} style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: '4px', padding: '24px',
                transition: 'border-color 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = COLORS.textDim}
                onMouseOut={e => e.currentTarget.style.borderColor = COLORS.border}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: COLORS.primary, display: 'block', marginBottom: '12px' }}>{step.icon}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.text, marginBottom: '8px', marginTop: 0 }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Companies */}
        <section style={{ padding: '64px 0', borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: COLORS.textDim }}>Database</span>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.text, marginTop: '8px', marginBottom: 0 }}>Company-Specific Tracks</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {(companies.length > 0 ? companies : [{ name: 'Amazon', slug: 'amazon', is_pro_only: false }, { name: 'Microsoft', slug: 'microsoft', is_pro_only: false }]).map(c => (
              <span key={c.slug} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: COLORS.surface,
                border: `1px solid ${c.is_pro_only ? COLORS.primary : COLORS.border}`,
                color: c.is_pro_only ? COLORS.primary : COLORS.text,
                padding: '8px 20px', borderRadius: '100px',
                fontSize: '14px', fontWeight: c.is_pro_only ? 600 : 400,
              }}>
                {c.name}
                {c.is_pro_only && (
                  <span style={{
                    fontSize: '10px', background: COLORS.primary, color: COLORS.onPrimary,
                    padding: '1px 6px', borderRadius: '3px', fontWeight: 700, textTransform: 'uppercase',
                  }}>Pro</span>
                )}
              </span>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section style={{ padding: '64px 0', borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: COLORS.text, margin: 0 }}>Precision Training Plans</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Free */}
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: COLORS.textDim, marginBottom: '8px' }}>Standard</span>
              <div style={{ fontSize: '40px', fontWeight: 700, color: COLORS.text, marginBottom: '24px' }}>Free</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {['1 Company Track (Amazon/Microsoft)', 'Daily Problem Delivery', 'Basic Weakness Tracking'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: COLORS.textMuted }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: COLORS.primary }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={TELEGRAM_BOT_URL} style={{
                display: 'block', textAlign: 'center', border: `1px solid ${COLORS.border}`,
                color: COLORS.text, padding: '12px', borderRadius: '4px',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                transition: 'background 0.2s',
              }}>Get Started</a>
            </div>

            {/* Pro */}
            <div style={{ background: COLORS.surface, border: `2px solid ${COLORS.primary}`, borderRadius: '8px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '-13px', right: '24px',
                background: COLORS.primary, color: COLORS.onPrimary,
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
                padding: '4px 12px', borderRadius: '3px', textTransform: 'uppercase',
              }}>Recommended</div>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: COLORS.primary, marginBottom: '8px' }}>Engineer Pro</span>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '40px', fontWeight: 700, color: COLORS.text }}>₹199</span>
                <span style={{ fontSize: '16px', color: COLORS.textDim }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {['All Premium Companies (Google, etc.)', 'Advanced Adaptive AI Engine', 'Weak Topic Detection', 'Priority Telegram Support'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: COLORS.textMuted }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: COLORS.primary }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{
                background: COLORS.primary, color: COLORS.onPrimary,
                border: 'none', padding: '12px', borderRadius: '4px',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                transition: 'filter 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
              >Upgrade Now</button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '64px 0', borderTop: `1px solid ${COLORS.border}`, maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.text, textAlign: 'center', marginBottom: '32px' }}>FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { q: 'How does the adaptive logic work?', a: 'We track which topics you mark as Stuck or Skip. The engine increases frequency of those topics in your daily feed automatically.' },
              { q: 'Which Telegram bot do I use?', a: 'Just search @PrepTrackBot on Telegram and send /start. No signup needed.' },
              { q: 'Can I switch company tracks?', a: 'Yes. Use /settings in the bot to change your target company anytime.' },
              { q: 'Is it really free?', a: 'Yes, Amazon and Microsoft tracks are free forever. Pro unlocks all other companies and advanced features.' },
            ].map((item, i) => (
              <details key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '4px', padding: '16px' }}>
                <summary style={{ fontWeight: 600, fontSize: '15px', color: COLORS.text, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none' }}>
                  {item.q}
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: COLORS.textDim }}>expand_more</span>
                </summary>
                <p style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: 1.6, marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}`, marginBottom: 0 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: '64px', background: '#091009' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '32px 24px',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: COLORS.text }}>PREPTRACK</span>
            <p style={{ fontSize: '13px', color: COLORS.textDim, margin: '4px 0 0' }}>Built by Abdul Wasay</p>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#" style={{ fontSize: '13px', color: COLORS.textDim, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = COLORS.primary}
                onMouseOut={e => e.currentTarget.style.color = COLORS.textDim}
              >{l}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
