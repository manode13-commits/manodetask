import React from 'react';
import { CheckSquare, Plus, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { ViewMode } from '../types';
import { CreatorCard } from './CreatorCard';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenNewTaskModal: () => void;
  onOpenRulesModal: () => void;
  isSyncing: boolean;
  pendingCount: number;
  completedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenNewTaskModal,
  onOpenRulesModal,
  isSyncing,
  pendingCount,
  completedCount,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-30 bg-[#161920]/95 backdrop-blur-md border-b border-[#2D3139]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-xs">
            <CheckSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-[#F1F5F9]">
                Personal Task & Timeline
              </h1>
              {/* Real-time Indicator */}
              <div 
                title={isSyncing ? "กำลังซิงค์ข้อมูลกับ Firestore..." : "เชื่อมต่อ Firestore แบบ Real-time สำเร็จ"}
                className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firestore Live</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              จัดการตารางงานและเส้นเวลาส่วนบุคคล
            </p>
          </div>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Creator Profile Badge in Header (desktop) */}
          <div className="hidden lg:block">
            <CreatorCard compact />
          </div>

          {/* Navigation Mode Pill */}
          <nav aria-label="Views" className="flex items-center bg-[#101217] p-1 rounded-xl border border-[#2D3139] text-xs font-medium text-slate-400">
            <button
              id="tab-timeline-view"
              onClick={() => onViewChange('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'timeline'
                  ? 'bg-[#222733] text-[#F8FAFC] shadow-xs font-semibold border border-[#3B4252]'
                  : 'hover:text-[#E2E8F0] hover:bg-[#161920]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>เส้นเวลา (Timeline)</span>
            </button>
            <button
              id="tab-all-view"
              onClick={() => onViewChange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'all'
                  ? 'bg-[#222733] text-[#F8FAFC] shadow-xs font-semibold border border-[#3B4252]'
                  : 'hover:text-[#E2E8F0] hover:bg-[#161920]'
              }`}
            >
              <span>งานที่ต้องทำ</span>
              <span className="px-1.5 py-0.2 rounded-md text-[11px] bg-[#2D3139] text-slate-200">
                {pendingCount}
              </span>
            </button>
            <button
              id="tab-completed-view"
              onClick={() => onViewChange('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'completed'
                  ? 'bg-[#222733] text-[#F8FAFC] shadow-xs font-semibold border border-[#3B4252]'
                  : 'hover:text-[#E2E8F0] hover:bg-[#161920]'
              }`}
            >
              <span>เสร็จแล้ว</span>
              <span className="px-1.5 py-0.2 rounded-md text-[11px] bg-[#2D3139] text-slate-200">
                {completedCount}
              </span>
            </button>
          </nav>

          {/* Firestore Rules Guide Modal Trigger */}
          <button
            id="btn-open-rules-guide"
            onClick={onOpenRulesModal}
            title="ดูคำแนะนำการตั้งค่า Firestore Rules"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#1E222B] border border-[#2D3139] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-300" />
          </button>

          {/* New Task Button */}
          <button
            id="btn-create-new-task-header"
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs active:scale-95 border border-blue-400/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">เพิ่มงานใหม่</span>
            <span className="sm:hidden">เพิ่มงาน</span>
          </button>
        </div>
      </div>
    </header>
  );
};
