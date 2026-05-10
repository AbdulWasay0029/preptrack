import { useState } from 'react';

export default function Landing() {
  const TELEGRAM_BOT_URL = "https://t.me/PrepTrackBot?start=web";

  return (
    <div className="font-body-base text-body-base selection:bg-primary selection:text-on-primary bg-background min-h-screen">
      {/* TopNavBar */}
      <header className="bg-background dark:bg-background border-b border-outline-variant dark:border-outline-variant sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-lg max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-xl">
            <span className="text-headline-md font-headline-md text-primary dark:text-primary">PrepTrack</span>
            <div className="hidden md:flex items-center gap-lg">
              <a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-base text-body-base" href="/dashboard">Dashboard</a>
              <a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-base text-body-base" href="/progress">Progress</a>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <a href="/login" className="text-on-surface-variant hover:text-on-surface transition-colors font-body-base text-body-base px-md py-sm">Login</a>
            <a href={TELEGRAM_BOT_URL} className="bg-primary text-on-primary px-md py-sm rounded-lg font-bold transition-all duration-200 hover:brightness-110">Get Started</a>
          </div>
        </nav>
      </header>

      <main className="max-w-container-max mx-auto px-lg">
        {/* Hero Section */}
        <section className="py-xl md:py-32 grid md:grid-cols-12 gap-xl items-center">
          <div className="md:col-span-7 flex flex-col gap-lg">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">
              Stop grinding randomly. <br />
              <span className="text-primary">Start fixing your weaknesses.</span>
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-xl w-full">
              PrepTrack sends you company-specific DSA questions daily and adapts based on what you keep getting stuck on. Tailored technical interview prep delivered straight to your workflow.
            </p>
            <div className="flex flex-wrap gap-md mt-sm">
              <a href={TELEGRAM_BOT_URL} className="bg-primary text-on-primary px-xl py-md rounded-lg font-bold flex items-center gap-sm hover:brightness-110 transition-all">
                <span className="material-symbols-outlined" data-icon="send">send</span>
                Start Free on Telegram
              </a>
              <a href="/dashboard" className="border border-outline-variant text-on-surface px-xl py-md rounded-lg font-bold hover:bg-surface-variant transition-all">
                View Dashboard
              </a>
            </div>
          </div>
          <div className="md:col-span-5 hidden md:block">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-lg relative overflow-hidden h-[400px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-10" data-alt="Close-up macro photography of high-performance code on a dark monitor screen."></div>
              <div className="relative z-10 font-code-snippet text-code-snippet text-primary flex flex-col gap-base">
                <div className="flex items-center gap-sm mb-md border-b border-outline-variant pb-sm">
                  <span className="material-symbols-outlined text-sm" data-icon="terminal">terminal</span>
                  <span className="text-label-caps font-label-caps uppercase tracking-wider text-on-surface-variant">Daily_Question_042.py</span>
                </div>
                <span>class Solution:</span>
                <span className="pl-md">def trap(self, height: List[int]) -&gt; int:</span>
                <span className="pl-xl text-on-surface-variant"># Analyzing your weak spots...</span>
                <span className="pl-xl text-on-surface-variant"># Topic: Two Pointers / Hard</span>
                <span className="pl-xl">left, right = 0, len(height) - 1</span>
                <span className="pl-xl">ans = 0</span>
                <span className="pl-xl">left_max, right_max = 0, 0</span>
                <span className="animate-pulse bg-primary w-2 h-4 inline-block align-middle ml-1"></span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-xl border-t border-outline-variant">
          <div className="mb-xl">
            <span className="text-label-caps font-label-caps text-primary uppercase tracking-widest">Workflow</span>
            <h2 className="font-headline-md text-headline-md text-on-surface mt-base">The Preparatory Loop</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-lg">
            <div className="bg-surface-container border border-outline-variant p-lg rounded-lg hover:border-outline transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-md group-hover:scale-110 transition-transform" data-icon="mail">mail</span>
              <h3 className="font-headline-md text-on-surface mb-sm">1. Receive</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Get a handpicked DSA problem every morning via Telegram based on your target company.</p>
            </div>
            <div className="bg-surface-container border border-outline-variant p-lg rounded-lg hover:border-outline transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-md group-hover:scale-110 transition-transform" data-icon="code">code</span>
              <h3 className="font-headline-md text-on-surface mb-sm">2. Solve</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Solve the problem in your favorite IDE and submit your logic for instant complexity analysis.</p>
            </div>
            <div className="bg-surface-container border border-outline-variant p-lg rounded-lg hover:border-outline transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-md group-hover:scale-110 transition-transform" data-icon="analytics">analytics</span>
              <h3 className="font-headline-md text-on-surface mb-sm">3. Adapt</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Our engine identifies pattern gaps and adjusts tomorrow's question to reinforce your weaknesses.</p>
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-xl border-t border-outline-variant">
          <div className="mb-xl text-center">
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">Database</span>
            <h2 className="font-headline-md text-headline-md text-on-surface mt-base">Company-Specific Tracks</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-md">
            <span className="bg-surface-container border border-outline-variant px-xl py-sm rounded-full text-on-surface font-body-base flex items-center gap-sm">
              Amazon
            </span>
            <span className="bg-surface-container border border-outline-variant px-xl py-sm rounded-full text-on-surface font-body-base flex items-center gap-sm">
              Microsoft
            </span>
            <span className="bg-surface-container border border-primary px-xl py-sm rounded-full text-primary font-bold font-body-base flex items-center gap-sm">
              Google
              <span className="text-[10px] bg-primary text-on-primary px-base rounded uppercase font-bold">Pro</span>
            </span>
            <span className="bg-surface-container border border-primary px-xl py-sm rounded-full text-primary font-bold font-body-base flex items-center gap-sm">
              Flipkart
              <span className="text-[10px] bg-primary text-on-primary px-base rounded uppercase font-bold">Pro</span>
            </span>
            <span className="bg-surface-container border border-outline-variant px-xl py-sm rounded-full text-on-surface-variant font-body-base">Apple</span>
            <span className="bg-surface-container border border-outline-variant px-xl py-sm rounded-full text-on-surface-variant font-body-base">Meta</span>
            <span className="bg-surface-container border border-outline-variant px-xl py-sm rounded-full text-on-surface-variant font-body-base">Uber</span>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-xl border-t border-outline-variant">
          <div className="mb-xl text-center">
            <h2 className="font-display-lg text-on-surface">Precision Training Plans</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-xl max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-surface-container border border-outline-variant p-xl rounded-xl flex flex-col">
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-sm">Standard</span>
              <h3 className="text-display-lg font-display-lg text-on-surface mb-md">Free</h3>
              <ul className="space-y-md mb-xl flex-grow">
                <li className="flex items-center gap-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                  1 Company Track (Amazon/Microsoft)
                </li>
                <li className="flex items-center gap-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                  Daily Problem Delivery
                </li>
                <li className="flex items-center gap-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                  Basic Weakness Tracking
                </li>
              </ul>
              <a href={TELEGRAM_BOT_URL} className="w-full border border-outline-variant text-on-surface py-md rounded-lg font-bold hover:bg-surface-variant transition-all text-center">Get Started</a>
            </div>

            {/* Pro Plan */}
            <div className="bg-surface-container border-2 border-primary p-xl rounded-xl flex flex-col relative">
              <div className="absolute -top-3 right-xl bg-primary text-on-primary text-[10px] px-md py-xs rounded uppercase font-bold tracking-widest">Recommended</div>
              <span className="text-label-caps font-label-caps text-primary uppercase mb-sm">Engineer Pro</span>
              <h3 className="text-display-lg font-display-lg text-on-surface mb-md">₹199<span className="text-body-base text-on-surface-variant">/month</span></h3>
              <ul className="space-y-md mb-xl flex-grow">
                <li className="flex items-center gap-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                  All Premium Companies (Google, etc.)
                </li>
                <li className="flex items-center gap-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                  Advanced Adaptive AI Engine
                </li>
                <li className="flex items-center gap-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                  Mock Interview Simulations
                </li>
                <li className="flex items-center gap-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">check_circle</span>
                  Priority Telegram Support
                </li>
              </ul>
              <button className="w-full bg-primary text-on-primary py-md rounded-lg font-bold hover:brightness-110 transition-all">Upgrade Now</button>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-xl border-t border-outline-variant max-w-3xl mx-auto">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-xl text-center">System FAQ</h2>
          <div className="space-y-md">
            <details className="bg-surface-container border border-outline-variant rounded-lg p-md group">
              <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-on-surface">
                How does the adaptive logic work?
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform" data-icon="expand_more">expand_more</span>
              </summary>
              <p className="mt-md text-body-sm text-on-surface-variant border-t border-outline-variant pt-md">
                We tag each question with specific technical tags (e.g., Slidewindow, Segment Trees). If you fail to solve a problem within a time limit or request hints, our engine increases the frequency of that specific topic in your daily feed.
              </p>
            </details>
            <details className="bg-surface-container border border-outline-variant rounded-lg p-md group">
              <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-on-surface">
                Which Telegram bot do I use?
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform" data-icon="expand_more">expand_more</span>
              </summary>
              <p className="mt-md text-body-sm text-on-surface-variant border-t border-outline-variant pt-md">
                Once you sign up, you will be given a unique token to authorize with the @PrepTrackBot. All communications and submissions happen within that secure channel.
              </p>
            </details>
            <details className="bg-surface-container border border-outline-variant rounded-lg p-md group">
              <summary className="flex justify-between items-center cursor-pointer list-none font-bold text-on-surface">
                Can I switch company tracks?
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform" data-icon="expand_more">expand_more</span>
              </summary>
              <p className="mt-md text-body-sm text-on-surface-variant border-t border-outline-variant pt-md">
                Yes, Free users can switch once every 30 days. Pro users have unlimited switches and can even run concurrent tracks for multiple target firms.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline-variant mt-32">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-lg py-xl max-w-container-max mx-auto gap-lg">
          <div className="flex flex-col items-center md:items-start gap-sm">
            <span className="text-label-caps font-label-caps text-on-surface">PREPTRACK</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Built by Abdul Wasay</p>
          </div>
          <div className="flex gap-xl">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Terms</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Support</a>
          </div>
          <div className="flex gap-md">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors" data-icon="terminal">terminal</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors" data-icon="data_object">data_object</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
