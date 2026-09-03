import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Plus, Sparkles, CheckCircle2, ListTodo } from 'lucide-react';
import { Task, TaskPriority, TaskFilterOptions } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListViewProps {
  tasks: Task[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onOpenNewTaskModal: () => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenNewTaskModal,
}) => {
  const [filters, setFilters] = useState<TaskFilterOptions>({
    search: '',
    priority: 'all',
    sortBy: 'dueDateAsc',
  });

  const pendingTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'pending');
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return pendingTasks
      .filter((task) => {
        // Search
        if (filters.search.trim()) {
          const term = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(term);
          const matchDesc = task.description?.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc) return false;
        }

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'dueDateAsc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (filters.sortBy === 'dueDateDesc') {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (filters.sortBy === 'createdAtDesc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'priority') {
          const priorityScore = { High: 3, Medium: 2, Low: 1 };
          return priorityScore[b.priority] - priorityScore[a.priority];
        }
        return 0;
      });
  }, [pendingTasks, filters]);

  return (
    <div id="all-tasks-list-section" className="my-5 max-w-4xl mx-auto space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-[#161920] p-3 sm:p-4 rounded-xl border border-[#2D3139] shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-tasks"
            type="text"
            placeholder="ค้นหางานตามชื่อ หรือรายละเอียด..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[#12141A] border border-[#2D3139] rounded-lg text-[#E2E8F0] placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Priority & Sorting Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Priority filter */}
          <div className="grid grid-cols-4 sm:flex items-center gap-1 bg-[#12141A] p-0.5 border border-[#2D3139] rounded-lg text-xs font-medium w-full sm:w-auto">
            <button
              id="filter-priority-all"
              onClick={() => setFilters((prev) => ({ ...prev, priority: 'all' }))}
              className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-md transition-all text-center ${
                filters.priority === 'all'
                  ? 'bg-[#222733] text-[#F8FAFC] shadow-xs font-semibold border border-[#3B4252]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              id="filter-priority-high"
              onClick={() => setFilters((prev) => ({ ...prev, priority: 'High' }))}
              className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-md transition-all text-center ${
                filters.priority === 'High'
                  ? 'bg-rose-950/80 text-rose-300 font-semibold shadow-xs border border-rose-700/80'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              สูง
            </button>
            <button
              id="filter-priority-medium"
              onClick={() => setFilters((prev) => ({ ...prev, priority: 'Medium' }))}
              className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-md transition-all text-center ${
                filters.priority === 'Medium'
                  ? 'bg-amber-950/80 text-amber-300 font-semibold shadow-xs border border-amber-700/80'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              กลาง
            </button>
            <button
              id="filter-priority-low"
              onClick={() => setFilters((prev) => ({ ...prev, priority: 'Low' }))}
              className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-md transition-all text-center ${
                filters.priority === 'Low'
                  ? 'bg-[#2D3139] text-slate-200 font-semibold shadow-xs border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ต่ำ
            </button>
          </div>

          {/* Sort Selector */}
          <select
            id="select-sort-tasks"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
            }
            className="w-full sm:w-auto px-2.5 py-1.5 text-xs sm:text-sm bg-[#12141A] border border-[#2D3139] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-[#E2E8F0] font-medium"
          >
            <option value="dueDateAsc">เรียงตาม: กำหนดส่งใกล้สุด</option>
            <option value="dueDateDesc">เรียงตาม: กำหนดส่งไกลสุด</option>
            <option value="priority">เรียงตาม: ความสำคัญสูงก่อน</option>
            <option value="createdAtDesc">เรียงตาม: สร้างล่าสุด</option>
          </select>
        </div>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div id="empty-tasks-state" className="bg-[#161920] rounded-2xl border border-[#2D3139] p-8 sm:p-12 text-center text-slate-400">
          <div className="w-12 h-12 rounded-xl bg-[#12141A] border border-[#2D3139] flex items-center justify-center mx-auto mb-3 text-slate-400">
            <ListTodo className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
            {filters.search || filters.priority !== 'all'
              ? 'ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา'
              : 'ยังไม่มีรายการงานที่รอดำเนินการ'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            {filters.search || filters.priority !== 'all'
              ? 'ลองล้างคำค้นหาหรือเปลี่ยนตัวกรองความสำคัญ'
              : 'เพิ่มงานใหม่หรือเริ่มต้นด้วยชุดงานตัวอย่าง'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              id="btn-list-add-task"
              onClick={onOpenNewTaskModal}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-medium transition-all inline-flex items-center gap-1.5 shadow-xs border border-blue-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มงานใหม่</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
