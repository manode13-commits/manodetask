export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string e.g. "2026-08-29T18:00"
  priority: TaskPriority;
  status: TaskStatus;
  completedAt: string | null; // ISO string or null
  createdAt: string; // ISO string
}

export type ViewMode = 'timeline' | 'all' | 'completed';

export interface TaskFilterOptions {
  search: string;
  priority: 'all' | TaskPriority;
  sortBy: 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'createdAtDesc';
}
