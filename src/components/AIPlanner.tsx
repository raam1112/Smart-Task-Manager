'use client';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AIPlanner({ user }: { user: any }) {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generatePlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user.id);
      
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: tasks || [] })
      });
      const data = await res.json();
      setSuggestion(data.suggestion || data.error);
    } catch (err) {
      setSuggestion("Unable to generate AI plan at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-full)', color: 'var(--primary)' }}>
        <Sparkles size={32} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '0.5rem' }}>AI Productivity Assistant</h3>
        {suggestion ? (
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{suggestion}"</p>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>Click the button to get personalized AI advice on what you should focus on next based on your task board.</p>
        )}
      </div>
      <div>
        <button className="btn-primary" onClick={generatePlan} disabled={loading}>
          {loading ? 'Analyzing...' : 'Generate Plan'}
        </button>
      </div>
    </div>
  );
}
