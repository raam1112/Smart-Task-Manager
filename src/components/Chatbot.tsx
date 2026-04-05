'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string; };

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I am your AI assistant for Smart Task Manager. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }] })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Oops, something went wrong with the AI.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div 
        className={`chatbot-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 999, ...isOpen ? { transform: 'scale(0)', opacity: 0 } : {} }}
      >
        <MessageSquare size={28} />
      </div>

      <div 
        className="glass-panel" 
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          width: '350px',
          height: '500px',
          maxWidth: 'calc(100vw - 4rem)',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          animation: 'fadeIn var(--transition-fast) forwards'
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <Bot size={20} className="text-gradient" />
            <span style={{ fontWeight: 600 }}>AI Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="btn-icon" style={{ width: '30px', height: '30px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ 
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              borderBottomRightRadius: m.role === 'user' ? '4px' : 'var(--radius-lg)',
              borderBottomLeftRadius: m.role === 'assistant' ? '4px' : 'var(--radius-lg)',
              fontSize: '0.9rem',
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
            }}>
              {m.content}
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
              <Bot size={16} className="animate-pulse" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..." 
            className="input-field"
            style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)' }}
          />
          <button type="submit" disabled={isTyping} className="btn-primary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
