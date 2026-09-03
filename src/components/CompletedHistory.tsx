import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Trash2, Search, Calendar, Clock, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { formatDateTime, formatDateShort } from '../utils/dateUtils';

interface CompletedHistoryProps {
  tasks: Task[];
  onToggleStatus: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onBatchDeleteCompleted?: () => void;
}

export const CompletedHistory: React.FC<CompletedHistoryProps> = ({
  tasks,
  onToggleStatus,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter completed tasks
  const completedTasks = tasks
    .filter((t) => t.status === 'completed')
    .sort((a, b) => {
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return timeB - timeA; // Latest completed first
    })
    .filter((t) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    });

  return (
    <div id="completed-history-section" className="my-5 max-w-4xl mx-auto space-y-4">
      {/* Header & Controls */}
      <div className="bg-[#161920] p-3.5 sm:p-4 rounded-xl border border-[#2D3139] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] flex items-center gap-2 truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="hidden sm:inline">ประวัติงานที่ทำเสร็จแล้ว (Completed History)</span>
            <span className="sm:hidden">ประวัติงานที่ทำเสร็จแล้ว</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            บันทึกประวัติความสำเร็จพร้อมเวลาที่เสร็จสิ้น ({completedTasks.length} รายการ)
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-completed-tasks"
            type="text"
            placeholder="ค้นหาประวัติงานที่เสร็จ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[#12141A] border border-[#2D3139] rounded-lg text-[#E2E8F0] placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {completedTasks.length === 0 ? (
        <div id="empty-history-state" className="bg-[#161920] rounded-2xl border border-[#2D3139] p-8 sm:p-12 text-center text-slate-400">
          <div className="w-12 h-12 rounded-xl bg-[#12141A] border border-[#2D3139] flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
            {searchTerm ? 'ไม่พบประวัติงานที่ตรงกับคำค้นหา' : 'ยังไม่มีประวัติงานที่ทำเสร็จ'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'ลองปรับเปลี่ยนคำค้นหาใหม่อีกครั้ง'
              : 'เมื่อคุณทำงานสำเร็จและกดปุ่มทำเครื่องหมายเสร็จสิ้น รายการจะถูกย้ายมาบันทึกที่นี่โดยอัตโนมัติ'}
          </p>
        </div>
      ) : (
        /* Completed Tasks List */
        <div className="space-y-2.5">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              id={`history-task-${task.id}`}
              className="bg-[#161920] rounded-xl border border-[#2D3139] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3D4450] transition-all shadow-xs"
            >
              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950/50 text-emerald-300 border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>เสร็จสมบูรณ์</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    • ความสำคัญ: {task.priority}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-medium text-slate-400 line-through">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-500 line-through mt-0.5 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Timestamps Info */}
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {task.completedAt && (
                    <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      เสร็จเมื่อ: {formatDateTime(task.completedAt)}
                    </span>
                  )}
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    กำหนดส่งเดิม: {formatDateShort(task.dueDate)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#242830]">
                <button
                  id={`btn-restore-task-${task.id}`}
                  onClick={() => onToggleStatus(task)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-[#1E222B] hover:bg-[#282E3A] border border-[#2D3139] transition-colors flex items-center gap-1.5"
                  title="ย้ายกลับไปเป็นงานที่รอดำเนินการ"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>กู้คืนสถานะ</span>
                </button>
                <button
                  id={`btn-delete-history-task-${task.id}`}
                  onClick={() => {
                    onDelete(task.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                  title="ลบรายการถาวร"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
