import React, { useState, useEffect } from 'react';
import { UserCheck, Award, Shield, Sparkles, Upload, RefreshCw } from 'lucide-react';

interface CreatorCardProps {
  compact?: boolean;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ compact = false }) => {
  const [customAvatar, setCustomAvatar] = useState<string | null>(() => {
    return localStorage.getItem('creator_custom_avatar') || null;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setCustomAvatar(base64);
          localStorage.setItem('creator_custom_avatar', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAvatarContent = (sizeClass: string, isPortrait: boolean = false) => {
    const shapeClass = isPortrait ? 'rounded-xl' : 'rounded-full';

    if (customAvatar) {
      return (
        <img
          src={customAvatar}
          alt="นายมาโนช บุญเพ็ง - ผู้จัดทำ"
          referrerPolicy="no-referrer"
          className={`${sizeClass} ${shapeClass} object-cover object-top border-2 border-purple-500/60 shadow-lg`}
        />
      );
    }

    return (
      <div className={`relative ${sizeClass} ${shapeClass} overflow-hidden border-2 border-purple-500/50 bg-[#161A24] shadow-lg flex items-center justify-center flex-shrink-0 group`}>
        {/* Custom SVG Avatar matching the uploaded photo */}
        <svg viewBox="0 0 100 133" className="w-full h-full object-cover">
          {/* Background gradient */}
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E2230" />
              <stop offset="100%" stopColor="#0F1117" />
            </linearGradient>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#181A20" />
              <stop offset="100%" stopColor="#0B0C0E" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2A77A" />
              <stop offset="100%" stopColor="#C9885C" />
            </linearGradient>
            <linearGradient id="purpleCollar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#5B21B6" />
            </linearGradient>
          </defs>
          <rect width="100" height="133" fill="url(#bgGrad)" />

          {/* Shoulders & Dark Suit Jacket */}
          <path d="M 8 133 C 12 95 25 85 50 85 C 75 85 88 95 92 133 Z" fill="url(#suitGrad)" />
          
          {/* White inner shirt */}
          <polygon points="37,85 63,85 56,125 44,125" fill="#F8FAFC" />

          {/* Purple Polo Collar */}
          <polygon points="38,82 50,98 34,95" fill="url(#purpleCollar)" />
          <polygon points="62,82 50,98 66,95" fill="url(#purpleCollar)" />
          <polygon points="46,95 54,95 52,118 48,118" fill="url(#purpleCollar)" />

          {/* Suit Lapels */}
          <polygon points="20,88 38,118 25,133 8,133" fill="#242833" />
          <polygon points="80,88 62,118 75,133 92,133" fill="#242833" />

          {/* Organization Badge / Pin on Left Chest */}
          <circle cx="73" cy="98" r="6" fill="#3B82F6" stroke="#93C5FD" strokeWidth="0.8" />
          <circle cx="73" cy="98" r="4.2" fill="#FEF08A" opacity="0.85" />

          {/* Neck */}
          <rect x="42" y="60" width="16" height="26" rx="2" fill="url(#skinGrad)" />

          {/* Head / Face */}
          <ellipse cx="50" cy="48" rx="19" ry="22" fill="url(#skinGrad)" />

          {/* Hair */}
          <path d="M 30 45 C 29 28 39 20 50 20 C 61 20 71 28 70 45 C 65 33 59 29 50 30 C 41 29 35 33 30 45 Z" fill="#171717" />
          <path d="M 31 40 C 35 32 44 32 48 37 C 52 32 63 32 69 41 C 67 46 64 50 64 54 C 70 44 67 27 50 25 C 33 27 30 40 31 40 Z" fill="#111215" />

          {/* Eyebrows & Eyes */}
          <path d="M 38 43 Q 43 41 46 43" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M 54 43 Q 57 41 62 43" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="42" cy="47" r="2.2" fill="#111827" />
          <circle cx="58" cy="47" r="2.2" fill="#111827" />
          <circle cx="42.6" cy="46.3" r="0.7" fill="#FFF" />
          <circle cx="58.6" cy="46.3" r="0.7" fill="#FFF" />

          {/* Nose & Smile */}
          <path d="M 48 51 Q 50 56 52 51" stroke="#B45309" strokeWidth="1.3" fill="none" />
          <path d="M 43 59 Q 50 64 57 59" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Ears */}
          <circle cx="31" cy="48" r="3.5" fill="url(#skinGrad)" />
          <circle cx="69" cy="48" r="3.5" fill="url(#skinGrad)" />
        </svg>

        {/* Hover overlay hint */}
        <label 
          htmlFor="upload-creator-avatar" 
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-white cursor-pointer transition-opacity text-center p-1"
          title="คลิกเพื่ออัปโหลดหรือเปลี่ยนรูปโปรไฟล์"
        >
          <Upload className="w-3.5 h-3.5 mb-1" />
          <span>เปลี่ยนรูป</span>
        </label>
      </div>
    );
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-[#12141A] border border-[#2D3139] shadow-xs">
        <input
          id="upload-creator-avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {renderAvatarContent('w-8 h-8')}
        <div className="text-left">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider flex items-center gap-0.5">
              <Award className="w-2.5 h-2.5" /> ผู้จัดทำ
            </span>
          </div>
          <p className="text-xs font-semibold text-[#F8FAFC] leading-none mt-0.5">
            นายมาโนช บุญเพ็ง
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#161920] rounded-2xl border border-[#2D3139] p-5 sm:p-6 shadow-md relative overflow-hidden">
      <input
        id="upload-creator-avatar"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 relative z-10">
        {/* Avatar (Width 3cm x Height 4cm) */}
        <div className="relative flex-shrink-0">
          {renderAvatarContent('w-[3cm] h-[4cm] min-w-[3cm] min-h-[4cm]', true)}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#161920] flex items-center justify-center text-white shadow-sm" title="สถานะพร้อมใช้งาน">
            <UserCheck className="w-3 h-3 stroke-[3]" />
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60">
              <Award className="w-3.5 h-3.5" />
              <span>ผู้จัดทำระบบ (System Author)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-950/40 text-blue-300 border border-blue-800/40">
              <Shield className="w-3 h-3" />
              <span>Personal Task Tracker</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight">
            นายมาโนช บุญเพ็ง
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-xl">
            ผู้พัฒนาและจัดทำระบบจัดการตารางงานและเส้นเวลาส่วนบุคคล (Personal Task & Timeline Tracker) เชื่อมต่อระบบฐานข้อมูล Cloud Firestore แบบ Real-time
          </p>

          <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
            <label
              htmlFor="upload-creator-avatar"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12141A] hover:bg-[#202530] text-slate-300 border border-[#2D3139] hover:border-purple-500/50 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>{customAvatar ? 'เปลี่ยนรูปภาพโปรไฟล์' : 'อัปโหลดรูปภาพโปรไฟล์'}</span>
            </label>
            {customAvatar && (
              <button
                onClick={() => {
                  setCustomAvatar(null);
                  localStorage.removeItem('creator_custom_avatar');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#242830] transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>รีเซ็ตเป็นรูปเริ่มต้น</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
