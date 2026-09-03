import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, FileText, Check, Clock } from 'lucide-react';
import { Task, TaskPriority } from '../types';
import { getDefaultDueDateTime } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
  }) => Promise<void>;
  editingTask: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getDefaultDueDateTime());
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      if (editingTask.dueDate) {
        const d = new Date(editingTask.dueDate);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          const day = d.getDate().toString().padStart(2, '0');
          const hours = d.getHours().toString().padStart(2, '0');
          const minutes = d.getMinutes().toString().padStart(2, '0');
          setDueDate(`${year}-${month}-${day}T${hours}:${minutes}`);
        } else {
          setDueDate(editingTask.dueDate);
        }
      } else {
        setDueDate(getDefaultDueDateTime());
      }
      setPriority(editingTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(getDefaultDueDateTime());
      setPriority('Medium');
    }
    setErrorMessage('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('กรุณาระบุชื่องานหรือภารกิจ');
      return;
    }

    if (!dueDate) {
      setErrorMessage('กรุณาระบุวันและเวลากำหนดส่ง');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
      });
      onClose();
    } catch (err: any) {
      console.error('Error saving task:', err);
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="task-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="task-modal-content"
        className="bg-[#161920] w-full max-w-lg max-h-[92dvh] rounded-2xl border border-[#2D3139] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#2D3139] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#12141A] border border-[#2D3139] flex items-center justify-center text-slate-300">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
              {editingTask ? 'แก้ไขข้อมูลงาน' : 'เพิ่มงานใหม่ในตาราง'}
            </h2>
          </div>
          <button
            id="btn-close-task-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#242830] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-2 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ชื่องาน / ภารกิจ <span className="text-rose-400">*</span>
            </label>
            <input
              id="input-task-title"
              type="text"
              required
              autoFocus
              placeholder="เช่น จัดทำสไลด์นำเสนองาน, ส่งรายงานประจำสัปดาห์..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#12141A] border border-[#2D3139] rounded-lg text-sm text-[#F8FAFC] placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              รายละเอียดเพิ่มเติม (Description)
            </label>
            <textarea
              id="input-task-description"
              rows={3}
              placeholder="ระบุโน้ตสำคัญ, ลิงก์ที่เกี่ยวข้อง หรือรายละเอียดขั้นตอนย่อย..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#12141A] border border-[#2D3139] rounded-lg text-sm text-[#F8FAFC] placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Grid: Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date & Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                วันและเวลากำหนดส่ง (Due Date) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-task-duedate"
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141A] border border-[#2D3139] rounded-lg text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ระดับความสำคัญ (Priority)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Low', 'Medium', 'High'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      id={`btn-priority-${p.toLowerCase()}`}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                        isSelected
                          ? p === 'High'
                            ? 'bg-rose-950/80 border-rose-600 text-rose-300 shadow-xs'
                            : p === 'Medium'
                            ? 'bg-amber-950/80 border-amber-600 text-amber-300 shadow-xs'
                            : 'bg-[#2D3139] border-slate-500 text-slate-200 shadow-xs'
                          : 'bg-[#12141A] border-[#2D3139] text-slate-400 hover:bg-[#1E222B]'
                      }`}
                    >
                      {p === 'High' ? 'สูง' : p === 'Medium' ? 'ปานกลาง' : 'ต่ำ'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-3 border-t border-[#2D3139] flex items-center justify-end gap-2.5">
            <button
              id="btn-cancel-task-form"
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-[#242830] transition-colors"
            >
              ยกเลิก
            </button>
            <button
              id="btn-submit-task-form"
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs border border-blue-400/30 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingTask ? 'อัปเดตงาน' : 'สร้างงาน'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
