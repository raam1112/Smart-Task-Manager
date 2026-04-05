'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import TaskBoard from '@/components/TaskBoard';
import AIPlanner from '@/components/AIPlanner';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) {
    return <div className="container flex-center" style={{ minHeight: '60vh' }}>Loading Dashboard...</div>;
  }

  if (!user) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Welcome back, <span className="text-gradient" style={{ wordBreak: 'break-all' }}>{user.email}</span>!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You've got tasks to master today.</p>
      </div>

      <AIPlanner user={user} />
      
      <TaskBoard user={user} />
    </div>
  );
}
