/**
 * Personal Task & Timeline Tracker with Firebase Firestore Real-time Sync
 * Minimalist, Clean, Responsive Web Application
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { TimelineView } from './components/TimelineView';
import { TaskListView } from './components/TaskListView';
import { CompletedHistory } from './components/CompletedHistory';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { FirestoreRulesModal } from './components/FirestoreRulesModal';
import { CreatorCard } from './components/CreatorCard';
import { Task, ViewMode, TaskPriority } from './types';
import {
  subscribeTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from './firebase/tasksService';
import { AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Subscribe to Firebase Firestore Real-time onSnapshot
  useEffect(() => {
    setIsSyncing(true);
    const unsubscribe = subscribeTasks(
      (data) => {
        setTasks(data);
        setIsLoading(false);
        setIsSyncing(false);
      },
      (error) => {
        console.error('Realtime Firestore Error:', error);
        setIsLoading(false);
        setIsSyncing(false);
        showNotification('error', `ไม่สามารถเชื่อมต่อ Firestore: ${error.message}`);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Keyboard shortcut listener (e.g. press 'n' or '+' to add task)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName) ||
        isModalOpen ||
        isRulesModalOpen
      ) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTask(null);
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isRulesModalOpen]);

  // Handler: Add or Update Task
  const handleSaveTask = async (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
      });
      showNotification('success', 'บันทึกการแก้ไขงานสำเร็จ');
    } else {
      await createTask(taskData);
      showNotification('success', 'สร้างงานใหม่และบันทึกลง Firestore เรียบร้อย');
    }
  };

  // Handler: Toggle Task Done / Pending
  const handleToggleTaskStatus = async (task: Task) => {
    try {
      await toggleTaskStatus(task);
      const isNowCompleted = task.status === 'pending';
      showNotification(
        'success',
        isNowCompleted
          ? `ทำภารกิจ "${task.title}" สำเร็จแล้ว!`
          : `กู้คืนสถานะ "${task.title}" กลับมาเป็นงานที่ต้องทำ`
      );
    } catch (err: any) {
      showNotification('error', `เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  // Handler: Prompt Delete Task (Opens custom confirmation modal)
  const promptDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
    }
  };

  // Handler: Delete Task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      showNotification('success', 'ลบรายการงานเรียบร้อยแล้ว');
    } catch (err: any) {
      showNotification('error', `เกิดข้อผิดพลาดในการลบ: ${err.message}`);
    }
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E2E8F0] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        onOpenNewTaskModal={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        onOpenRulesModal={() => setIsRulesModalOpen(true)}
        isSyncing={isSyncing}
        pendingCount={pendingCount}
        completedCount={completedCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Floating Notification Toast */}
        {notification && (
          <div
            id="toast-notification"
            className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom-5 duration-200 max-w-[calc(100vw-2rem)] ${
              notification.type === 'success'
                ? 'bg-[#161920] text-[#E2E8F0] border-[#2D3139]'
                : 'bg-rose-950/90 text-rose-200 border-rose-800/80'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="font-medium truncate">{notification.message}</span>
          </div>
        )}

        {/* Top Summary Stats Bar */}
        <StatsBar tasks={tasks} />

        {/* Content Loading State */}
        {isLoading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mb-3" />
            <p className="text-sm font-medium text-slate-300">กำลังเชื่อมต่อฐานข้อมูล Firestore...</p>
            <p className="text-xs text-slate-500 mt-1">กำลังดึงข้อมูลงานแบบ Real-time</p>
          </div>
        ) : (
          /* View Content Switcher */
          <div className="space-y-6 sm:space-y-8">
            <div>
              {currentView === 'timeline' && (
                <TimelineView
                  tasks={tasks}
                  onToggleStatus={handleToggleTaskStatus}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                  onDelete={promptDeleteTask}
                  onOpenNewTaskModal={() => {
                    setEditingTask(null);
                    setIsModalOpen(true);
                  }}
                />
              )}

              {currentView === 'all' && (
                <TaskListView
                  tasks={tasks}
                  onToggleStatus={handleToggleTaskStatus}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                  onDelete={promptDeleteTask}
                  onOpenNewTaskModal={() => {
                    setEditingTask(null);
                    setIsModalOpen(true);
                  }}
                />
              )}

              {currentView === 'completed' && (
                <CompletedHistory
                  tasks={tasks}
                  onToggleStatus={handleToggleTaskStatus}
                  onDelete={promptDeleteTask}
                />
              )}
            </div>

            {/* Author / Creator Profile Section */}
            <section id="creator-profile-section" className="pt-4 pb-2 border-t border-[#232730]">
              <CreatorCard />
            </section>
          </div>
        )}
      </main>

      {/* Floating Action Button on Mobile */}
      <button
        id="btn-fab-add-task"
        onClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        className="md:hidden fixed right-4 bottom-5 sm:right-6 sm:bottom-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 border border-blue-400/30 flex items-center justify-center active:scale-95 transition-all"
        aria-label="สร้างงานใหม่"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        editingTask={editingTask}
      />

      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />

      <FirestoreRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
