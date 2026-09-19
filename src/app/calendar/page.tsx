'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  Trash2,
  CheckSquare,
  Square,
  X,
  List,
  CalendarDays,
  FileCheck,
  AlertTriangle,
  GraduationCap,
  Pencil,
  Save,
} from 'lucide-react';
import LessonModal from '@/components/LessonModal';

// Dynamic import for FullCalendar to disable SSR
const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr: false });
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarPage() {
  const [schedulesList, setSchedulesList] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');

  // Multi-select / Bulk Delete mode
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState<boolean>(false);

  // Modals
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);

  // Time Edit State for Detail Modal
  const [editDate, setEditDate] = useState<string>('');
  const [editStartTime, setEditStartTime] = useState<string>('19:00');
  const [editEndTime, setEditEndTime] = useState<string>('20:30');
  const [isSavingTime, setIsSavingTime] = useState<boolean>(false);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const [resSchedules, resClasses] = await Promise.all([
        fetch('/api/schedules').then((r) => r.json()),
        fetch('/api/classes').then((r) => r.json()),
      ]);

      if (resClasses.success) {
        setClasses(resClasses.data);
      }

      if (resSchedules.success) {
        setSchedulesList(resSchedules.data);
        const formattedEvents = resSchedules.data.map((sc: any) => {
          const isSelected = selectedIds.includes(sc.id);
          return {
            id: sc.id,
            title: isSelected ? `✓ ${sc.title}` : sc.title,
            start: sc.startTime,
            end: sc.endTime,
            backgroundColor: isSelected ? '#ef4444' : sc.classGroup?.color || '#3b82f6',
            borderColor: isSelected ? '#b91c1c' : sc.classGroup?.color || '#3b82f6',
            textColor: '#ffffff',
            extendedProps: {
              ...sc,
            },
          };
        });
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [selectedIds]);

  // Khởi tạo thông tin giờ cho modal chỉnh sửa
  const initEditScheduleTime = (sc: any) => {
    if (sc?.startTime) {
      const d = new Date(sc.startTime);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setEditDate(`${year}-${month}-${day}`);
      setEditStartTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    }
    if (sc?.endTime) {
      const d = new Date(sc.endTime);
      setEditEndTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    }
  };

  // Tính thời lượng hiển thị trên modal chỉnh sửa
  const getEditDurationText = () => {
    if (!editStartTime || !editEndTime) return '';
    const [sH, sM] = editStartTime.split(':').map(Number);
    const [eH, eM] = editEndTime.split(':').map(Number);
    let totalMin = (eH * 60 + eM) - (sH * 60 + sM);
    if (totalMin < 0) totalMin += 24 * 60;
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    const hrsFloat = (totalMin / 60).toFixed(1).replace(/\.0$/, '');
    if (mins === 0) return `${hrs} giờ (${totalMin} phút)`;
    return `${hrs}h ${mins}p (${hrsFloat} giờ)`;
  };

  // Lưu chỉnh sửa thời gian từ modal
  const handleSaveScheduleTime = async () => {
    if (!selectedSchedule || !editDate || !editStartTime || !editEndTime) return;

    try {
      setIsSavingTime(true);
      const startIso = new Date(`${editDate}T${editStartTime}:00`).toISOString();
      const endIso = new Date(`${editDate}T${editEndTime}:00`).toISOString();

      const res = await fetch('/api/schedules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSchedule.id,
          startTime: startIso,
          endTime: endIso,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Đã cập nhật thời gian ca học thành công!');
        setSelectedSchedule(data.data);
        fetchCalendarData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi lưu thời gian: ' + err.message);
    } finally {
      setIsSavingTime(false);
    }
  };

  // Handle Event Drag & Drop (Dời ca học sang khung giờ / ngày khác)
  const handleEventDrop = async (info: any) => {
    const { event } = info;
    const scheduleId = event.id;
    const newStart = event.start.toISOString();
    const newEnd = event.end ? event.end.toISOString() : newStart;

    try {
      const res = await fetch('/api/schedules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: scheduleId,
          startTime: newStart,
          endTime: newEnd,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert('Lỗi cập nhật lịch: ' + data.error);
        info.revert();
      } else {
        fetchCalendarData();
      }
    } catch (err: any) {
      alert('Không thể lưu ca học: ' + err.message);
      info.revert();
    }
  };

  // Handle Event Resize (Kéo ra hoặc thu vào thời gian học trực tiếp trên lịch)
  const handleEventResize = async (info: any) => {
    const { event } = info;
    const scheduleId = event.id;
    const newStart = event.start.toISOString();
    const newEnd = event.end ? event.end.toISOString() : newStart;

    try {
      const res = await fetch('/api/schedules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: scheduleId,
          startTime: newStart,
          endTime: newEnd,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert('Lỗi cập nhật thời lượng ca học: ' + data.error);
        info.revert();
      } else {
        fetchCalendarData();
      }
    } catch (err: any) {
      alert('Không thể lưu thời gian ca học: ' + err.message);
      info.revert();
    }
  };

  // Toggle select an ID
  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all or deselect all
  const handleSelectAll = () => {
    const visibleIds = filteredSchedules.map((s) => s.id);
    if (selectedIds.length === visibleIds.length && visibleIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleIds);
    }
  };

  // Handle Event Click on Calendar
  const handleEventClick = (clickInfo: any) => {
    const sc = clickInfo.event.extendedProps;
    if (isSelectMode) {
      toggleSelectId(sc.id);
      return;
    }

    setSelectedSchedule(sc);
    initEditScheduleTime(sc);
    setIsDetailModalOpen(true);
  };

  // Xóa 1 buổi học
  const handleDeleteSingleSchedule = async (scheduleId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa buổi học này khỏi thời khóa biểu?')) {
      return;
    }

    try {
      const res = await fetch(`/api/schedules?id=${scheduleId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Đã xóa buổi học thành công!');
        setIsDetailModalOpen(false);
        setSelectedIds((prev) => prev.filter((id) => id !== scheduleId));
        fetchCalendarData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi xóa: ' + err.message);
    }
  };

  // Xóa hàng loạt các buổi đã chọn
  const handleDeleteBulkSchedules = async () => {
    if (selectedIds.length === 0) return;

    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa ${selectedIds.length} buổi học đã chọn khỏi thời khóa biểu?`
      )
    ) {
      return;
    }

    setIsDeletingBulk(true);
    try {
      const res = await fetch(`/api/schedules?ids=${selectedIds.join(',')}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert(`Đã xóa thành công ${data.deletedCount} buổi học!`);
        setSelectedIds([]);
        setIsSelectMode(false);
        fetchCalendarData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi xóa nhiều buổi: ' + err.message);
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // Filter schedules & events
  const filteredEvents = events.filter((ev) => {
    if (filterCategory === 'ALL') return true;
    return ev.extendedProps.classGroup?.category === filterCategory;
  });

  const filteredSchedules = schedulesList.filter((sc) => {
    if (filterCategory === 'ALL') return true;
    return sc.classGroup?.category === filterCategory;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Kéo mép trên/dưới để thu vào hoặc kéo dài giờ học • Kéo cả thẻ để dời lịch</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-slate-800" />
            Thời Khóa Biểu & Lịch Giảng Dạy
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch View: Calendar vs List */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                viewMode === 'CALENDAR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Lịch Tuần</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Danh Sách Ca ({filteredSchedules.length})</span>
            </button>
          </div>

          {/* Toggle Multi-Select / Delete Mode Button */}
          <button
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              if (isSelectMode) setSelectedIds([]);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              isSelectMode
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>{isSelectMode ? 'Đang chọn xóa' : 'Chọn xóa nhiều buổi'}</span>
            {selectedIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {selectedIds.length}
              </span>
            )}
          </button>

          {/* Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm text-xs font-semibold">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'TUTORING', label: 'Gia sư' },
              { id: 'OFFICE', label: 'ANEX' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterCategory === f.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Link
            href="/classes"
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Tạo Lớp & Xếp Lịch</span>
          </Link>
        </div>
      </div>

      {/* Floating Bulk Actions Bar when in Select Mode */}
      {isSelectMode && (
        <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rose-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
              {selectedIds.length}
            </div>
            <div>
              <p className="font-bold text-sm">
                Chế độ Chọn & Xóa Nhiều Buổi Học
              </p>
              <p className="text-xs text-rose-200">
                Nhấp vào các buổi học trên lịch hoặc bảng để chọn/bỏ chọn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSelectAll}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {selectedIds.length === filteredSchedules.length
                ? 'Bỏ chọn tất cả'
                : 'Chọn tất cả'}
            </button>
            <button
              onClick={handleDeleteBulkSchedules}
              disabled={selectedIds.length === 0 || isDeletingBulk}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {isDeletingBulk ? 'Đang xóa...' : `Xóa ${selectedIds.length} buổi đã chọn`}
              </span>
            </button>
            <button
              onClick={() => {
                setIsSelectMode(false);
                setSelectedIds([]);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Đóng chế độ chọn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View: Calendar or List */}
      {viewMode === 'CALENDAR' ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay,dayGridMonth',
            }}
            locale="vi"
            buttonText={{
              today: 'Hôm nay',
              month: 'Tháng',
              week: 'Tuần',
              day: 'Ngày',
            }}
            firstDay={1} // Thứ 2
            slotMinTime="06:00:00"
            slotMaxTime="23:00:00"
            slotDuration="00:30:00"
            allDaySlot={false}
            editable={!isSelectMode}
            droppable={!isSelectMode}
            eventResizableFromStart={true}
            eventDurationEditable={!isSelectMode}
            snapDuration="00:15:00"
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventClick={handleEventClick}
            events={filteredEvents}
            height="auto"
            nowIndicator={true}
          />
        </div>
      ) : (
        /* List / Table View with Checkboxes for Easy Batch Delete */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="text-xs font-semibold text-slate-700 flex items-center gap-2"
              >
                {selectedIds.length === filteredSchedules.length && filteredSchedules.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Chọn tất cả ({filteredSchedules.length} ca)</span>
              </button>
            </div>

            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteBulkSchedules}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa {selectedIds.length} ca đã chọn</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 w-12 text-center">Chọn</th>
                  <th className="py-3 px-4">Ca Học / Tiêu Đề</th>
                  <th className="py-3 px-4">Ngày Học</th>
                  <th className="py-3 px-4">Khung Giờ</th>
                  <th className="py-3 px-4">Phân Loại</th>
                  <th className="py-3 px-4">Địa Điểm</th>
                  <th className="py-3 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map((sc) => {
                  const isChecked = selectedIds.includes(sc.id);
                  const d = new Date(sc.startTime);
                  const dateFormatted = d.toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  const startTime = d.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const endTime = new Date(sc.endTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={sc.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-rose-50/60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectId(sc.id)}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: sc.classGroup?.color || '#3b82f6' }}
                          />
                          <span className="font-bold text-slate-900 text-xs">{sc.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{dateFormatted}</td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-700">
                        {startTime} - {endTime}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {sc.classGroup?.category === 'OFFICE' ? 'Văn phòng' : 'Gia sư'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {sc.classGroup?.locationOrLink || 'Google Meet'}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedSchedule(sc);
                              initEditScheduleTime(sc);
                              setIsDetailModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 transition-colors text-xs"
                            title="Chỉnh sửa thời gian ca này"
                          >
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>Đổi giờ</span>
                          </button>
                          {sc.classGroup?.category !== 'OFFICE' && (
                            <button
                              onClick={() => {
                                setSelectedSchedule(sc);
                                setIsLessonModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                              title="Điểm danh"
                            >
                              Điểm danh
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSingleSchedule(sc.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Xóa buổi này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Event Detail & Action Modal (Khi bấm vào 1 ca học trên Calendar) */}
      {isDetailModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full mt-0.5"
                  style={{ backgroundColor: selectedSchedule.classGroup?.color || '#3b82f6' }}
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedSchedule.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedSchedule.classGroup?.name || 'Ca học'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  <strong className="text-slate-900">Thời gian:</strong>{' '}
                  {new Date(selectedSchedule.startTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(selectedSchedule.endTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  ({new Date(selectedSchedule.startTime).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>
                  <strong className="text-slate-900">Địa điểm:</strong>{' '}
                  {selectedSchedule.classGroup?.locationOrLink || 'Google Meet'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Trạng thái:</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                  {selectedSchedule.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã xếp lịch'}
                </span>
              </div>
            </div>

            {/* Form Điều Chỉnh Thời Gian Ca Học (Kéo dài / Thu ngắn) */}
            <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Điều Chỉnh Giờ Học Ca Này</span>
                </div>
                {getEditDurationText() && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Thời lượng: {getEditDurationText()}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-amber-700 leading-relaxed">
                Bạn có thể thay đổi ngày học, kéo dài hoặc thu ngắn giờ học ca này (không bị cố định theo khóa học ban đầu).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ngày Học
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bắt Đầu
                  </label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kết Thúc
                  </label>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveScheduleTime}
                  disabled={isSavingTime}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingTime ? 'Đang lưu...' : 'Lưu Thay Đổi Giờ Học'}</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {selectedSchedule.classGroup?.category !== 'OFFICE' && (
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setIsLessonModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Điểm danh & Ghi nhận tiến độ ca này</span>
                </button>
              )}

              {/* Nút Xóa Buổi Học */}
              <button
                onClick={() => handleDeleteSingleSchedule(selectedSchedule.id)}
                className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Xóa Buổi Học Này Khỏi Lịch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal for quick record */}
      {isLessonModalOpen && (
        <LessonModal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          onSuccess={fetchCalendarData}
          schedule={selectedSchedule}
        />
      )}
    </div>
  );
}
