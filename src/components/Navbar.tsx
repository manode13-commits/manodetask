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
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-xs flex-shrink-0">
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight text-[#F1F5F9] truncate">
                <span className="hidden sm:inline">Personal Task & Timeline</span>
                <span className="sm:hidden">Personal Task</span>
              </h1>
              {/* Real-time Indicator */}
              <div 
                title={isSyncing ? "กำลังซิงค์ข้อมูลกับ Firestore..." : "เชื่อมต่อ Firestore แบบ Real-time สำเร็จ"}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex-shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden xs:inline">Live</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              จัดการตารางงานและเส้นเวลาส่วนบุคคล
            </p>
          </div>
        </div>

        {/* Desktop View Switcher & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Creator Profile Badge in Header (Large screens) */}
          <div className="hidden lg:block">
            <CreatorCard compact />
          </div>

          {/* Desktop Navigation Tabs */}
          <nav aria-label="Views" className="hidden md:flex items-center bg-[#101217] p-1 rounded-xl border border-[#2D3139] text-xs font-medium text-slate-400">
            <button
              id="tab-timeline-view"
              onClick={() => onViewChange('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#1E222B] border border-[#2D3139] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-300" />
          </button>

          {/* New Task Button */}
          <button
            id="btn-create-new-task-header"
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs active:scale-95 border border-blue-400/30 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">เพิ่มงานใหม่</span>
            <span className="sm:hidden">เพิ่มงาน</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Segmented Control (< md) */}
      <div className="md:hidden px-3 pb-2.5 pt-0.5 border-t border-[#232730] bg-[#14161C]">
        <nav aria-label="Mobile Views" className="grid grid-cols-3 gap-1 bg-[#0E1015] p-1 rounded-xl border border-[#2D3139] text-xs font-medium text-slate-400">
          <button
            id="tab-timeline-view-mobile"
            onClick={() => onViewChange('timeline')}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 text-center whitespace-nowrap ${
              currentView === 'timeline'
                ? 'bg-[#222733] text-[#F8FAFC] shadow-xs font-semibold border border-[#3B4252]'
                : 'hover:text-[#E2E8F0] hover:bg-[#161920]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs">เส้นเวลา</span>
          </button>
          <button
            id="tab-all-view-mobile"
            onClick={() => onViewChange('all')}
            className={`py-1.5 px-1.5 rounded-lg transition-all flex items-center justify-center gap-1 text-center whitespace-nowrap ${
              currentView === 'all'
                ? 'bg-[#222733] text-[#F8FAFC] shadow-xs font-semibold border border-[#3B4252]'
                : 'hover:text-[#E2E8F0] hover:bg-[#161920]'
            }`}
          >
            <span className="text-[11px] sm:text-xs">งานที่ต้องทำ</span>
            <span className="px-1 py-0.2 rounded-md text-[10px] bg-[#2D3139] text-slate-200">
              {pendingCount}
            </span>
          </button>
          <button
            id="tab-completed-view-mobile"
            onClick={() => onViewChange('completed')}
            className={`py-1.5 px-1.5 rounded-lg transition-all flex items-center justify-center gap-1 text-center whitespace-nowrap ${
              currentView === 'completed'
                ? 'bg-[#222733] text-[#F8FAFC] shadow-xs font-semibold border border-[#3B4252]'
                : 'hover:text-[#E2E8F0] hover:bg-[#161920]'
            }`}
          >
            <span className="text-[11px] sm:text-xs">เสร็จแล้ว</span>
            <span className="px-1 py-0.2 rounded-md text-[10px] bg-[#2D3139] text-slate-200">
              {completedCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
