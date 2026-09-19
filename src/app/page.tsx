'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  ChevronRight,
  BookOpen,
  CreditCard,
} from 'lucide-react';
import LessonModal from '@/components/LessonModal';

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStudents, resSchedules, resClasses] = await Promise.all([
        fetch('/api/students').then((r) => r.json()),
        fetch('/api/schedules').then((r) => r.json()),
        fetch('/api/classes').then((r) => r.json()),
      ]);

      if (resStudents.success) setStudents(resStudents.data);
      if (resSchedules.success) setSchedules(resSchedules.data);
      if (resClasses.success) setClasses(resClasses.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Đang tải bảng điều khiển TutorFlow...</p>
        </div>
      </div>
    );
  }

  // Filter urgent students (<= 2 sessions remaining)
  const urgentStudents = students.filter((s) => s.isUrgent);

  // Filter today's schedules
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySchedules = schedules.filter((s) => {
    return s.startTime.startsWith(todayStr);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ thống Quản lý Lớp học & Lịch dạy Thông minh</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Xin chào, Thầy Đình Linh 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Hôm nay bạn có{' '}
            <span className="text-emerald-400 font-semibold">{todaySchedules.length} ca</span> (bao gồm lịch dạy và văn phòng ANEX). Có{' '}
            <span className="text-amber-400 font-semibold">{urgentStudents.length} học viên</span> cần gia hạn học phí đợt tiếp theo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/calendar"
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>Xem Thời Khóa Biểu</span>
          </Link>
          <Link
            href="/tuition"
            className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm flex items-center gap-2 border border-slate-700 transition-all"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Thu Học Phí</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Học viên đang học</p>
            <h3 className="text-2xl font-bold text-slate-900">{students.length}</h3>
            <p className="text-[11px] text-emerald-600 font-medium">100% đang hoạt động</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Ca lịch hôm nay</p>
            <h3 className="text-2xl font-bold text-slate-900">{todaySchedules.length}</h3>
            <p className="text-[11px] text-indigo-600 font-medium">Xem trên lịch tuần</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Số lớp & nhóm ca</p>
            <h3 className="text-2xl font-bold text-slate-900">{classes.length}</h3>
            <p className="text-[11px] text-slate-400">IELTS, C1, B2, B1, G6...</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-800">Cần thu học phí (≤3 giờ)</p>
            <h3 className="text-2xl font-bold text-amber-900">{urgentStudents.length}</h3>
            <Link href="/tuition" className="text-[11px] text-amber-700 font-semibold hover:underline">
              Xem danh sách &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Urgent Tuition Alert Box */}
      {urgentStudents.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Cảnh Báo Tự Động: Học Viên Sắp Hết Gói Học
                </h2>
                <p className="text-xs text-slate-600">
                  Hệ thống tự động phát hiện số giờ học còn lại ≤ 3 giờ. Bạn có thể nhấn để xem chi tiết và gửi thông báo cho phụ huynh.
                </p>
              </div>
            </div>
            <Link
              href="/tuition"
              className="text-xs font-bold text-amber-800 bg-amber-200/80 px-4 py-2 rounded-xl hover:bg-amber-300 transition-colors flex items-center gap-1.5"
            >
              <span>Xem tất cả ({urgentStudents.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentStudents.map((st) => (
              <div
                key={st.id}
                className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{st.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[11px] font-bold">
                      Còn {st.remainingHours ?? st.remainingSessions} giờ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Đã học: <span className="font-semibold">{st.completedHours ?? st.completedSessions}</span>/{st.totalHours ?? st.totalSessions} giờ
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Phụ huynh: {st.parentName || 'Chưa cập nhật'}
                  </p>
                </div>
                <Link
                  href={`/students/${st.id}`}
                  className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-colors"
                  title="Xem hồ sơ học viên"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Today's Schedule & Quick Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-base">Lịch Dạy & Công Việc Hôm Nay</h2>
            </div>
            <Link
              href="/calendar"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Xem toàn bộ lịch tuần</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm">Hôm nay không có ca dạy nào hoặc đã hoàn thành.</p>
              <Link
                href="/calendar"
                className="inline-block text-xs text-emerald-600 font-semibold hover:underline"
              >
                Mở thời khóa biểu tuần &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedules.map((sc) => {
                const startTime = new Date(sc.startTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const endTime = new Date(sc.endTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={sc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-2.5 h-12 rounded-full"
                        style={{ backgroundColor: sc.classGroup?.color || '#3b82f6' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{sc.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sc.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {sc.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Sắp diễn ra'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-slate-700">
                            {startTime} - {endTime}
                          </span>
                          <span>•</span>
                          <span>{sc.classGroup?.locationOrLink || 'Google Meet'}</span>
                        </p>
                      </div>
                    </div>

                    {sc.classGroup?.category !== 'OFFICE' && (
                      <button
                        onClick={() => {
                          setSelectedSchedule(sc);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Điểm danh & Ghi tiến độ</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Classes Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-base">Nhóm Lớp Hoạt Động</h2>
            </div>
            <Link
              href="/classes"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Tất cả
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {classes.slice(0, 7).map((cls) => (
              <div
                key={cls.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cls.color || '#3b82f6' }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {cls.members?.length || 0} học viên • {cls.locationOrLink || 'Meet'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  {cls.category === 'OFFICE' ? 'Văn phòng' : 'Gia sư'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      {isModalOpen && (
        <LessonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
          schedule={selectedSchedule}
        />
      )}
    </div>
  );
}
