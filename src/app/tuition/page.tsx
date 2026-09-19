'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Copy,
  Settings,
  Sparkles,
  User,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';

const formatHours = (h: number | string | undefined | null) => {
  if (h === undefined || h === null || isNaN(Number(h))) return '0';
  const num = Number(h);
  if (Number.isInteger(num)) return num.toString();
  return Number(num.toFixed(1)).toString();
};

export default function TuitionPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected student for QR view
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStudents, resProfile] = await Promise.all([
        fetch('/api/students').then((r) => r.json()),
        fetch('/api/profile').then((r) => r.json()),
      ]);

      if (resStudents.success) {
        setStudents(resStudents.data);
        const urgent = resStudents.data.find((s: any) => s.isUrgent);
        if (urgent) setSelectedStudent(urgent);
        else if (resStudents.data.length > 0) setSelectedStudent(resStudents.data[0]);
      }
      if (resProfile.success) setProfile(resProfile.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const urgentStudents = students.filter((s) => s.isUrgent);
  const normalStudents = students.filter((s) => !s.isUrgent);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Theo Dõi Học Phí Học Viên
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tự động phát hiện học viên sắp hết giờ học (≤3 giờ) và theo dõi các đợt đóng học phí
          </p>
        </div>

        <Link
          href="/settings"
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Cài đặt Giáo viên</span>
        </Link>
      </div>

      {/* Main Grid: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Urgent List & All Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Box */}
          <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  Cần Thu Học Phí Đợt Mới ({urgentStudents.length} học viên)
                </h2>
                <p className="text-xs text-slate-500">
                  Số giờ học còn lại ≤ 3 giờ. Nhấn vào học viên để xem chi tiết và gửi thông báo nhắc học phí.
                </p>
              </div>
            </div>

            {urgentStudents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Tất cả học viên đều còn nhiều buổi học.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {urgentStudents.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStudent(st)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedStudent?.id === st.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{st.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {st.classMembers?.[0]?.classGroup?.name || 'Khóa học'}
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold">
                        Còn {formatHours(st.remainingHours ?? st.remainingSessions)} giờ
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Đã học: {formatHours(st.completedHours ?? st.completedSessions)}/{formatHours(st.totalHours ?? st.totalSessions)} giờ
                      </span>
                      <span className="font-bold text-emerald-600">
                        {(st.nextCycleFee || 6000000).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Normal Students */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Tất Cả Học Viên Đang Theo Học
            </h3>

            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {students.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`py-3 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    selectedStudent?.id === st.id ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                      {st.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{st.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {st.classMembers?.[0]?.classGroup?.name || 'Chưa xếp lớp'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500">
                      Còn {formatHours(st.remainingHours ?? st.remainingSessions)} giờ
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        st.isUrgent
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {st.isUrgent ? 'Cần thu' : 'Đầy đủ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tuition Detail & Reminder Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 sticky top-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Thông Tin Học Phí
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent ? (
                    <>Học viên: <span className="font-bold text-slate-800">{selectedStudent.name}</span></>
                  ) : (
                    'Chọn học viên để xem'
                  )}
                </p>
              </div>
            </div>

            {selectedStudent ? (
              <div className="space-y-4">
                {/* Gói giờ & Số giờ còn lại */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Lớp đang học:</span>
                    <span className="font-bold text-slate-800">
                      {selectedStudent.classMembers?.[0]?.classGroup?.name || 'Chưa xếp lớp'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Tiến độ đã học:</span>
                    <span className="font-semibold text-slate-800">
                      {formatHours(selectedStudent.completedHours ?? selectedStudent.completedSessions)} / {formatHours(selectedStudent.totalHours ?? selectedStudent.totalSessions)} giờ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Số giờ còn lại:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      Number(selectedStudent.remainingHours ?? selectedStudent.remainingSessions) <= 3
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Còn {formatHours(selectedStudent.remainingHours ?? selectedStudent.remainingSessions)} giờ
                    </span>
                  </div>
                </div>

                {/* Đợt học phí */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800 font-medium">Học phí đợt tới:</span>
                    <span className="font-bold text-emerald-700 text-base">
                      {Number(selectedStudent.nextInstallment?.amount || selectedStudent.nextCycleFee || 6000000).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  {selectedStudent.nextInstallment && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Hạn đóng:</span>
                      <span className="font-semibold">
                        {new Date(selectedStudent.nextInstallment.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                  {selectedStudent.parentName && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Phụ huynh:</span>
                      <span className="font-semibold">{selectedStudent.parentName}</span>
                    </div>
                  )}
                </div>

                {/* Teacher contact */}
                {profile && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <p className="font-semibold text-slate-700">Giáo viên phụ trách:</p>
                    <div className="flex justify-between text-slate-600">
                      <span>Họ tên:</span>
                      <span className="font-medium text-slate-800">{profile.fullName || 'Thầy Linh'}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex justify-between text-slate-600">
                        <span>SĐT / Zalo:</span>
                        <span className="font-mono font-medium text-slate-800">{profile.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      const amount = selectedStudent.nextInstallment?.amount || selectedStudent.nextCycleFee || 6000000;
                      const rH = formatHours(selectedStudent.remainingHours ?? selectedStudent.remainingSessions);
                      navigator.clipboard.writeText(
                        `Kính gửi phụ huynh ${selectedStudent.parentName || selectedStudent.name},\nKhóa học của em ${selectedStudent.name} hiện còn ${rH} giờ. Thầy gửi thông báo học phí đợt tiếp theo:\n- Số tiền: ${Number(amount).toLocaleString('vi-VN')} VNĐ\n- Giáo viên phụ trách: ${profile?.fullName || ''} (SĐT: ${profile?.phone || ''})\nTrân trọng cảm ơn!`
                      );
                      alert('Đã copy tin nhắn thông báo học phí gửi phụ huynh!');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Tin Nhắn Báo Phụ Huynh</span>
                  </button>

                  <Link
                    href={`/students/${selectedStudent.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <span>Xem Hồ Sơ & Lịch Học Viên</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Chọn một học viên từ danh sách bên trái để xem chi tiết học phí.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
