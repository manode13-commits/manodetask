import React from 'react';
import { Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Task } from '../types';

interface StatsBarProps {
  tasks: Task[];
  onFilterShortcut?: (filter: string) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ tasks }) => {
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const dueTodayTasks = pendingTasks.filter((t) => {
    const due = new Date(t.dueDate);
    return due >= todayStart && due <= todayEnd;
  });

  const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'High');

  const overdueTasks = pendingTasks.filter((t) => {
    const due = new Date(t.dueDate);
    return due < now;
  });

  return (
    <div id="stats-overview-bar" className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
      {/* 1. งานที่รอดำเนินการ */}
      <div id="stat-pending-card" className="bg-[#161920] p-3.5 rounded-xl border border-[#2D3139] shadow-xs flex items-center justify-between hover:border-[#3E4554] transition-colors">
        <div>
          <p className="text-xs font-medium text-slate-400">งานที่รอดำเนินการ</p>
          <p className="text-2xl font-bold text-[#F8FAFC] mt-0.5">{pendingTasks.length}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-[#12141A] border border-[#2D3139] flex items-center justify-center text-slate-300">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {/* 2. ครบกำหนดวันนี้ */}
      <div id="stat-today-card" className="bg-[#161920] p-3.5 rounded-xl border border-[#2D3139] shadow-xs flex items-center justify-between hover:border-amber-800/60 transition-colors">
        <div>
          <p className="text-xs font-medium text-amber-400">ครบกำหนดวันนี้</p>
          <p className="text-2xl font-bold text-amber-300 mt-0.5">{dueTodayTasks.length}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-800/50 flex items-center justify-center text-amber-400">
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      {/* 3. สำคัญสูง (High Priority) หรือ Overdue */}
      <div id="stat-priority-card" className="bg-[#161920] p-3.5 rounded-xl border border-[#2D3139] shadow-xs flex items-center justify-between hover:border-rose-800/60 transition-colors">
        <div>
          <p className="text-xs font-medium text-rose-400">
            {overdueTasks.length > 0 ? `เกินกำหนด (${overdueTasks.length})` : 'ความสำคัญสูง'}
          </p>
          <p className="text-2xl font-bold text-rose-300 mt-0.5">
            {overdueTasks.length > 0 ? overdueTasks.length : highPriorityTasks.length}
          </p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-4 h-4" />
        </div>
      </div>

      {/* 4. ทำเสร็จแล้ว (Completed) */}
      <div id="stat-completed-card" className="bg-[#161920] p-3.5 rounded-xl border border-[#2D3139] shadow-xs flex items-center justify-between hover:border-emerald-800/60 transition-colors">
        <div>
          <p className="text-xs font-medium text-emerald-400">งานที่ทำสำเร็จแล้ว</p>
          <p className="text-2xl font-bold text-emerald-300 mt-0.5">{completedTasks.length}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
