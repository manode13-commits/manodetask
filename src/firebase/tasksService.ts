import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Task, TaskPriority, TaskStatus } from '../types';

const COLLECTION_NAME = 'tasks';

/**
 * Realtime Listener for tasks collection
 * Automatically updates when documents are added, modified, or removed
 */
export function subscribeTasks(
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  try {
    const tasksCollectionRef = collection(db, COLLECTION_NAME);
    // Fetch and order by createdAt descending as base
    const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const tasks: Task[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || '',
            description: data.description || '',
            dueDate: data.dueDate || new Date().toISOString(),
            priority: (data.priority as TaskPriority) || 'Medium',
            status: (data.status as TaskStatus) || 'pending',
            completedAt: data.completedAt || null,
            createdAt: data.createdAt || new Date().toISOString(),
          };
        });
        onData(tasks);
      },
      (error) => {
        console.error('Error fetching tasks realtime:', error);
        onError(error);
      }
    );
  } catch (err: any) {
    console.error('Failed to establish Firestore subscription:', err);
    onError(err);
    return () => {};
  }
}

/**
 * Add a new task to Firestore
 */
export async function createTask(taskData: {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}): Promise<string> {
  const newTask = {
    title: taskData.title.trim(),
    description: taskData.description.trim(),
    dueDate: taskData.dueDate,
    priority: taskData.priority,
    status: 'pending' as TaskStatus,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newTask);
  return docRef.id;
}

/**
 * Update an existing task
 */
export async function updateTask(
  taskId: string,
  updatedFields: Partial<Omit<Task, 'id' | 'createdAt'>>
): Promise<void> {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  await updateDoc(taskDocRef, updatedFields);
}

/**
 * Mark a task as Done or Reopen
 */
export async function toggleTaskStatus(task: Task): Promise<void> {
  const newStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending';
  const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

  const taskDocRef = doc(db, COLLECTION_NAME, task.id);
  await updateDoc(taskDocRef, {
    status: newStatus,
    completedAt,
  });
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  await deleteDoc(taskDocRef);
}

/**
 * Seed initial helpful tasks if database is empty
 */
export async function seedSampleTasks(): Promise<void> {
  const now = new Date();
  
  // Format helpers
  const getRelativeDate = (hoursOffset: number) => {
    const d = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  const sampleTasks = [
    {
      title: 'ทบทวนและวางแผนงานประจำสัปดาห์ (Weekly Review)',
      description: 'จัดลำดับความสำคัญของเป้าหมายและเคลียร์ Inbox ให้เรียบร้อย',
      dueDate: getRelativeDate(2),
      priority: 'High' as TaskPriority,
    },
    {
      title: 'ส่งมอบงาน Project Milestone 1',
      description: 'ตรวจสอบความถูกต้องของโค้ดและส่งรายงานให้ทีม',
      dueDate: getRelativeDate(26),
      priority: 'High' as TaskPriority,
    },
    {
      title: 'อ่านบทความ System Architecture & Clean Code',
      description: 'ศึกษาเทคนิคใหม่ๆ เพื่อนำมาประยุกต์ใช้กับระบบ',
      dueDate: getRelativeDate(48),
      priority: 'Medium' as TaskPriority,
    },
    {
      title: 'ออกกำลังกาย 30 นาที & วิ่งรอบสวนสาธารณะ',
      description: 'รักษาสุขภาพและผ่อนคลายสายตาจากการทำงานหน้าจอ',
      dueDate: getRelativeDate(5),
      priority: 'Low' as TaskPriority,
    },
  ];

  for (const task of sampleTasks) {
    await createTask(task);
  }
}
