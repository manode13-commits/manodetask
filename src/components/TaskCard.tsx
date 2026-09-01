import React from 'react';
import { Check, Calendar, AlertCircle, Edit2, Trash2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TaskPriority } from '../types';
import { formatDateShort, getDueStatus, formatDateTime } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'completed';
  const dueInfo = getDueStatus(task.dueDate, task.status);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      // Trigger mini celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#3B82F6', '#F59E0B'],
      });
    }
    onToggleStatus(task);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            สำคัญสูง (High)
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            ปานกลาง (Medium)
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#1E222B] text-slate-300 border border-[#2D3139]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            ปกติ (Low)
          </span>
        );
    }
  };

  return (
    <div
      id={`task-item-${task.id}`}
      className={`group relative rounded-xl border transition-all duration-200 p-3.5 sm:p-4 shadow-xs ${
        isCompleted
          ? 'border-[#242830] bg-[#12141A]/70 opacity-70'
          : dueInfo.isOverdue
          ? 'border-rose-900/60 bg-rose-950/20 hover:border-rose-700/60'
          : 'border-[#2D3139] bg-[#161920] hover:border-[#3D4450] hover:bg-[#1A1D25]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Mark as Done Custom Checkbox */}
        <button
          id={`btn-toggle-task-${task.id}`}
          onClick={handleToggle}
          aria-label={isCompleted ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'border-[#3B4252] bg-[#12141A] hover:border-emerald-500 hover:bg-emerald-950/30 text-transparent'
          }`}
        >
          <Check className={`w-3.5 h-3.5 stroke-[2.5] ${isCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 text-emerald-400'}`} />
        </button>

        {/* Task Details Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {getPriorityBadge(task.priority)}
            
            {/* Due Date or Completed Status Pill */}
            {!isCompleted ? (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border ${dueInfo.colorClass}`}>
                <Clock className="w-3 h-3" />
                <span>{dueInfo.label}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border bg-emerald-950/50 text-emerald-300 border-emerald-800/60">
                <Check className="w-3 h-3" />
                <span>เสร็จแล้ว</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-sm sm:text-base font-medium text-[#F1F5F9] leading-snug break-words ${
              isCompleted ? 'line-through text-slate-500 font-normal' : ''
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`text-xs sm:text-sm mt-1 text-slate-300 leading-relaxed whitespace-pre-line break-words ${
                isCompleted ? 'text-slate-500 line-through' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Meta & Timestamps Footer */}
          <div className="mt-3 pt-2.5 border-t border-[#242830] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px]" title={`กำหนดส่ง: ${formatDateTime(task.dueDate)}`}>
                <Calendar className="w-3 h-3 text-slate-500" />
                <span className="font-medium text-slate-300">กำหนด:</span> {formatDateShort(task.dueDate)}
              </span>

              {isCompleted && task.completedAt && (
                <span className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                  • เสร็จเมื่อ: {formatDateShort(task.completedAt)}
                </span>
              )}
            </div>

            {/* Action Buttons (Edit & Delete) */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
              <button
                id={`btn-edit-task-${task.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#262A33] transition-colors"
                title="แก้ไขข้อมูลงาน"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                id={`btn-delete-task-${task.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                title="ลบงานนี้"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
