'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Users,
  GraduationCap,
  CreditCard,
  LayoutDashboard,
  Settings,
  BookOpen,
  Clock,
  Sparkles,
} from 'lucide-react';

const navigation = [
  { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
  { name: 'Thời khóa biểu', href: '/calendar', icon: Calendar },
  { name: 'Học viên & Tiến độ', href: '/students', icon: Users },
  { name: 'Lớp học & Khóa học', href: '/classes', icon: BookOpen },
  { name: 'Theo dõi Học phí', href: '/tuition', icon: CreditCard },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-none tracking-tight">TutorFlow</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý lớp & Lịch học</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Status Card */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Thông minh & Tự động</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Tự động trừ số buổi, cảnh báo học phí và đồng bộ lịch học Google Calendar.
        </p>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950/30">
        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm">
          NL
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">Nguyễn Đình Linh</p>
          <p className="text-[11px] text-slate-400 truncate">Giáo viên & Văn phòng ANEX</p>
        </div>
      </div>
    </aside>
  );
}
