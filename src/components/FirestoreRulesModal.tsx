import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, Lock, Database, Info, ExternalLink } from 'lucide-react';

interface FirestoreRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirestoreRulesModal: React.FC<FirestoreRulesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const personalRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // กฎสำหรับ Personal Task Tracker
    match /tasks/{taskId} {
      allow read, write: if true;
    }
  }
}`;

  const authPersonalRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // อนุญาตเฉพาะผู้ใช้ที่เข้าสู่ระบบเท่านั้น
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
  }
}`;

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      id="firestore-rules-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="firestore-rules-modal-content"
        className="bg-[#161920] w-full max-w-2xl rounded-2xl border border-[#2D3139] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2D3139] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                คู่มือการตั้งค่า Firestore Database Rules
              </h2>
              <p className="text-xs text-slate-400">
                สำหรับ Personal Task & Timeline Tracker (ใช้งานคนเดียว)
              </p>
            </div>
          </div>
          <button
            id="btn-close-rules-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#242830] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm text-slate-300">
          {/* Step by step guide */}
          <div className="bg-[#12141A] p-4 rounded-xl border border-[#2D3139] space-y-2">
            <h3 className="font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>3 ขั้นตอนการตั้งค่าใน Firebase Console</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-300 pl-1">
              <li>เปิด <strong>Firebase Console</strong> และเลือก Project ของคุณ</li>
              <li>ไปที่เมนู <strong>Build &gt; Firestore Database &gt; แท็บ Rules</strong></li>
              <li>วางโค้ด Security Rules ด้านล่างนี้ แล้วกดปุ่ม <strong>Publish</strong></li>
            </ol>
          </div>

          {/* Option 1: Direct Personal / Quick Test */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  แบบที่ 1: แบบเข้าถึงตรง (Single-user / Prototyping)
                </span>
                <p className="text-xs text-slate-400">
                  เหมาะสำหรับการใช้งานคนเดียวแบบรวดเร็วโดยไม่ต้อง Sign-in
                </p>
              </div>
              <button
                id="btn-copy-rule-1"
                onClick={() => handleCopy(personalRules, 1)}
                className="px-2.5 py-1 text-xs font-medium bg-[#1E222B] hover:bg-[#282E3A] text-slate-200 border border-[#2D3139] rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#0D0F13] border border-[#242830] text-emerald-300 rounded-xl text-xs font-mono overflow-x-auto">
              <code>{personalRules}</code>
            </pre>
          </div>

          {/* Option 2: Auth-Protected */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  แบบที่ 2: แบบป้องกันด้วย Firebase Auth
                </span>
                <p className="text-xs text-slate-400">
                  หากต้องการเพิ่มความปลอดภัย อนุญาตเฉพาะผู้ใช้ที่ Login ผ่านระบบเท่านั้น
                </p>
              </div>
              <button
                id="btn-copy-rule-2"
                onClick={() => handleCopy(authPersonalRules, 2)}
                className="px-2.5 py-1 text-xs font-medium bg-[#1E222B] hover:bg-[#282E3A] text-slate-200 border border-[#2D3139] rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 2 ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#0D0F13] border border-[#242830] text-blue-300 rounded-xl text-xs font-mono overflow-x-auto">
              <code>{authPersonalRules}</code>
            </pre>
          </div>

          {/* Tips Info */}
          <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-start gap-2.5 text-xs text-blue-200">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">คำแนะนำการใช้งานจริง:</span> แอปนี้ตั้งค่าเชื่อมต่อกับ Firestore Collection ชื่อ <code className="font-mono bg-blue-900/60 px-1 py-0.5 rounded text-blue-200 border border-blue-700/50">tasks</code> พร้อมระบบ Realtime Listener (<code className="font-mono bg-blue-900/60 px-1 py-0.5 rounded text-blue-200 border border-blue-700/50">onSnapshot</code>) ทำให้ทุกการเพิ่ม, แก้ไข, ลบ หรือ Mark as Done ซิงค์กับฐานข้อมูลทันทีแบบเรียลไทม์
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#2D3139] bg-[#12141A] flex justify-end">
          <button
            id="btn-close-rules-dialog"
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors border border-blue-400/30"
          >
            เข้าใจแล้ว / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
