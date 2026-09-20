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
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Send,
  Plus,
  GraduationCap,
  Printer,
  Edit,
  Trash2,
  Save,
  X,
  ArrowUpDown,
  CreditCard,
  FileSpreadsheet,
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
  const [selectedScheduleForModal, setSelectedScheduleForModal] = useState<any>(null);

  // Sorting: Buổi 1 -> N (mặc định tăng dần) hoặc Mới nhất trước
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Edit Lesson Record Modal State
  const [isEditingLesson, setIsEditingLesson] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editTopic, setEditTopic] = useState<string>('');
  const [editHours, setEditHours] = useState<string>('1.5');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editAttendance, setEditAttendance] = useState<string>('PRESENT');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

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
      <div className="p-8 max-w-6xl mx-auto text-center py-24 text-slate-400">
        Đang tải thông tin học viên...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center py-24 space-y-4">
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
  const rate = Number(student.pricePerHour || student.activeEnrollment?.pricePerSession || 250000);
  const totalTuition = Math.round(tHours * rate);

  const percent =
    tHours > 0
      ? Math.min(100, Math.round((cHours / tHours) * 100))
      : 0;

  const currentClass = student.classMembers?.[0]?.classGroup;
  const courseTitle = currentClass?.course?.title || currentClass?.name || 'Khóa học';

  // Format date: e.g. "Thứ 5, 16/07/2026"
  const formatSessionDate = (d: string | Date | null | undefined) => {
    if (!d) return '-';
    const dateObj = new Date(d);
    return dateObj.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatSessionTime = (rec: any) => {
    if (rec.schedule?.startTime) {
      const s = new Date(rec.schedule.startTime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      if (rec.schedule?.endTime) {
        const e = new Date(rec.schedule.endTime).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${s} - ${e}`;
      }
      return s;
    }
    if (rec.date) {
      return new Date(rec.date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return '-';
  };

  // Danh sách buổi học đã ghi nhận
  const lessonRecords = student.lessonRecords || [];
  const sortedRecords = [...lessonRecords].sort((a: any, b: any) => {
    if (sortAsc) {
      return (a.sessionNumber || 0) - (b.sessionNumber || 0);
    }
    return (b.sessionNumber || 0) - (a.sessionNumber || 0);
  });

  // Quick edit record handlers
  const handleOpenEditRecord = (rec: any) => {
    setEditingRecord(rec);
    setEditTopic(rec.topic || '');
    setEditHours(rec.durationHours ? rec.durationHours.toString() : '1.5');
    setEditNotes(rec.teacherNotes || '');
    setEditAttendance(rec.attendance || 'PRESENT');
    setIsEditingLesson(true);
  };

  const handleSaveEditRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      setIsSavingEdit(true);
      const res = await fetch('/api/lessons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRecord.id,
          topic: editTopic,
          durationHours: parseFloat(editHours) || 0,
          teacherNotes: editNotes,
          attendance: editAttendance,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditingLesson(false);
        setEditingRecord(null);
        fetchStudent();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi cập nhật buổi học: ' + err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteRecord = async (recId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản ghi buổi học này?')) return;
    try {
      const res = await fetch(`/api/lessons?id=${recId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchStudent();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Copy structured text report for Parents / Zalo
  const handleCopyTableReport = () => {
    let report = `=================================================\n`;
    report += `NHẬT KÝ TIẾN ĐỘ HỌC TẬP - ${student.name.toUpperCase()}\n`;
    report += `Khóa học: ${courseTitle} | Tổng gói: ${formatHours(tHours)} giờ\n`;
    report += `Đã hoàn thành: ${formatHours(cHours)} giờ (${percent}%) | Còn lại: ${formatHours(rHours)} giờ\n`;
    report += `=================================================\n`;
    report += `Buổi | Ngày học | Khung giờ | Thời lượng | Bài học | Nhận xét\n`;
    report += `-------------------------------------------------\n`;
    sortedRecords.forEach((r: any) => {
      report += `#${r.sessionNumber} | ${formatSessionDate(r.date)} | ${formatSessionTime(r)} | ${formatHours(r.durationHours)}h | ${r.topic || '-'} | ${r.teacherNotes || '-'}\n`;
    });
    report += `=================================================\n`;
    report += `Học phí theo giờ: ${rate.toLocaleString('vi-VN')} đ/giờ\n`;
    report += `Tổng học phí: ${totalTuition.toLocaleString('vi-VN')} đ\n`;
    if (student.tuitionInstallments && student.tuitionInstallments.length > 0) {
      report += `-------------------------------------------------\n`;
      student.tuitionInstallments.forEach((inst: any, idx: number) => {
        report += `Đợt ${idx + 1}: ${Number(inst.amount).toLocaleString('vi-VN')} đ (Hạn: ${new Date(inst.dueDate).toLocaleDateString('vi-VN')}) - ${inst.status === 'PAID' ? 'Đã đóng' : 'Chưa đóng'}\n`;
      });
    }
    report += `=================================================\n`;
    report += `Giáo viên phụ trách: ${profile?.fullName || ''} (SĐT: ${profile?.phone || ''})\n`;
    navigator.clipboard.writeText(report);
    alert('Đã sao chép bảng điểm danh & tiến độ học tập vào clipboard!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Bar - No Print */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách học viên</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all border border-slate-200 shadow-sm"
            title="In bảng điểm danh"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">In Bảng</span>
          </button>

          <button
            onClick={handleCopyTableReport}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all border border-slate-200 shadow-sm"
            title="Sao chép báo cáo gửi phụ huynh"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Copy Báo Cáo</span>
          </button>

          <button
            onClick={() => {
              setSelectedScheduleForModal(null);
              setIsLessonModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ghi Nhận Buổi Học</span>
          </button>
        </div>
      </div>

      {/* Header Profile Card - No Print */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentClass?.name || 'Chưa xếp lớp'}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {student.phone || 'Chưa có SĐT'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {student.email || 'Chưa có email'}
              </span>
              <span className="font-medium text-slate-700">
                Phụ huynh: {student.parentName || 'Chưa cập nhật'}{' '}
                {student.parentEmail && `(${student.parentEmail})`}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-right">
          {student.isUrgent ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Chỉ còn {formatHours(rHours)} giờ • Cần thu học phí</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Khóa học đang hoạt động tốt</span>
            </div>
          )}
        </div>
      </div>

      {/* BẢNG ĐIỂM DANH & NHẬT KÝ KHÓA HỌC (THIẾT KẾ HIỆN ĐẠI, DỄ NHÌN) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        {/* Header Thanh Tiêu Đề Bảng */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Nhật Ký Từng Buổi Học & Điểm Danh
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px]">
                {sortedRecords.length} buổi đã học
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Khóa học: <strong className="text-slate-800">{courseTitle}</strong> • Học viên: <strong className="text-slate-800">{student.name}</strong> ({formatHours(tHours)} giờ)
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-200 shadow-sm"
              title="Đổi thứ tự sắp xếp buổi học"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>{sortAsc ? 'Thứ tự: Buổi 1 ➔ N' : 'Thứ tự: Mới nhất trước'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedScheduleForModal(null);
                setIsLessonModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buổi học</span>
            </button>
          </div>
        </div>

        {/* Bảng Dữ Liệu Các Buổi Học */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4 w-16 text-center">Buổi</th>
                <th className="py-3 px-4 w-36">Ngày Học</th>
                <th className="py-3 px-4 w-28">Khung Giờ</th>
                <th className="py-3 px-4 w-24 text-center">Thời Lượng</th>
                <th className="py-3 px-4">Nội Dung Bài Học</th>
                <th className="py-3 px-4 w-60">Ghi Chú / Nhận Xét</th>
                <th className="py-3 px-4 w-20 text-center no-print">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                    Chưa có buổi học nào được ghi nhận cho học viên này.
                  </td>
                </tr>
              ) : (
                sortedRecords.map((rec: any, index: number) => {
                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Số Buổi */}
                      <td className="py-3 px-4 text-center align-middle">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200/80">
                          #{rec.sessionNumber || index + 1}
                        </span>
                      </td>

                      {/* Ngày học */}
                      <td className="py-3 px-4 font-medium text-slate-800 align-middle whitespace-nowrap">
                        {formatSessionDate(rec.date)}
                      </td>

                      {/* Khung giờ */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 align-middle whitespace-nowrap">
                        {formatSessionTime(rec)}
                      </td>

                      {/* Thời lượng */}
                      <td className="py-3 px-4 text-center align-middle whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/70 text-[11px]">
                          {formatHours(rec.durationHours)} giờ
                        </span>
                      </td>

                      {/* Nội dung bài học */}
                      <td className="py-3 px-4 align-middle">
                        <div className="font-semibold text-slate-900 text-xs">
                          {rec.topic || 'Buổi học'}
                        </div>
                        {rec.skillsCovered && (
                          <span className="inline-block mt-0.5 text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100/80">
                            {rec.skillsCovered}
                          </span>
                        )}
                      </td>

                      {/* Ghi chú / Nhận xét */}
                      <td className="py-3 px-4 text-slate-600 align-middle text-xs">
                        {rec.teacherNotes ? (
                          <span className="text-slate-700">{rec.teacherNotes}</span>
                        ) : (
                          <span className="text-slate-300 italic">-</span>
                        )}
                        {rec.homework && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            BTVN: {rec.homework}
                          </div>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-center align-middle no-print">
                        <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditRecord(rec)}
                            className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Sửa buổi học"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Xóa buổi này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* KHỐI TỔNG KẾT DƯỚI BẢNG (RÕ RÀNG, ĐẸP MẮT, DỄ NHÌN) */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Tổng Kết Quỹ Giờ Học */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Tổng Kết Giờ Học
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Tổng số giờ gói:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {formatHours(tHours)} giờ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Số giờ đã học:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">
                    {formatHours(cHours)} giờ
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">Số giờ còn lại:</span>
                  <span
                    className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                      student.isUrgent
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {formatHours(rHours)} giờ
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Tiến độ hoàn thành</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      student.isUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Tổng Kết Học Phí */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Học Phí Khóa Học
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Đơn giá / 1 giờ:</span>
                  <span className="font-bold text-slate-800">
                    {rate.toLocaleString('vi-VN')} đ / giờ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Số giờ đăng ký:</span>
                  <span className="font-medium text-slate-800">
                    {formatHours(tHours)} giờ
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="font-bold text-slate-900">Tổng học phí dự kiến:</span>
                  <span className="font-black text-indigo-700 text-base">
                    {totalTuition.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1">
                * Học phí được tính tự động: Tổng số giờ × Đơn giá/giờ
              </p>
            </div>

            {/* 3. Lịch Các Đợt Đóng Học Phí */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Các Đợt Đóng Học Phí ({student.tuitionInstallments?.length || 0})
                  </h4>
                </div>
              </div>

              {student.tuitionInstallments && student.tuitionInstallments.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {student.tuitionInstallments.map((inst: any, idx: number) => {
                    const isPaid = inst.status === 'PAID';
                    const dueDateFormatted = new Date(inst.dueDate).toLocaleDateString('vi-VN');

                    return (
                      <div
                        key={inst.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          isPaid
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-amber-50/40 border-amber-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-800">
                            {inst.note || `Đợt #${idx + 1}`}:{' '}
                            <span className="text-emerald-700 font-extrabold">
                              {Number(inst.amount).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Hạn: <strong>{dueDateFormatted}</strong>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isPaid ? 'Đã đóng' : 'Chưa đóng'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  Chưa có lịch chia đợt đóng học phí.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin giáo viên & Nút gửi báo cáo - No Print */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">
              Giáo viên phụ trách: {profile?.fullName || 'Nguyễn Đình Linh'}
            </h4>
            <p className="text-xs text-slate-500">
              SĐT/Zalo: <strong>{profile?.phone || 'Chưa cập nhật'}</strong> • Email: {profile?.email || 'Chưa cập nhật'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `Kính gửi phụ huynh ${student.parentName || student.name},\nThầy gửi thông tin cập nhật tiến độ học của em ${student.name}:\n- Lớp học: ${currentClass?.name || 'Chưa xếp lớp'}\n- Tiến độ hoàn thành: ${formatHours(cHours)} / ${formatHours(tHours)} giờ (${percent}%)\n- Số giờ còn lại: ${formatHours(rHours)} giờ\nGiáo viên phụ trách: ${profile?.fullName || ''} (SĐT: ${profile?.phone || ''})\nCảm ơn phụ huynh đã đồng hành cùng con!`
              );
              alert('Đã copy tin nhắn cập nhật tiến độ học tập gửi phụ huynh!');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Tin Báo Cáo Phụ Huynh</span>
          </button>

          <button
            onClick={() => {
              alert(`Đã gửi email báo cáo tiến độ học tập tới phụ huynh: ${student.parentEmail || 'phụ huynh'}`);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi Email Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Modal Chỉnh Sửa Buổi Học Nhanh */}
      {isEditingLesson && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit className="w-4 h-4 text-indigo-600" />
                <span>Chỉnh Sửa Buổi #{editingRecord.sessionNumber}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingLesson(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội Dung Bài Học (Lesson Topic) *
                </label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thời Lượng Học (Giờ)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ghi Chú / Nhận Xét (Note)
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Nhận xét buổi học, bài tập..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingLesson(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingEdit ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal for Recording New Lesson */}
      {isLessonModalOpen && (
        <LessonModal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          onSuccess={fetchStudent}
          student={student}
          classGroup={currentClass}
          schedule={selectedScheduleForModal}
        />
      )}
    </div>
  );
}
