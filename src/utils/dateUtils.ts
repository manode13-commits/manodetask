/**
 * Helper utilities for dates, time formatting, and relative comparisons
 */

export function formatDateTime(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const day = date.getDate().toString().padStart(2, '0');
    const monthNamesThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const month = monthNamesThai[date.getMonth()];
    const year = (date.getFullYear() + 543).toString().slice(-2); // Thai Buddhist era 2 digits
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} • ${hours}:${minutes} น.`;
  } catch {
    return isoString;
  }
}

export function formatDateShort(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes} น.`;

    if (diffDays === 0) return `วันนี้, ${timeStr}`;
    if (diffDays === 1) return `พรุ่งนี้, ${timeStr}`;
    if (diffDays === -1) return `เมื่อวาน, ${timeStr}`;

    const day = date.getDate().toString().padStart(2, '0');
    const monthNamesThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${day} ${monthNamesThai[date.getMonth()]}, ${timeStr}`;
  } catch {
    return isoString;
  }
}

export function getDueStatus(dueDateIso: string, status: 'pending' | 'completed'): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  colorClass: string;
} {
  if (status === 'completed') {
    return {
      label: 'เสร็จสิ้นแล้ว',
      isOverdue: false,
      isToday: false,
      colorClass: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
    };
  }

  const now = new Date();
  const due = new Date(dueDateIso);

  if (isNaN(due.getTime())) {
    return { label: 'ไม่มีกำหนด', isOverdue: false, isToday: false, colorClass: 'text-slate-400 bg-[#1A1D24] border-[#2D3139]' };
  }

  const isOverdue = due.getTime() < now.getTime();
  
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const isToday = due >= todayStart && due <= todayEnd;

  if (isOverdue) {
    return {
      label: 'เกินกำหนดส่ง',
      isOverdue: true,
      isToday,
      colorClass: 'text-rose-400 bg-rose-950/40 border-rose-800/50 font-medium',
    };
  }

  if (isToday) {
    return {
      label: 'ครบกำหนดวันนี้',
      isOverdue: false,
      isToday: true,
      colorClass: 'text-amber-400 bg-amber-950/40 border-amber-800/50 font-medium',
    };
  }

  const tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);
  if (due <= tomorrowEnd) {
    return {
      label: 'ครบกำหนดพรุ่งนี้',
      isOverdue: false,
      isToday: false,
      colorClass: 'text-blue-400 bg-blue-950/40 border-blue-800/50',
    };
  }

  return {
    label: 'กำลังจะมาถึง',
    isOverdue: false,
    isToday: false,
    colorClass: 'text-slate-300 bg-[#1A1D24] border-[#2D3139]',
  };
}

/**
 * Returns YYYY-MM-DDTHH:mm string suited for <input type="datetime-local">
 */
export function getDefaultDueDateTime(): string {
  const d = new Date();
  d.setHours(d.getHours() + 3);
  d.setMinutes(0, 0, 0);
  
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
