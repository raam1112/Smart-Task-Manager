'use client';
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '4rem', gap: '2rem' }}>
      <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '1rem' }}>
          Master Your Time with <br />
          <span className="text-gradient">AI-Powered Scheduling</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Smart Task Manager merges beautiful design with Google Gemini AI to help you organize, prioritize, and crush your daily deadlines effortlessly.
        </p>
        <Link href="/auth" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Get Started for Free <ArrowRight size={20} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', marginTop: '4rem' }}>
        {[
          { icon: <Zap size={32} className="text-gradient" />, title: 'Real-Time Sync', desc: 'Instantly updates your tasks across all devices using Supabase Real-time.' },
          { icon: <CheckCircle size={32} style={{ color: 'var(--success)' }} />, title: 'Smart Priorities', desc: 'Flag tasks effortlessly. Stay on top of what truly matters.' },
          { icon: <Shield size={32} className="text-gradient" />, title: 'AI Assistant', desc: 'Stuck? Chat with our interactive AI assistant for productivity tips.' },
        ].map((feat, i) => (
          <div key={i} className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: `${i * 0.2}s` }}>
            <div style={{ marginBottom: '1rem' }}>{feat.icon}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
