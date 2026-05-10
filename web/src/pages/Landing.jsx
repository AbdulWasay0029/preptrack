import { useState } from 'react';
import { Target, TrendingUp, BellRing, CheckCircle, Zap } from 'lucide-react';

export default function Landing() {
  const TELEGRAM_BOT_URL = "https://t.me/PrepTrackBot?start=web";

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          PrepTrack
        </div>
        <a 
          href={TELEGRAM_BOT_URL}
          className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium"
        >
          Sign In
        </a>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
          <Zap size={16} />
          <span>V2.0 Now Live - New Companies Added</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Crack Your Next <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Tech Interview
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Daily Telegram Prep for FAANG, Unicorns & Top Startups. 
          Master algorithms with curated questions, streak tracking, and spaced repetition delivered straight to your chats.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={TELEGRAM_BOT_URL}
            className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            Start Prepping for Free
            <Target size={20} />
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why PrepTrack?</h2>
          <p className="text-gray-400">Everything you need to stay consistent without the friction.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
              <BellRing className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Telegram-First Delivery</h3>
            <p className="text-gray-400">No apps to download. Get your daily questions where you already spend your time.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <TrendingUp className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Streak Tracking</h3>
            <p className="text-gray-400">Build unstoppable momentum. Our dashboard tracks your consistency over time.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
              <CheckCircle className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Curated Data</h3>
            <p className="text-gray-400">300+ questions specifically mapped to Amazon, Google, Swiggy, Zomato, and more.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Trusted by Engineers</h2>
            <p className="text-gray-400 text-lg mb-8">
              Consistency is the hardest part of interview prep. PrepTrack removes the friction by bringing the prep to you.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-800/50 border border-white/5">
              <p className="italic text-gray-300 mb-4">"The daily Telegram reminder is the only reason I kept my 45-day streak. Just cleared my rounds at Swiggy!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                <div>
                  <div className="font-bold">Rahul M.</div>
                  <div className="text-sm text-gray-400">SDE II</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500">
        <p>© {new Date().getFullYear()} PrepTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
