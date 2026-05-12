import React from 'react';
import { motion } from 'motion/react';
import { Video, Mic, Layout, Sparkles } from 'lucide-react';

export default function Mock() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <Video className="w-12 h-12" />
        </div>
        <h1 className="text-display mb-4">AI Mock Interview</h1>
        <p className="text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Coming Soon: Real-time video and audio mock interviews with AI. Master your behavioral and technical presence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Video Sync', icon: Video, desc: 'Real-time eye contact analysis' },
            { title: 'Audio Analysis', icon: Mic, desc: 'Voice confidence & clarity checks' },
            { title: 'Live Coding', icon: Layout, desc: 'Collaborative code editor with AI' },
          ].map((feature, i) => (
            <div key={i} className="bg-surface-container border border-outline-variant p-6 rounded-2xl">
              <feature.icon className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="text-headline-sm mb-2">{feature.title}</h3>
              <p className="text-body-sm text-on-surface-variant">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
