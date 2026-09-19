'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  BookOpen,
  MessageSquare,
  CheckSquare,
  Square,
  Users,
  Clock,
} from 'lucide-react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schedule?: any;
  student?: any;
  classGroup?: any;
}

export default function LessonModal({
  isOpen,
  onClose,
  onSuccess,
  schedule,
  student,
  classGroup,
}: LessonModalProps) {
  const currentClass = classGroup || schedule?.classGroup;
  const members = currentClass?.members?.map((m: any) => m.student) || (student ? [student] : []);

  const [presentStudentIds, setPresentStudentIds] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Helper khởi tạo ngày & giờ
  const getInitialDate = () => {
    if (schedule?.startTime) {
      const d = new Date(schedule.startTime);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return new Date().toISOString().split('T')[0];
  };

  const getInitialStartTime = () => {
    if (schedule?.startTime) {
      const d = new Date(schedule.startTime);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return '19:00';
  };

  const getInitialEndTime = () => {
    if (schedule?.endTime) {
      const d = new Date(schedule.endTime);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return '20:30';
  };

  const [sessionDate, setSessionDate] = useState<string>(getInitialDate());
  const [startTimeStr, setStartTimeStr] = useState<string>(getInitialStartTime());
  const [endTimeStr, setEndTimeStr] = useState<string>(getInitialEndTime());

  // Tính thời lượng buổi học
  const getDurationText = () => {
    if (!startTimeStr || !endTimeStr) return '';
    const [sH, sM] = startTimeStr.split(':').map(Number);
    const [eH, eM] = endTimeStr.split(':').map(Number);
    let totalMin = (eH * 60 + eM) - (sH * 60 + sM);
    if (totalMin < 0) totalMin += 24 * 60;
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}p (${totalMin} phút)`;
    if (hrs > 0) return `${hrs} giờ (${totalMin} phút)`;
    return `${mins} phút`;
  };

  useEffect(() => {
    setSessionDate(getInitialDate());
    setStartTimeStr(getInitialStartTime());
    setEndTimeStr(getInitialEndTime());
    setTopic(schedule?.title || '');
    setTeacherNotes('');
    if (members && members.length > 0) {
      setPresentStudentIds(members.map((m: any) => m.id));
    }
  }, [schedule, student, classGroup, isOpen]);

  if (!isOpen) return null;

  // Toggle điểm danh từng bạn
  const toggleAttendance = (sId: string) => {
    setPresentStudentIds((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  // Chọn tất cả có mặt / bỏ chọn
  const toggleSelectAll = () => {
    if (presentStudentIds.length === members.length) {
      setPresentStudentIds([]);
    } else {
      setPresentStudentIds(members.map((m: any) => m.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass?.id) {
      alert('Vui lòng chọn lớp học hợp lệ!');
      return;
    }

    if (!startTimeStr || !endTimeStr) {
      alert('Vui lòng nhập Thời gian bắt đầu và kết thúc học!');
      return;
    }

    const actualStart = new Date(`${sessionDate}T${startTimeStr}:00`);
    const actualEnd = new Date(`${sessionDate}T${endTimeStr}:00`);
    const finalTopic = topic.trim() || `Buổi học ngày ${actualStart.toLocaleDateString('vi-VN')}`;

    setLoading(true);
    try {
      // Chuẩn bị danh sách điểm danh cho từng học viên
      const attendances = members.map((m: any) => ({
        studentId: m.id,
        attendance: presentStudentIds.includes(m.id) ? 'PRESENT' : 'ABSENT_UNEXCUSED',
      }));

      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: schedule?.id || null,
          classGroupId: currentClass.id,
          attendances,
          topic: finalTopic,
          actualStartTime: actualStart.toISOString(),
          actualEndTime: actualEnd.toISOString(),
          teacherNotes: teacherNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Đã lưu điểm danh và thời gian học thành công!');
        onSuccess();
        onClose();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Đã xảy ra lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Điểm Danh & Ghi Nhận Buổi Học
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>{currentClass?.name || 'Ca học'}</span>
                <span>•</span>
                <span>Thực tế: {startTimeStr} - {endTimeStr} ({getDurationText()})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-xl p-1.5 transition-colors hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm max-h-[80vh] overflow-y-auto">
          {/* 1. Thời Gian Học Thực Tế */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>1. Thời Gian Học Thực Tế</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                ⏱ {getDurationText()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ngày Học
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Bắt Đầu Học *
                </label>
                <input
                  type="time"
                  value={startTimeStr}
                  onChange={(e) => setStartTimeStr(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kết Thúc Học *
                </label>
                <input
                  type="time"
                  value={endTimeStr}
                  onChange={(e) => setEndTimeStr(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900"
                  required
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              💡 Bạn có thể điều chỉnh giờ nếu lớp bắt đầu muộn hơn hoặc kéo dài hơn so với lịch dự kiến.
            </p>
          </div>

          {/* 2. Điểm Danh Học Viên */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>
                  2. Tick Điểm Danh ({presentStudentIds.length}/{members.length} có mặt)
                </span>
              </label>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  {presentStudentIds.length === members.length
                    ? 'Bỏ chọn tất cả'
                    : 'Tick tất cả có mặt'}
                </button>
              )}
            </div>

            {members.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Lớp này chưa có học viên nào được gán. Hãy vào Quản lý Lớp học để thêm học viên vào lớp.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {members.map((m: any) => {
                  const isPresent = presentStudentIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleAttendance(m.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isPresent
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPresent ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-xs">{m.name}</p>
                          <p className="text-[10px] text-slate-400">{m.phone || m.email || 'Học viên'}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPresent
                            ? 'bg-emerald-200/60 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isPresent ? 'Có mặt' : 'Vắng'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Nội dung bài học */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Nội Dung Bài Học (Topic)</span>
            </label>
            <input
              type="text"
              placeholder="VD: Writing Task 2 - Agree/Disagree Essay, Luyện đề Cambridge 18... (hoặc để trống)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-medium"
            />
          </div>

          {/* 4. Lưu ý bài học & Nhận xét của giáo viên */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>4. Ghi Chú / Nhận Xét Buổi Học (Tùy chọn)</span>
            </label>
            <textarea
              rows={3}
              placeholder="VD: Cả lớp nắm bài tốt, cần rèn luyện thêm phần phản xạ..."
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {loading
                  ? 'Đang lưu...'
                  : `Lưu Điểm Danh & Trừ Buổi (${presentStudentIds.length} có mặt)`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
