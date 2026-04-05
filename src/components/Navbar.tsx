'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckSquare, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="glass-panel" style={{ margin: 'var(--spacing-md)', padding: 'var(--spacing-md) var(--spacing-xl)', borderRadius: 'var(--radius-full)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/" className="flex-center" style={{ gap: 'var(--spacing-sm)' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '8px', borderRadius: 'var(--radius-md)' }}>
          <CheckSquare size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '0px' }}>Smart<span className="text-gradient">Task</span></h2>
      </Link>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
        {user ? (
          <>
            <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
            <button onClick={handleLogout} className="btn-icon" title="Logout">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <>
            <Link href="/auth" className="btn-secondary">Log In</Link>
            <Link href="/auth?m=register" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
