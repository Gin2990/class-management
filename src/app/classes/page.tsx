'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  Calendar,
  Plus,
  MapPin,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Trash2,
  X,
  Search,
  CheckSquare,
  Square,
  Clock,
  RotateCw,
  Video,
  Pencil,
  Palette,
} from 'lucide-react';

interface ScheduleSlotItem {
  dayOfWeek: number; // 1: T2, 2: T3, ..., 6: T7, 0: CN
  startTime: string; // '19:00'
  endTime: string;   // '20:30'
}

const WEEK_DAYS = [
  { id: 1, label: 'Thứ Hai', short: 'T2' },
  { id: 2, label: 'Thứ Ba', short: 'T3' },
  { id: 3, label: 'Thứ Tư', short: 'T4' },
  { id: 4, label: 'Thứ Năm', short: 'T5' },
  { id: 5, label: 'Thứ Sáu', short: 'T6' },
  { id: 6, label: 'Thứ Bảy', short: 'T7' },
  { id: 0, label: 'Chủ Nhật', short: 'CN' },
];

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Class Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [locationOrLink, setLocationOrLink] = useState<string>('https://meet.google.com/new');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>('');
  
  // Schedule settings inside New Class Modal (hỗ trợ nhiều buổi/tuần)
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newScheduleSlots, setNewScheduleSlots] = useState<ScheduleSlotItem[]>([
    { dayOfWeek: 1, startTime: '19:00', endTime: '20:30' },
    { dayOfWeek: 4, startTime: '19:00', endTime: '20:30' },
  ]);
  const [repeatWeeks, setRepeatWeeks] = useState<number>(8);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Edit Class Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingClassId, setEditingClassId] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editCourseId, setEditCourseId] = useState<string>('');
  const [editLocationOrLink, setEditLocationOrLink] = useState<string>('');
  const [editStudentIds, setEditStudentIds] = useState<string[]>([]);
  const [editStudentSearch, setEditStudentSearch] = useState<string>('');
  const [editColor, setEditColor] = useState<string>('#3b82f6');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Edit Schedule State inside Edit Class Modal (hỗ trợ nhiều buổi/tuần)
  const [changeSchedule, setChangeSchedule] = useState<boolean>(false);
  const [editEffectiveDate, setEditEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editScheduleSlots, setEditScheduleSlots] = useState<ScheduleSlotItem[]>([
    { dayOfWeek: 1, startTime: '19:00', endTime: '20:30' },
    { dayOfWeek: 4, startTime: '19:00', endTime: '20:30' },
  ]);
  const [editRepeatWeeks, setEditRepeatWeeks] = useState<number>(8);

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [newCourseName, setNewCourseName] = useState<string>('');
  const [newCourseLevel, setNewCourseLevel] = useState<string>('GENERAL');
  const [newCourseDescription, setNewCourseDescription] = useState<string>('');
  const [isSubmittingCourse, setIsSubmittingCourse] = useState<boolean>(false);

  // Tạo khóa học mới
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      alert('Vui lòng nhập tên khóa học!');
      return;
    }

    setIsSubmittingCourse(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCourseName.trim(),
          level: newCourseLevel.trim() || 'GENERAL',
          description: newCourseDescription.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Đã thêm khóa học thành công!');
        setIsCourseModalOpen(false);
        setNewCourseName('');
        setNewCourseDescription('');
        // Refresh danh sách khóa học và tự động chọn khóa học vừa tạo
        const resCourses = await fetch('/api/courses').then((r) => r.json());
        if (resCourses.success) {
          setCourses(resCourses.data);
          if (data.data?.id) {
            setCourseId(data.data.id);
            if (isEditModalOpen) {
              setEditCourseId(data.data.id);
            }
          }
        }
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi thêm khóa học: ' + err.message);
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resClasses, resCourses, resStudents] = await Promise.all([
        fetch('/api/classes').then((r) => r.json()),
        fetch('/api/courses').then((r) => r.json()),
        fetch('/api/students').then((r) => r.json()),
      ]);

      if (resClasses.success) setClasses(resClasses.data);
      if (resCourses.success) {
        setCourses(resCourses.data);
        if (resCourses.data.length > 0 && !courseId) {
          setCourseId(resCourses.data[0].id);
        }
      }
      if (resStudents.success) setStudents(resStudents.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle student selection
  const toggleStudent = (sId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  // Select all filtered students
  const handleSelectAllStudents = (filtered: any[]) => {
    const fIds = filtered.map((s) => s.id);
    const allSelected = fIds.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !fIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...fIds])));
    }
  };

  // Quản lý buổi học trong New Class Modal
  const toggleNewDay = (dayId: number) => {
    setNewScheduleSlots((prev) => {
      const exists = prev.some((s) => s.dayOfWeek === dayId);
      if (exists) {
        if (prev.length <= 1) {
          alert('Lớp học cần có ít nhất 1 buổi học trong tuần!');
          return prev;
        }
        return prev.filter((s) => s.dayOfWeek !== dayId);
      } else {
        const defaultStart = prev[0]?.startTime || '19:00';
        const defaultEnd = prev[0]?.endTime || '20:30';
        const next = [...prev, { dayOfWeek: dayId, startTime: defaultStart, endTime: defaultEnd }];
        return next.sort((a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek));
      }
    });
  };

  const updateNewSlotTime = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setNewScheduleSlots((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s))
    );
  };

  const applyNewTimeToAll = (sourceSlot: ScheduleSlotItem) => {
    setNewScheduleSlots((prev) =>
      prev.map((s) => ({
        ...s,
        startTime: sourceSlot.startTime,
        endTime: sourceSlot.endTime,
      }))
    );
  };

  // Submit new class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }
    if (newScheduleSlots.length === 0) {
      alert('Vui lòng chọn ít nhất 1 buổi học trong tuần!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          courseId: courseId || null,
          locationOrLink: locationOrLink.trim(),
          studentIds: selectedStudentIds,
          startDate,
          scheduleSlots: newScheduleSlots,
          repeatWeeks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Đã tạo lớp học và sinh lịch thành công!');
        setIsModalOpen(false);
        // Reset form
        setName('');
        setSelectedStudentIds([]);
        fetchData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete class
  const handleDeleteClass = async (classId: string, className: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa lớp "${className}"? Toàn bộ ca lịch liên quan đến lớp này sẽ được xóa khỏi thời khóa biểu.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/classes?id=${classId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Đã xóa lớp học thành công!');
        fetchData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi xóa lớp: ' + err.message);
    }
  };

  // Quản lý buổi học trong Edit Class Modal
  const toggleEditDay = (dayId: number) => {
    setEditScheduleSlots((prev) => {
      const exists = prev.some((s) => s.dayOfWeek === dayId);
      if (exists) {
        if (prev.length <= 1) {
          alert('Lớp học cần có ít nhất 1 buổi học trong tuần!');
          return prev;
        }
        return prev.filter((s) => s.dayOfWeek !== dayId);
      } else {
        const defaultStart = prev[0]?.startTime || '19:00';
        const defaultEnd = prev[0]?.endTime || '20:30';
        const next = [...prev, { dayOfWeek: dayId, startTime: defaultStart, endTime: defaultEnd }];
        return next.sort((a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek));
      }
    });
  };

  const updateEditSlotTime = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setEditScheduleSlots((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s))
    );
  };

  const applyEditTimeToAll = (sourceSlot: ScheduleSlotItem) => {
    setEditScheduleSlots((prev) =>
      prev.map((s) => ({
        ...s,
        startTime: sourceSlot.startTime,
        endTime: sourceSlot.endTime,
      }))
    );
  };

  // Mở modal Chỉnh sửa lớp học
  const handleOpenEditModal = (cls: any) => {
    setEditingClassId(cls.id);
    setEditName(cls.name || '');
    setEditCourseId(cls.courseId || '');
    setEditLocationOrLink(cls.locationOrLink || '');
    setEditColor(cls.color || '#3b82f6');
    setEditStudentIds(cls.members?.map((m: any) => m.student?.id || m.studentId) || []);
    setEditStudentSearch('');

    // Tự động nhận diện các buổi học trong tuần hiện tại của lớp
    let detectedSlots: ScheduleSlotItem[] = [];
    if (cls.schedules && cls.schedules.length > 0) {
      const seenDays = new Set<number>();
      for (const s of cls.schedules) {
        const sDate = new Date(s.startTime);
        const eDate = new Date(s.endTime);
        const dOfWeek = sDate.getDay();
        if (!seenDays.has(dOfWeek)) {
          seenDays.add(dOfWeek);
          const sHours = String(sDate.getHours()).padStart(2, '0');
          const sMins = String(sDate.getMinutes()).padStart(2, '0');
          const eHours = String(eDate.getHours()).padStart(2, '0');
          const eMins = String(eDate.getMinutes()).padStart(2, '0');
          detectedSlots.push({
            dayOfWeek: dOfWeek,
            startTime: `${sHours}:${sMins}`,
            endTime: `${eHours}:${eMins}`,
          });
        }
      }
      detectedSlots.sort((a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek));
    }

    if (detectedSlots.length === 0) {
      detectedSlots = [
        { dayOfWeek: 1, startTime: '19:00', endTime: '20:30' },
        { dayOfWeek: 4, startTime: '19:00', endTime: '20:30' },
      ];
    }

    setEditScheduleSlots(detectedSlots);
    setChangeSchedule(false);
    setEditEffectiveDate(new Date().toISOString().split('T')[0]);
    setEditRepeatWeeks(8);
    setIsEditModalOpen(true);
  };

  // Toggle học viên trong modal chỉnh sửa
  const toggleEditStudent = (sId: string) => {
    setEditStudentIds((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  // Chọn tất cả / Bỏ chọn tất cả học viên trong modal chỉnh sửa
  const handleSelectAllEditStudents = (filtered: any[]) => {
    const fIds = filtered.map((s) => s.id);
    const allSelected = fIds.every((id) => editStudentIds.includes(id));
    if (allSelected) {
      setEditStudentIds((prev) => prev.filter((id) => !fIds.includes(id)));
    } else {
      setEditStudentIds((prev) => Array.from(new Set([...prev, ...fIds])));
    }
  };

  // Cập nhật thông tin lớp học
  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }

    if (changeSchedule && (!editEffectiveDate || editScheduleSlots.length === 0)) {
      alert('Vui lòng chọn Ngày bắt đầu hiệu lực và ít nhất 1 buổi học trong tuần!');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingClassId,
          name: editName.trim(),
          courseId: editCourseId || null,
          locationOrLink: editLocationOrLink.trim(),
          studentIds: editStudentIds,
          color: editColor,
          changeSchedule,
          effectiveDate: changeSchedule ? editEffectiveDate : undefined,
          scheduleSlots: changeSchedule ? editScheduleSlots : undefined,
          repeatWeeks: changeSchedule ? editRepeatWeeks : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Đã cập nhật thông tin lớp học thành công!');
        setIsEditModalOpen(false);
        fetchData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi cập nhật lớp: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const filteredEditStudents = students.filter((s) =>
    s.name.toLowerCase().includes(editStudentSearch.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(editStudentSearch.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Quản Lý Lớp Học & Khóa Học
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Trung tâm điều phối: Tạo lớp, xếp học viên và thiết lập lịch học định kỳ tự động đẩy sang Thời khóa biểu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/calendar"
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Xem Thời Khóa Biểu</span>
          </Link>

          <button
            onClick={() => setIsCourseModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>+ Thêm Khóa Học</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Lớp Học Mới</span>
          </button>
        </div>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: cls.color || '#3b82f6' }}
                  />
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {cls.course?.name || (cls.category === 'OFFICE' ? 'Văn phòng ANEX' : 'Gia sư Tiếng Anh')}
                  </span>
                </div>

                {cls.category !== 'OFFICE' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(cls)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Chỉnh sửa lớp học này"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa lớp học này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{cls.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cấp độ: <span className="font-semibold text-slate-700">{cls.course?.level || 'GENERAL'}</span>
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{cls.locationOrLink || 'Google Meet'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>
                    <strong className="text-slate-900">{cls.members?.length || 0}</strong> học viên tham gia
                  </span>
                </div>
                {cls.schedules && cls.schedules.length > 0 && (() => {
                  const seen = new Set<number>();
                  const days: string[] = [];
                  for (const s of cls.schedules) {
                    const d = new Date(s.startTime).getDay();
                    if (!seen.has(d)) {
                      seen.add(d);
                      const wObj = WEEK_DAYS.find((w) => w.id === d);
                      if (wObj) days.push(wObj.short);
                    }
                  }
                  const s0 = cls.schedules[0];
                  const tStart = new Date(s0.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  const tEnd = new Date(s0.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        Lịch: <strong className="text-indigo-700">{days.join(', ')}</strong> ({tStart} - {tEnd})
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Members preview */}
              {cls.members?.length > 0 ? (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Học viên trong lớp:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.members.map((m: any) => (
                      <Link
                        key={m.id}
                        href={`/students/${m.student.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 text-xs font-medium transition-colors"
                      >
                        {m.student.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic pt-1">
                  Chưa có học viên nào được thêm vào lớp
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                📅 {cls._count?.schedules || 0} ca trên lịch
              </span>
              <div className="flex items-center gap-3">
                {cls.category !== 'OFFICE' && (
                  <button
                    onClick={() => handleOpenEditModal(cls)}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Sửa lớp</span>
                  </button>
                )}
                <Link
                  href="/calendar"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Xem lịch</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tạo Lớp Học & Lịch Học Định Kỳ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <span>Tạo Lớp Học & Xếp Lịch Tự Động</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nhập thông tin lớp, chọn học viên và thiết lập ca học định kỳ đẩy sang thời khóa biểu
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateClass} className="space-y-4 text-sm">
              {/* 1. Tên Lớp Học */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  1. Tên Lớp Học *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: IELTS 6.5 - Yến Ngọc (Ca Tối), B2 First - Nhóm 1..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-medium"
                  required
                />
              </div>

              {/* 2. Cấp Độ / Khóa Học & Link Google Meet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Cấp Độ Học / Khóa Học
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCourseModalOpen(true)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      + Khóa học mới
                    </button>
                  </div>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                  >
                    <option value="">-- Chọn khóa học --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Google Meet / Phòng</span>
                  </label>
                  <input
                    type="text"
                    value={locationOrLink}
                    onChange={(e) => setLocationOrLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* 3. Học Viên Của Lớp (Multi-select) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>3. Học Viên Thuộc Lớp (Đã chọn: {selectedStudentIds.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSelectAllStudents(filteredStudents)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </button>
                </div>

                {/* Quick search student */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm nhanh học viên..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Students Checklist */}
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200/80">
                  {filteredStudents.map((st) => {
                    const isChecked = selectedStudentIds.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleStudent(st.id)}
                        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-xs ${
                          isChecked
                            ? 'bg-emerald-50 text-emerald-800 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{st.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Thời Gian Học & Lặp Lại Hàng Tuần (Đẩy Sang Thời Khóa Biểu) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>4. Thời Gian Học ({newScheduleSlots.length} buổi/tuần)</span>
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    {newScheduleSlots.length} buổi / tuần
                  </span>
                </div>

                {/* Chọn ngày học trong tuần */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    Chọn các ngày học trong tuần (Nhấn để bật / tắt):
                  </label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {WEEK_DAYS.map((d) => {
                      const isSelected = newScheduleSlots.some((s) => s.dayOfWeek === d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleNewDay(d.id)}
                          className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div>{d.short}</div>
                          <div className="text-[9px] font-normal opacity-90 hidden sm:block">{d.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Khung giờ cho từng buổi */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">Khung giờ từng buổi:</span>
                    {newScheduleSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => applyNewTimeToAll(newScheduleSlots[0])}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        ⚡ Áp dụng giờ {newScheduleSlots[0].startTime}-{newScheduleSlots[0].endTime} cho tất cả buổi
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {newScheduleSlots.map((slot) => {
                      const dayObj = WEEK_DAYS.find((w) => w.id === slot.dayOfWeek);
                      return (
                        <div
                          key={slot.dayOfWeek}
                          className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-slate-200 text-xs"
                        >
                          <span className="font-bold text-slate-800 min-w-[70px]">
                            {dayObj?.label || `Thứ ${slot.dayOfWeek + 1}`}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateNewSlotTime(slot.dayOfWeek, 'startTime', e.target.value)}
                              className="px-2 py-1 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                            <span className="text-slate-400 font-bold">-</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateNewSlotTime(slot.dayOfWeek, 'endTime', e.target.value)}
                              className="px-2 py-1 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          {newScheduleSlots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => toggleNewDay(slot.dayOfWeek)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Xóa buổi này"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ngày bắt đầu & số tuần lặp lại */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ngày Bắt Đầu Học
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Lặp lại hàng tuần trong
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[4, 8, 12, 24].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setRepeatWeeks(w)}
                          className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            repeatWeeks === w
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-sm'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-100 bg-white'
                          }`}
                        >
                          {w} tuần
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview text */}
                <div className="text-[11px] text-emerald-900 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200 leading-relaxed">
                  ✨ Lớp học gồm <strong>{newScheduleSlots.length} buổi/tuần</strong> ({newScheduleSlots.map(s => WEEK_DAYS.find(w => w.id === s.dayOfWeek)?.short).join(', ')}) • Lặp lại <strong>{repeatWeeks} tuần</strong> ➔ Sẽ tự động sinh <strong>{newScheduleSlots.length * repeatWeeks} ca học</strong> trên Thời Khóa Biểu bắt đầu từ ngày {new Date(startDate).toLocaleDateString('vi-VN')}.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Đang tạo lớp & lịch học...'
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Tạo Lớp & Tự Động Sinh {newScheduleSlots.length * repeatWeeks} Buổi Học</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Lớp Học */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-indigo-600" />
                  <span>Chỉnh Sửa Thông Tin Lớp Học</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cập nhật tên lớp, cấp độ, link Google Meet, màu sắc và thêm/bớt học viên
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleUpdateClass} className="space-y-4 text-sm">
              {/* 1. Tên Lớp Học */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  1. Tên Lớp Học *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="VD: IELTS 6.5 - Yến Ngọc..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
                  required
                />
              </div>

              {/* 2. Cấp Độ & Link Meet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Cấp Độ / Khóa Học
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCourseModalOpen(true)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      + Khóa học mới
                    </button>
                  </div>
                  <select
                    value={editCourseId}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                  >
                    <option value="">-- Chọn khóa học --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Google Meet / Phòng</span>
                  </label>
                  <input
                    type="text"
                    value={editLocationOrLink}
                    onChange={(e) => setEditLocationOrLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* 3. Màu Đại Diện Trên Thời Khóa Biểu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3. Màu Sắc Hiển Thị Trên Lịch</span>
                </label>
                <div className="flex items-center gap-2">
                  {[
                    '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
                    '#ec4899', '#06b6d4', '#f97316', '#6366f1'
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditColor(color)}
                      className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                        editColor === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {editColor === color && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Học Viên Thuộc Lớp (Thêm / Bớt) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>4. Danh Sách Học Viên Trong Lớp ({editStudentIds.length} học viên)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSelectAllEditStudents(filteredEditStudents)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {editStudentIds.length === filteredEditStudents.length && filteredEditStudents.length > 0
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </button>
                </div>

                {/* Quick search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm học viên để thêm/bớt..."
                    value={editStudentSearch}
                    onChange={(e) => setEditStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Students Checklist */}
                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200/80">
                  {filteredEditStudents.map((st) => {
                    const isChecked = editStudentIds.includes(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleEditStudent(st.id)}
                        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors text-xs ${
                          isChecked
                            ? 'bg-indigo-50 text-indigo-800 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{st.name}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400">
                  💡 Tick chọn để thêm học viên vào lớp, hoặc bỏ tick để xóa học viên khỏi lớp này.
                </p>
              </div>

              {/* 5. Thay Đổi Thời Khóa Biểu (Tùy chọn) */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      5. Thay Đổi Thời Khóa Biểu
                    </label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changeSchedule}
                      onChange={(e) => setChangeSchedule(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    <span className="ml-2 text-xs font-semibold text-slate-700">
                      {changeSchedule ? 'Đổi lịch' : 'Giữ lịch cũ'}
                    </span>
                  </label>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Bật tùy chọn này khi lớp đổi giờ hoặc đổi ngày học. Toàn bộ ca học <strong>trước ngày hiệu lực sẽ được giữ nguyên</strong> (bảo lưu lịch sử), các ca học <strong>từ ngày hiệu lực trở đi</strong> sẽ tự động cập nhật sang lịch mới.
                </p>

                {changeSchedule && (
                  <div className="space-y-3.5 pt-2.5 border-t border-amber-200/80">
                    {/* Ngày hiệu lực & Số tuần lặp lại */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Thời Gian Bắt Đầu Hiệu Lực *
                        </label>
                        <input
                          type="date"
                          value={editEffectiveDate}
                          onChange={(e) => setEditEffectiveDate(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs bg-white"
                          required={changeSchedule}
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Lịch mới sẽ áp dụng từ ngày này trở đi
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Số Tuần Lặp Lại Mới
                        </label>
                        <select
                          value={editRepeatWeeks}
                          onChange={(e) => setEditRepeatWeeks(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs bg-white"
                        >
                          <option value={4}>4 tuần (1 tháng)</option>
                          <option value={8}>8 tuần (2 tháng)</option>
                          <option value={12}>12 tuần (3 tháng)</option>
                          <option value={16}>16 tuần (4 tháng)</option>
                          <option value={24}>24 tuần (6 tháng)</option>
                          <option value={36}>36 tuần (9 tháng)</option>
                          <option value={52}>52 tuần (1 năm)</option>
                        </select>
                      </div>
                    </div>

                    {/* Chọn các ngày học trong tuần mới */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                        Chọn các ngày học mới trong tuần ({editScheduleSlots.length} buổi/tuần):
                      </label>
                      <div className="grid grid-cols-7 gap-1.5">
                        {WEEK_DAYS.map((d) => {
                          const isSelected = editScheduleSlots.some((s) => s.dayOfWeek === d.id);
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => toggleEditDay(d.id)}
                              className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-amber-600 border-amber-600 text-white shadow-sm shadow-amber-600/30'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div>{d.short}</div>
                              <div className="text-[9px] font-normal opacity-90 hidden sm:block">{d.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Khung giờ cho từng buổi mới */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Khung giờ từng buổi mới:</span>
                        {editScheduleSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => applyEditTimeToAll(editScheduleSlots[0])}
                            className="text-amber-700 hover:text-amber-900 font-semibold"
                          >
                            ⚡ Áp dụng giờ {editScheduleSlots[0].startTime}-{editScheduleSlots[0].endTime} cho tất cả
                          </button>
                        )}
                      </div>

                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {editScheduleSlots.map((slot) => {
                          const dayObj = WEEK_DAYS.find((w) => w.id === slot.dayOfWeek);
                          return (
                            <div
                              key={slot.dayOfWeek}
                              className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-slate-200 text-xs"
                            >
                              <span className="font-bold text-slate-800 min-w-[70px]">
                                {dayObj?.label || `Thứ ${slot.dayOfWeek + 1}`}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => updateEditSlotTime(slot.dayOfWeek, 'startTime', e.target.value)}
                                  className="px-2 py-1 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  required={changeSchedule}
                                />
                                <span className="text-slate-400 font-bold">-</span>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => updateEditSlotTime(slot.dayOfWeek, 'endTime', e.target.value)}
                                  className="px-2 py-1 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  required={changeSchedule}
                                />
                              </div>
                              {editScheduleSlots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => toggleEditDay(slot.dayOfWeek)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                  title="Xóa buổi này"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preview text */}
                    <div className="text-[11px] text-amber-900 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300 leading-relaxed">
                      ✨ Từ ngày <strong>{new Date(editEffectiveDate).toLocaleDateString('vi-VN')}</strong>: Tự động thay thế các ca chưa diễn ra bằng <strong>{editScheduleSlots.length * editRepeatWeeks} ca học mới</strong> ({editScheduleSlots.length} buổi/tuần × {editRepeatWeeks} tuần). Các ca học trước ngày này được bảo lưu 100%.
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span>
                    {isUpdating
                      ? 'Đang lưu...'
                      : changeSchedule
                      ? `Lưu & Đổi Lịch (${editScheduleSlots.length * editRepeatWeeks} Buổi Mới)`
                      : 'Lưu Thay Đổi'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Khóa Học Mới */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Thêm Khóa Học Mới</h3>
                  <p className="text-xs text-slate-500">Khóa học sẽ xuất hiện ngay trong danh sách chọn</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tên Khóa Học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="VD: IELTS Intensive 6.5+, Tiếng Anh THPT..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cấp Độ / Phân Loại
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['GENERAL', 'IELTS', 'TOEIC', 'B1', 'B2', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewCourseLevel(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                        newCourseLevel === tag
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newCourseLevel}
                  onChange={(e) => setNewCourseLevel(e.target.value)}
                  placeholder="Hoặc tự nhập: VD: SAT, VSTEP, G10..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mô Tả Khóa Học (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  placeholder="Mô tả mục tiêu đầu ra, đối tượng tuyển sinh..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCourse}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmittingCourse ? 'Đang thêm...' : 'Thêm Khóa Học'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
