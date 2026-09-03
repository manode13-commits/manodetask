import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { Task } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void> | void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(task.id);
      setIsDeleting(false);
      onClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div
      id="delete-confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#161920] w-full max-w-md max-h-[92dvh] rounded-2xl border border-[#2D3139] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2D3139] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#F8FAFC]">
              ยืนยันการลบรายการ
            </h2>
          </div>
          <button
            id="btn-close-delete-modal"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#242830] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs sm:text-sm text-slate-300">
            คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้ออกจากระบบ? รายการที่ถูกลบจะไม่สามารถกู้คืนได้
          </p>

          <div className="p-3 bg-[#12141A] rounded-xl border border-[#2D3139]">
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              ชื่องานที่จะลบ:
            </span>
            <p className="text-sm font-medium text-[#F8FAFC] break-words line-clamp-2">
              {task.title}
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-5 py-3.5 border-t border-[#2D3139] bg-[#12141A] flex items-center justify-end gap-2.5">
          <button
            id="btn-cancel-delete"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-[#242830] transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-xs border border-rose-500/30 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังลบ...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบงานนี้</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
