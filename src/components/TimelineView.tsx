import React, { useMemo } from 'react';
import { Clock, Calendar, AlertCircle, Plus, Sparkles, CheckCircle } from 'lucide-react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { formatDateTime } from '../utils/dateUtils';

interface TimelineViewProps {
  tasks: Task[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onOpenNewTaskModal: () => void;
}

interface TimelineGroup {
  groupKey: string;
  title: string;
  subtitle: string;
  isOverdueGroup?: boolean;
  isTodayGroup?: boolean;
  tasks: Task[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenNewTaskModal,
}) => {
  // Only show pending tasks in chronological order on the timeline
  const pendingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks]);

  // Group pending tasks chronologically
  const timelineGroups = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);

    const overdueList: Task[] = [];
    const todayList: Task[] = [];
    const tomorrowList: Task[] = [];
    const futureByDate: Record<string, Task[]> = {};

    pendingTasks.forEach((task) => {
      const due = new Date(task.dueDate);
      if (isNaN(due.getTime())) {
        if (!futureByDate['no-date']) futureByDate['no-date'] = [];
        futureByDate['no-date'].push(task);
        return;
      }

      if (due < now) {
        overdueList.push(task);
      } else if (due >= todayStart && due <= todayEnd) {
        todayList.push(task);
      } else if (due > todayEnd && due <= tomorrowEnd) {
        tomorrowList.push(task);
      } else {
        // Group by YYYY-MM-DD
        const dateKey = due.toISOString().split('T')[0];
        if (!futureByDate[dateKey]) futureByDate[dateKey] = [];
        futureByDate[dateKey].push(task);
      }
    });

    const groups: TimelineGroup[] = [];

    if (overdueList.length > 0) {
      groups.push({
        groupKey: 'overdue',
        title: 'เกินกำหนดส่ง (Overdue)',
        subtitle: `${overdueList.length} รายการที่เลยกำหนดเวลาแล้ว`,
        isOverdueGroup: true,
        tasks: overdueList,
      });
    }

    if (todayList.length > 0) {
      groups.push({
        groupKey: 'today',
        title: 'กำหนดส่งวันนี้ (Today)',
        subtitle: `${todayList.length} งานที่ต้องทำให้เสร็จในวันนี้`,
        isTodayGroup: true,
        tasks: todayList,
      });
    }

    if (tomorrowList.length > 0) {
      groups.push({
        groupKey: 'tomorrow',
        title: 'กำหนดส่งพรุ่งนี้ (Tomorrow)',
        subtitle: `${tomorrowList.length} งานสำหรับวันพรุ่งนี้`,
        tasks: tomorrowList,
      });
    }

    // Sorted future dates
    const sortedDateKeys = Object.keys(futureByDate).sort();
    sortedDateKeys.forEach((key) => {
      if (key === 'no-date') {
        groups.push({
          groupKey: 'no-date',
          title: 'ไม่มีกำหนดเวลาชัดเจน',
          subtitle: `${futureByDate[key].length} รายการ`,
          tasks: futureByDate[key],
        });
      } else {
        const d = new Date(key + 'T00:00:00');
        const monthNamesThai = [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        const dayNamesThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        const dayStr = `${dayNamesThai[d.getDay()]}ที่ ${d.getDate()} ${monthNamesThai[d.getMonth()]} ${d.getFullYear() + 543}`;

        groups.push({
          groupKey: key,
          title: dayStr,
          subtitle: `${futureByDate[key].length} งาน`,
          tasks: futureByDate[key],
        });
      }
    });

    return groups;
  }, [pendingTasks]);

  if (pendingTasks.length === 0) {
    return (
      <div id="timeline-empty-state" className="bg-[#161920] rounded-2xl border border-[#2D3139] p-8 sm:p-12 text-center my-6 max-w-2xl mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-xl bg-emerald-950/50 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-800/50">
          <CheckCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
          ไม่มีงานค้างในเส้นเวลา (Timeline)
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
          คุณเคลียร์งานที่รอดำเนินการครบหมดแล้ว หรือยังไม่ได้สร้างรายการงานใหม่ เริ่มต้นวางแผนวันของคุณตอนนี้
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="btn-empty-add-task"
            onClick={onOpenNewTaskModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center gap-2 shadow-xs border border-blue-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างงานใหม่</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="timeline-container" className="my-5 max-w-4xl mx-auto">
      {/* Timeline Title & Helper */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>เส้นเวลาภารกิจที่กำลังจะมาถึง ({pendingTasks.length} รายการ)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            เรียงลำดับตามกำหนดเวลาที่ใกล้ที่สุด เพื่อให้คุณวางแผนและจัดการลำดับความสำคัญได้ง่าย
          </p>
        </div>
      </div>

      {/* Timeline Nodes & Vertical Spine */}
      <div className="relative pl-7 sm:pl-9 space-y-6 before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#2D3139]">
        {timelineGroups.map((group) => {
          return (
            <div key={group.groupKey} className="relative">
              {/* Timeline Section Node Indicator */}
              <div
                className={`absolute -left-7 sm:-left-9 top-1 w-5 h-5 rounded-full border-2 bg-[#161920] flex items-center justify-center z-10 ${
                  group.isOverdueGroup
                    ? 'border-rose-500 text-rose-400 ring-3 ring-rose-950/60'
                    : group.isTodayGroup
                    ? 'border-amber-500 text-amber-400 ring-3 ring-amber-950/60'
                    : 'border-blue-500 text-blue-400 ring-3 ring-blue-950/60'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    group.isOverdueGroup
                      ? 'bg-rose-500'
                      : group.isTodayGroup
                      ? 'bg-amber-500'
                      : 'bg-blue-400'
                  }`}
                />
              </div>

              {/* Group Header Badge */}
              <div className="mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={`text-xs sm:text-sm font-bold tracking-tight ${
                      group.isOverdueGroup
                        ? 'text-rose-400'
                        : group.isTodayGroup
                        ? 'text-amber-400'
                        : 'text-[#F1F5F9]'
                    }`}
                  >
                    {group.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">• {group.subtitle}</span>
                </div>
              </div>

              {/* Tasks List within this group */}
              <div className="space-y-2.5">
                {group.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
