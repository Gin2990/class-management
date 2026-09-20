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
  CheckSquare,
  Square,
  Printer,
  Edit,
  Trash2,
  Save,
  X,
  FileSpreadsheet,
  ArrowUpDown,
  Check,
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

  // Sorting for Attendance Table (default: Buổi 1 -> N like Excel sheet)
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
  const courseTitle = currentClass?.course?.title || currentClass?.name || 'KHÓA HỌC';
  const bannerTitle = `${courseTitle.toUpperCase()} FOR ${student.name.toUpperCase()} (${formatHours(tHours)} HOURS)`;

  // Format session date: e.g. "Thu, 16/7/26" or "T5, 16/07/26"
  const formatSessionDate = (d: string | Date | null | undefined) => {
    if (!d) return '-';
    const dateObj = new Date(d);
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const w = dayMap[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const yr = String(dateObj.getFullYear()).slice(-2);
    return `${w}, ${day}/${month}/${yr}`;
  };

  const formatSessionTime = (rec: any) => {
    if (rec.schedule?.startTime) {
      const s = new Date(rec.schedule.startTime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return s;
    }
    if (rec.date) {
      return new Date(rec.date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return '18:00';
  };

  // Sort completed lesson records
  const lessonRecords = student.lessonRecords || [];
  const sortedRecords = [...lessonRecords].sort((a: any, b: any) => {
    if (sortAsc) {
      return (a.sessionNumber || 0) - (b.sessionNumber || 0);
    }
    return (b.sessionNumber || 0) - (a.sessionNumber || 0);
  });

  // Scheduled upcoming lessons that have not yet been recorded
  const recordedScheduleIds = new Set(
    lessonRecords.map((r: any) => r.scheduleId).filter(Boolean)
  );
  const upcomingSchedules = (currentClass?.schedules || []).filter(
    (sch: any) => !recordedScheduleIds.has(sch.id)
  );

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
    report += `${bannerTitle}\n`;
    report += `Học viên: ${student.name} | SĐT: ${student.phone || '-'}\n`;
    report += `Lớp học: ${currentClass?.name || 'Chưa xếp lớp'}\n`;
    report += `=================================================\n`;
    report += `Ses | Done | Date | Time | Hours | Lesson | Note\n`;
    report += `-------------------------------------------------\n`;
    sortedRecords.forEach((r: any) => {
      const status = r.attendance === 'PRESENT' ? '☑' : r.attendance === 'ABSENT_EXCUSED' ? 'Phép' : 'Vắng';
      report += `${r.sessionNumber} | ${status} | ${formatSessionDate(r.date)} | ${formatSessionTime(r)} | ${formatHours(r.durationHours)} | ${r.topic || '-'} | ${r.teacherNotes || ''}\n`;
    });
    report += `=================================================\n`;
    report += `Total hours / Tổng số giờ: ${formatHours(tHours)} giờ\n`;
    report += `Completed hours / Đã học: ${formatHours(cHours)} giờ (${percent}%)\n`;
    report += `Remaining hours / Còn lại: ${formatHours(rHours)} giờ\n`;
    report += `Teaching rate / Đơn giá: ${rate.toLocaleString('vi-VN')} VND / giờ\n`;
    report += `Tuition fee / Học phí: ${totalTuition.toLocaleString('vi-VN')} VND / khóa\n`;
    if (student.tuitionInstallments && student.tuitionInstallments.length > 0) {
      report += `-------------------------------------------------\n`;
      student.tuitionInstallments.forEach((inst: any, idx: number) => {
        report += `Học phí đợt ${idx + 1}: ${Number(inst.amount).toLocaleString('vi-VN')} VND ngày ${new Date(inst.dueDate).toLocaleDateString('vi-VN')} (${inst.status === 'PAID' ? 'Đã đóng' : 'Chưa đóng'})\n`;
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
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="In bảng điểm danh"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">In Bảng Điểm Danh</span>
          </button>

          <button
            onClick={handleCopyTableReport}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="Sao chép báo cáo gửi phụ huynh"
          >
            <Copy className="w-4 h-4 text-slate-600" />
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

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
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
                PH: {student.parentName || 'Chưa cập nhật'}{' '}
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

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Total Hours (Tổng Số Giờ)
          </p>
          <h4 className="text-3xl font-extrabold text-rose-700 mt-1">{formatHours(tHours)}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">giờ đăng ký trực tiếp</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
            Completed Hours (Đã Học)
          </p>
          <h4 className="text-3xl font-extrabold text-blue-600 mt-1">{formatHours(cHours)}</h4>
          <p className="text-[11px] text-blue-700 font-semibold mt-0.5">{percent}% lộ trình khóa học</p>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-sm text-center ${
            student.isUrgent
              ? 'bg-rose-50/70 border-rose-200 text-rose-800'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
            Remaining Hours (Còn Lại)
          </p>
          <h4 className="text-3xl font-extrabold mt-1">{formatHours(rHours)}</h4>
          <p className="text-[11px] font-semibold mt-0.5">
            {student.isUrgent ? '⚠️ Cần gia hạn gấp!' : 'giờ học tiếp theo'}
          </p>
        </div>
      </div>

      {/* MAIN CENTERPIECE: BẢNG ĐIỂM DANH & NHẬT KÝ KHÓA HỌC (CHUẨN FORM EXCEL) */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-lg overflow-hidden">
        {/* Banner Title Header (Like Excel: B1 COURSE FOR LINDA (120 hours)) */}
        <div className="bg-gradient-to-r from-red-800 via-rose-800 to-red-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-7 h-7 text-amber-300 shrink-0" />
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-amber-200">
                {bannerTitle}
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Bảng Điểm Danh & Nhật Ký Tiến Độ Từng Buổi Học (Attendance & Lesson Sheet)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/20"
              title="Đổi thứ tự sắp xếp"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortAsc ? 'Buổi 1 ➔ N' : 'Mới nhất trước'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedScheduleForModal(null);
                setIsLessonModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buổi học</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Column Headers: Reddish Header Like Image */}
            <thead>
              <tr className="bg-[#b91c1c] text-white font-bold border-b border-rose-900">
                <th className="py-2.5 px-3 w-14 text-center border-r border-rose-800/60 uppercase">
                  Ses
                </th>
                <th className="py-2.5 px-3 w-16 text-center border-r border-rose-800/60 uppercase">
                  Done
                </th>
                <th className="py-2.5 px-3.5 w-32 border-r border-rose-800/60 uppercase">
                  Date
                </th>
                <th className="py-2.5 px-3 w-20 text-center border-r border-rose-800/60 uppercase">
                  Time
                </th>
                <th className="py-2.5 px-3 w-20 text-center border-r border-rose-800/60 uppercase">
                  Hours
                </th>
                <th className="py-2.5 px-4 border-r border-rose-800/60 uppercase">
                  Lesson
                </th>
                <th className="py-2.5 px-4 w-52 border-r border-rose-800/60 uppercase">
                  Note
                </th>
                <th className="py-2.5 px-3 w-24 text-center uppercase no-print">
                  Thao Tác
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {sortedRecords.length === 0 && upcomingSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    Chưa có buổi học nào được ghi nhận. Bấm &quot;+ Ghi Nhận Buổi Học&quot; để bắt đầu điểm danh!
                  </td>
                </tr>
              ) : (
                <>
                  {/* Past / Completed Lesson Records */}
                  {sortedRecords.map((rec: any, index: number) => {
                    const isPresent = rec.attendance === 'PRESENT';
                    const isExcused = rec.attendance === 'ABSENT_EXCUSED';

                    return (
                      <tr
                        key={rec.id}
                        className={`hover:bg-amber-50/40 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        }`}
                      >
                        {/* Ses */}
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900 border-r border-slate-200">
                          {rec.sessionNumber || index + 1}
                        </td>

                        {/* Done Checkbox */}
                        <td className="py-2.5 px-3 text-center border-r border-slate-200">
                          {isPresent ? (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-900 text-white font-bold text-[11px]"
                              title="Đã học hoàn thành"
                            >
                              ✓
                            </span>
                          ) : isExcused ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                              Phép
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                              Vắng
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-2.5 px-3.5 font-medium text-slate-800 border-r border-slate-200 whitespace-nowrap">
                          {formatSessionDate(rec.date)}
                        </td>

                        {/* Time */}
                        <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-700 border-r border-slate-200 whitespace-nowrap">
                          {formatSessionTime(rec)}
                        </td>

                        {/* Hours */}
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900 border-r border-slate-200">
                          {formatHours(rec.durationHours)}
                        </td>

                        {/* Lesson Topic */}
                        <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <span>{rec.topic || 'Buổi học'}</span>
                            {rec.skillsCovered && (
                              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {rec.skillsCovered}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Note */}
                        <td className="py-2.5 px-4 text-slate-600 border-r border-slate-200 italic">
                          {rec.teacherNotes || '-'}
                        </td>

                        {/* Action Buttons (No Print) */}
                        <td className="py-2.5 px-3 text-center no-print">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditRecord(rec)}
                              className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                              title="Sửa nội dung buổi này"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(rec.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Xóa buổi này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Upcoming Scheduled Sessions on Calendar (Unchecked Box like Row 50 in Excel) */}
                  {upcomingSchedules.slice(0, 8).map((sch: any, idx: number) => {
                    const nextSesNum = sortedRecords.length + idx + 1;
                    const startTimeStr = new Date(sch.startTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const diffHours = (new Date(sch.endTime).getTime() - new Date(sch.startTime).getTime()) / 3600000;

                    return (
                      <tr
                        key={sch.id}
                        className="bg-slate-50/50 hover:bg-amber-50/30 text-slate-500 transition-colors"
                      >
                        {/* Ses */}
                        <td className="py-2.5 px-3 text-center font-bold text-slate-400 border-r border-slate-200">
                          {nextSesNum}
                        </td>

                        {/* Done (Unchecked) */}
                        <td className="py-2.5 px-3 text-center border-r border-slate-200">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 text-slate-300">
                            ☐
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-2.5 px-3.5 border-r border-slate-200 whitespace-nowrap text-slate-600">
                          {formatSessionDate(sch.startTime)}
                        </td>

                        {/* Time */}
                        <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200 whitespace-nowrap text-slate-600">
                          {startTimeStr}
                        </td>

                        {/* Hours */}
                        <td className="py-2.5 px-3 text-center font-medium border-r border-slate-200">
                          {formatHours(diffHours)}
                        </td>

                        {/* Lesson */}
                        <td className="py-2.5 px-4 italic border-r border-slate-200 text-slate-500">
                          {sch.title || 'Ca học theo lịch dự kiến'}
                        </td>

                        {/* Note */}
                        <td className="py-2.5 px-4 border-r border-slate-200 text-slate-400 italic">
                          Chưa diễn ra
                        </td>

                        {/* Action (No Print) */}
                        <td className="py-2.5 px-3 text-center no-print">
                          <button
                            onClick={() => {
                              setSelectedScheduleForModal(sch);
                              setIsLessonModalOpen(true);
                            }}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] border border-emerald-200/80"
                          >
                            Điểm danh
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}

              {/* BOTTOM SUMMARY ROWS (Exact replica of Excel sheet) */}
              <tr className="border-t-2 border-slate-400 font-bold bg-white text-xs">
                <td colSpan={4} className="py-2.5 px-4 text-slate-800 border-r border-slate-300">
                  Total hours / Tổng số giờ học trực tiếp
                </td>
                <td className="py-2.5 px-3 text-center font-black text-rose-700 text-sm border-r border-slate-300">
                  {formatHours(tHours)}
                </td>
                <td colSpan={3} className="py-2.5 px-4 text-slate-400"></td>
              </tr>

              <tr className="border-t border-slate-200 font-bold bg-white text-xs">
                <td colSpan={4} className="py-2.5 px-4 text-slate-800 border-r border-slate-300">
                  Completed hours / Số giờ đã học
                </td>
                <td className="py-2.5 px-3 text-center font-black text-blue-600 text-sm border-r border-slate-300">
                  {formatHours(cHours)}
                </td>
                <td colSpan={3} className="py-2.5 px-4 text-blue-600 text-[11px] font-semibold">
                  ({percent}% tiến độ)
                </td>
              </tr>

              <tr className="border-t border-slate-200 font-bold bg-white text-xs">
                <td colSpan={4} className="py-2.5 px-4 text-slate-800 border-r border-slate-300">
                  Remaining hours / Số giờ còn lại
                </td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 text-sm border-r border-slate-300">
                  {formatHours(rHours)}
                </td>
                <td colSpan={2} className="py-2.5 px-4 text-right font-bold text-slate-700 border-r border-slate-300">
                  {rate.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-bold text-[11px]">
                  VND / giờ
                </td>
              </tr>

              <tr className="border-t border-slate-200 font-bold bg-white text-xs">
                <td colSpan={4} className="py-2.5 px-4 text-slate-800 border-r border-slate-300">
                  Teaching rate / Học phí theo giờ
                </td>
                <td className="py-2.5 px-3 text-center border-r border-slate-300 font-mono text-slate-700">
                  -
                </td>
                <td colSpan={2} className="py-2.5 px-4 text-right font-black text-slate-900 text-sm border-r border-slate-300">
                  {rate.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-bold text-[11px]">
                  VND / giờ
                </td>
              </tr>

              <tr className="border-t border-slate-300 font-bold bg-white text-xs">
                <td colSpan={4} className="py-2.5 px-4 text-slate-800 border-r border-slate-300">
                  Tuition fee / Học phí toàn khóa
                </td>
                <td className="py-2.5 px-3 text-center border-r border-slate-300 font-mono text-slate-700">
                  -
                </td>
                <td colSpan={2} className="py-2.5 px-4 text-right font-black text-emerald-700 text-base border-r border-slate-300">
                  {totalTuition.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-3 text-emerald-800 font-bold text-[11px]">
                  VND / khóa
                </td>
              </tr>

              {/* INSTALLMENTS ROWS (Golden Amber Rows Like Excel Image) */}
              {student.tuitionInstallments && student.tuitionInstallments.length > 0 ? (
                student.tuitionInstallments.map((inst: any, idx: number) => {
                  const isPaid = inst.status === 'PAID';
                  const dueDateFormatted = new Date(inst.dueDate).toLocaleDateString('vi-VN');

                  return (
                    <tr
                      key={inst.id}
                      className="border-t border-amber-300 bg-[#fef9c3] hover:bg-amber-100/80 transition-colors text-amber-950 font-medium italic text-xs"
                    >
                      <td
                        colSpan={6}
                        className="py-2.5 px-4 border-r border-amber-300/80 font-bold"
                      >
                        Học phí đợt {idx + 1}:{' '}
                        <strong className="text-slate-900 font-black">
                          {Number(inst.amount).toLocaleString('vi-VN')} VND
                        </strong>{' '}
                        ngày <span className="text-blue-700 font-bold not-italic">{dueDateFormatted}</span>
                        {inst.note && <span className="text-slate-600 font-normal ml-2">({inst.note})</span>}
                      </td>
                      <td colSpan={2} className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] not-italic ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {isPaid ? '✓ Đã đóng' : 'Chưa đóng'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-t border-amber-200 bg-[#fef9c3] text-amber-800 italic text-xs">
                  <td colSpan={8} className="py-2 px-4 text-center">
                    Học phí: {totalTuition.toLocaleString('vi-VN')} VND (Chưa chia đợt đóng)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Info Card & Quick Actions - No Print */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Giáo viên phụ trách: {profile?.fullName || 'Nguyễn Đình Linh'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
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
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Tin Báo Cáo Phụ Huynh</span>
          </button>

          <button
            onClick={() => {
              alert(`Đã gửi email báo cáo tiến độ học tập tới phụ huynh: ${student.parentEmail || 'phụ huynh'}`);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors flex items-center gap-1.5"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số Giờ Học (Hours)
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
                    Trạng Thái Điểm Danh
                  </label>
                  <select
                    value={editAttendance}
                    onChange={(e) => setEditAttendance(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="PRESENT">Đã học (Có mặt)</option>
                    <option value="ABSENT_EXCUSED">Nghỉ có phép</option>
                    <option value="ABSENT_UNEXCUSED">Vắng không phép</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ghi Chú Giáo Viên (Note)
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
