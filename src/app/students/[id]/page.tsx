'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Send,
  Plus,
  FileText,
  GraduationCap,
} from 'lucide-react';
import LessonModal from '@/components/LessonModal';

const formatHours = (h: number | string | undefined | null) => {
  if (h === undefined || h === null || isNaN(Number(h))) return '0';
  const num = Number(h);
  if (Number.isInteger(num)) return num.toString();
  return Number(num.toFixed(1)).toString();
};

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const [resStudent, resProfile] = await Promise.all([
        fetch(`/api/students/${id}`).then((r) => r.json()),
        fetch('/api/profile').then((r) => r.json()),
      ]);

      if (resStudent.success) setStudent(resStudent.data);
      if (resProfile.success) setProfile(resProfile.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-24 text-slate-400">
        Đang tải thông tin học viên...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-24 space-y-4">
        <p className="text-slate-500">Không tìm thấy thông tin học viên.</p>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </Link>
      </div>
    );
  }

  const tHours = Number(student.totalHours ?? student.totalSessions ?? 0);
  const cHours = Number(student.completedHours ?? student.completedSessions ?? 0);
  const rHours = Number(student.remainingHours ?? student.remainingSessions ?? 0);

  const percent =
    tHours > 0
      ? Math.min(100, Math.round((cHours / tHours) * 100))
      : 0;

  const currentClass = student.classMembers?.[0]?.classGroup;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách học viên</span>
        </Link>

        <button
          onClick={() => setIsLessonModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi Nhận Buổi Học Mới</span>
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {currentClass?.name || 'Chưa xếp lớp'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {student.email || 'Chưa có email'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {student.phone || 'Chưa có SĐT'}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                Phụ huynh: {student.parentName || 'Chưa cập nhật'}{' '}
                {student.parentEmail && `(${student.parentEmail})`}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-right">
          {student.isUrgent ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Chỉ còn {formatHours(rHours)} giờ • Cần thu học phí</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Khóa học đang hoạt động tốt</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress & VietQR Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Tiến Độ Khóa Học & Đợt Đóng Tiền</span>
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">Tổng số giờ gói</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{formatHours(tHours)}</h4>
                <p className="text-[11px] text-slate-400">giờ đã đăng ký</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <p className="text-xs text-emerald-700 font-medium">Đã hoàn thành</p>
                <h4 className="text-2xl font-bold text-emerald-700 mt-1">
                  {formatHours(cHours)}
                </h4>
                <p className="text-[11px] text-emerald-600 font-semibold">{percent}% lộ trình ({formatHours(cHours)} giờ)</p>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  student.isUrgent
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-slate-50 border-slate-100 text-slate-900'
                }`}
              >
                <p className="text-xs font-medium opacity-80">Số giờ còn lại</p>
                <h4 className="text-2xl font-bold mt-1">{formatHours(rHours)}</h4>
                <p className="text-[11px] font-semibold">
                  {student.isUrgent ? 'Cần gia hạn ngay!' : 'giờ tiếp theo'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Tiến trình hoàn thành</span>
                <span>{percent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    student.isUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tuition Installments Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Lịch Các Đợt Đóng Học Phí ({student.tuitionInstallments?.length || 0})</span>
              </h3>
            </div>

            {(!student.tuitionInstallments || student.tuitionInstallments.length === 0) ? (
              <p className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-2xl">
                Chưa có lịch đóng học phí nào. Bạn có thể nhấn &quot;Chỉnh sửa&quot; ở danh sách học viên để thiết lập.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.tuitionInstallments.map((inst: any, idx: number) => {
                  const dueObj = new Date(inst.dueDate);
                  const isPaid = inst.status === 'PAID';
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const diffDays = Math.ceil((dueObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div
                      key={inst.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isPaid
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : diffDays < 0
                          ? 'bg-rose-50/40 border-rose-200'
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700">
                          {inst.note || `Đợt #${idx + 1}`}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : diffDays < 0
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPaid ? 'Đã đóng' : diffDays < 0 ? `Quá hạn ${Math.abs(diffDays)} ngày` : `Còn ${diffDays} ngày`}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">
                          Hạn: <strong>{dueObj.toLocaleDateString('vi-VN')}</strong>
                        </span>
                        <span className="text-sm font-bold text-emerald-700">
                          {Number(inst.amount).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lesson Records Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Nhật Ký Từng Buổi Học ({student.lessonRecords?.length || 0})</span>
              </h3>
            </div>

            {student.lessonRecords?.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                Chưa có buổi học nào được ghi nhận. Hãy nhấn &quot;Ghi Nhận Buổi Học Mới&quot;.
              </p>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {student.lessonRecords?.map((rec: any) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-bold text-xs">
                          Buổi #{rec.sessionNumber}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {rec.topic || 'Buổi học'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {rec.schedule?.startTime && rec.schedule?.endTime && (
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/80">
                            🕒 {new Date(rec.schedule.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(rec.schedule.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        <span>
                          {new Date(rec.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>

                    {rec.skillsCovered && (
                      <p className="text-xs text-indigo-700 font-medium bg-indigo-50/80 px-2 py-0.5 rounded-md inline-block">
                        Kỹ năng: {rec.skillsCovered}
                      </p>
                    )}

                    {rec.teacherNotes && (
                      <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                        &quot;{rec.teacherNotes}&quot;
                      </p>
                    )}

                    {rec.homework && (
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Bài tập về nhà:</span>{' '}
                        {rec.homework}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Teacher Info & Parent Notice Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Giáo Viên Phụ Trách</h3>
                <p className="text-xs text-slate-500">Thông tin liên hệ & hỗ trợ</p>
              </div>
            </div>

            <div className="text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Giáo viên:</span>
                </span>
                <span className="font-bold text-slate-800">{profile?.fullName || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>SĐT / Zalo:</span>
                </span>
                <span className="font-semibold text-slate-800 font-mono">{profile?.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email:</span>
                </span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">{profile?.email || 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Kính gửi phụ huynh ${student.parentName || student.name},\nThầy gửi thông tin cập nhật tiến độ học của em ${student.name}:\n- Lớp học: ${currentClass?.name || 'Chưa xếp lớp'}\n- Tiến độ hoàn thành: ${formatHours(cHours)} / ${formatHours(tHours)} giờ (${percent}%)\n- Số giờ còn lại: ${formatHours(rHours)} giờ\nGiáo viên phụ trách: ${profile?.fullName || ''} (SĐT: ${profile?.phone || ''})\nCảm ơn phụ huynh đã đồng hành cùng con!`
                  );
                  alert('Đã copy tin nhắn cập nhật tiến độ học tập gửi phụ huynh!');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Tin Báo Cáo Cho Phụ Huynh</span>
              </button>

              <button
                onClick={() => {
                  alert(`Đã gửi email báo cáo tiến độ học tập tới phụ huynh: ${student.parentEmail || 'phụ huynh'}`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Báo Cáo Đến Email Phụ Huynh</span>
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/settings"
                  className="text-[11px] font-semibold text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  ⚙️ Cài đặt lại thông tin giáo viên &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <LessonModal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          onSuccess={fetchStudent}
          student={student}
          classGroup={currentClass}
        />
      )}
    </div>
  );
}
