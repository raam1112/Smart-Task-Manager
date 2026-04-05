'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit2, Clock, CheckCircle } from 'lucide-react';

export default function TaskBoard({ user }: { user: any }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    if (!user) return;
    fetchTasks();

    const channel = supabase
      .channel('tasks-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` }, payload => {
        fetchTasks();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    await supabase.from('tasks').insert([
      { user_id: user.id, title: newTask, priority, status: 'todo' }
    ]);
    setNewTask('');
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('tasks').update({ status }).eq('id', id);
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
  };

  const renderColumn = (title: string, statusFilter: string) => {
    const columnTasks = tasks.filter(t => t.status === statusFilter);
    return (
      <div className="glass-panel" style={{ flex: 1, minWidth: '300px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
          {title} <span className="badge" style={{ background: 'var(--bg-secondary)' }}>{columnTasks.length}</span>
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '300px' }}>
          {columnTasks.map(task => (
            <div key={task.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div className="flex-between">
                <span className={`badge priority-${task.priority}`} style={{ textTransform: 'capitalize' }}>
                  {task.priority || 'Medium'}
                </span>
                <button onClick={() => deleteTask(task.id)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <p style={{ marginTop: '0.5rem', fontWeight: 500 }}>{task.title}</p>
              
              <div className="flex-between" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {statusFilter !== 'todo' && (
                    <button onClick={() => updateStatus(task.id, 'todo')} className="btn-icon bg-secondary" style={{ width: '28px', height: '28px' }} title="Move to To Do">
                      <Clock size={14} />
                    </button>
                  )}
                  {statusFilter !== 'in-progress' && (
                    <button onClick={() => updateStatus(task.id, 'in-progress')} className="btn-icon" style={{ width: '28px', height: '28px' }} title="Mark somewhat complete">
                      <Edit2 size={14} color="var(--warning)" />
                    </button>
                  )}
                  {statusFilter !== 'completed' && (
                    <button onClick={() => updateStatus(task.id, 'completed')} className="btn-icon" style={{ width: '28px', height: '28px' }} title="Mark complete">
                      <CheckCircle size={14} color="var(--success)" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {columnTasks.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>No tasks here.</p>}
        </div>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)} 
          placeholder="What needs to be done?" 
          className="input-field" 
          style={{ flex: 1 }}
        />
        <select className="input-field" value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '150px' }}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="btn-primary">Add Task</button>
      </form>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {renderColumn('To Do', 'todo')}
        {renderColumn('In Progress', 'in-progress')}
        {renderColumn('Completed', 'completed')}
      </div>
    </div>
  );
}
