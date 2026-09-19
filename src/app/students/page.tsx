'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  GraduationCap,
  Pencil,
  Trash2,
  Calendar,
  DollarSign,
  X,
  AlertCircle,
} from 'lucide-react';

interface InstallmentItem {
  id: string;
  dueDate: string;
  amount: string;
  note: string;
  status?: string;
}

const formatHours = (h: number | string | undefined | null) => {
  if (h === undefined || h === null || isNaN(Number(h))) return '0';
  const num = Number(h);
  if (Number.isInteger(num)) return num.toString();
  return Number(num.toFixed(1)).toString();
};

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterUrgent, setFilterUrgent] = useState<boolean>(false);

  // New Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newParentName, setNewParentName] = useState<string>('');
  const [newParentEmail, setNewParentEmail] = useState<string>('');
  const [newClassId, setNewClassId] = useState<string>('');
  const [newTotalSessions, setNewTotalSessions] = useState<string>('20');
  const [newPricePerSession, setNewPricePerSession] = useState<string>('300000');
  const [newInstallments, setNewInstallments] = useState<InstallmentItem[]>([]);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState<boolean>(false);

  // Edit Student Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingStudentId, setEditingStudentId] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editParentName, setEditParentName] = useState<string>('');
  const [editParentEmail, setEditParentEmail] = useState<string>('');
  const [editClassId, setEditClassId] = useState<string>('');
  const [editTotalSessions, setEditTotalSessions] = useState<string>('20');
  const [editPricePerSession, setEditPricePerSession] = useState<string>('300000');
  const [editInstallments, setEditInstallments] = useState<InstallmentItem[]>([]);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStudents, resClasses, resProfile] = await Promise.all([
        fetch('/api/students').then((r) => r.json()),
        fetch('/api/classes').then((r) => r.json()),
        fetch('/api/profile').then((r) => r.json()),
      ]);

      if (resStudents.success) setStudents(resStudents.data);
      if (resClasses.success) setClasses(resClasses.data);
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

  // Handlers for Add Student Installments
  const handleAddNewInstallmentRow = () => {
    const today = new Date();
    today.setDate(today.getDate() + (newInstallments.length + 1) * 30);
    const defaultDate = today.toISOString().split('T')[0];

    setNewInstallments([
      ...newInstallments,
      {
        id: Math.random().toString(),
        dueDate: defaultDate,
        amount: '3000000',
        note: `Đợt ${newInstallments.length + 1}`,
      },
    ]);
  };

  const handleRemoveNewInstallmentRow = (id: string) => {
    setNewInstallments(newInstallments.filter((inst) => inst.id !== id));
  };

  const handleUpdateNewInstallmentRow = (id: string, field: string, value: string) => {
    setNewInstallments(
      newInstallments.map((inst) => (inst.id === id ? { ...inst, [field]: value } : inst))
    );
  };

  // Handlers for Edit Student Installments
  const handleAddEditInstallmentRow = () => {
    const today = new Date();
    today.setDate(today.getDate() + (editInstallments.length + 1) * 30);
    const defaultDate = today.toISOString().split('T')[0];

    setEditInstallments([
      ...editInstallments,
      {
        id: Math.random().toString(),
        dueDate: defaultDate,
        amount: '3000000',
        note: `Đợt ${editInstallments.length + 1}`,
        status: 'PENDING',
      },
    ]);
  };

  const handleRemoveEditInstallmentRow = (id: string) => {
    setEditInstallments(editInstallments.filter((inst) => inst.id !== id));
  };

  const handleUpdateEditInstallmentRow = (id: string, field: string, value: string) => {
    setEditInstallments(
      editInstallments.map((inst) => (inst.id === id ? { ...inst, [field]: value } : inst))
    );
  };

  // Open Edit Modal & Populate Data
  const handleOpenEditStudent = (st: any) => {
    setEditingStudentId(st.id);
    setEditName(st.name || '');
    setEditEmail(st.email || '');
    setEditPhone(st.phone || '');
    setEditParentName(st.parentName || '');
    setEditParentEmail(st.parentEmail || '');
    setEditClassId(st.classMembers?.[0]?.classGroupId || '');
    setEditTotalSessions(
      st.activeEnrollment?.totalSessions?.toString() || st.totalSessions?.toString() || '20'
    );
    setEditPricePerSession(
      st.activeEnrollment?.pricePerSession?.toString() || '300000'
    );

    if (st.tuitionInstallments && st.tuitionInstallments.length > 0) {
      setEditInstallments(
        st.tuitionInstallments.map((inst: any) => ({
          id: inst.id || Math.random().toString(),
          dueDate: inst.dueDate ? new Date(inst.dueDate).toISOString().split('T')[0] : '',
          amount: inst.amount ? inst.amount.toString() : '0',
          note: inst.note || '',
          status: inst.status || 'PENDING',
        }))
      );
    } else {
      setEditInstallments([]);
    }

    setIsEditModalOpen(true);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      alert('Vui lòng nhập tên học viên');
      return;
    }

    try {
      setIsSubmittingAdd(true);
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          parentName: newParentName,
          parentEmail: newParentEmail,
          classGroupId: newClassId || null,
          totalSessions: newTotalSessions,
          pricePerSession: newPricePerSession,
          installments: newInstallments,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Đã thêm học viên mới thành công!');
        setIsAddModalOpen(false);
        // Reset form
        setNewName('');
        setNewEmail('');
        setNewPhone('');
        setNewParentName('');
        setNewParentEmail('');
        setNewClassId('');
        setNewInstallments([]);
        fetchData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName) {
      alert('Vui lòng nhập tên học viên');
      return;
    }

    try {
      setIsSubmittingEdit(true);
      const res = await fetch(`/api/students/${editingStudentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          parentName: editParentName,
          parentEmail: editParentEmail,
          classGroupId: editClassId || null,
          totalSessions: editTotalSessions,
          pricePerSession: editPricePerSession,
          installments: editInstallments,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Cập nhật thông tin học viên thành công!');
        setIsEditModalOpen(false);
        fetchData();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase()));

    const isDueSoon =
      s.nextInstallment &&
      Math.ceil(
        (new Date(s.nextInstallment.dueDate).getTime() - new Date().setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      ) <= 7;

    if (filterUrgent) return matchSearch && (s.isUrgent || isDueSoon);
    return matchSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-600" />
            Học Viên & Quản Lý Học Phí
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tiến độ giờ học, thời gian các đợt đóng học phí và thông tin phụ huynh
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterUrgent(!filterUrgent)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              filterUrgent
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Cần thu học phí / Sắp đến hạn</span>
          </button>

          <button
            onClick={() => {
              setNewInstallments([]);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Học Viên Mới</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm theo tên học viên, email hoặc phụ huynh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 whitespace-nowrap">Học viên</th>
                <th className="py-3 px-3 whitespace-nowrap">Lớp đang học</th>
                <th className="py-3 px-3 whitespace-nowrap">Tiến độ học</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Số giờ còn lại</th>
                <th className="py-3 px-3 whitespace-nowrap">Đợt đóng học phí tiếp theo</th>
                <th className="py-3 px-4 text-right whitespace-nowrap sticky right-0 bg-slate-50/90 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Không tìm thấy học viên nào.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const tHours = Number(st.totalHours ?? st.totalSessions ?? 0);
                  const cHours = Number(st.completedHours ?? st.completedSessions ?? 0);
                  const rHours = Number(st.remainingHours ?? st.remainingSessions ?? 0);
                  const percent = tHours > 0 ? Math.min(100, Math.round((cHours / tHours) * 100)) : 0;

                  // Lấy thông tin đợt đóng học phí tiếp theo
                  let dueDateStr = '';
                  let installmentAmount = 0;
                  let installmentNote = '';

                  if (st.nextInstallment) {
                    const dueObj = new Date(st.nextInstallment.dueDate);
                    dueDateStr = dueObj.toLocaleDateString('vi-VN');
                    installmentAmount = Number(st.nextInstallment.amount) || 0;
                    installmentNote = st.nextInstallment.note || '';
                  }

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Học viên */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 font-bold text-emerald-800 flex items-center justify-center text-xs shrink-0">
                            {st.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">
                              {st.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 whitespace-nowrap">
                              {st.phone && (
                                <span className="flex items-center gap-1 font-medium text-slate-600">
                                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                  {st.phone}
                                </span>
                              )}
                              {st.email && (
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Mail className="w-3 h-3 shrink-0" />
                                  {st.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Lớp đang học */}
                      <td className="py-3 px-3 align-middle">
                        {st.classMembers && st.classMembers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {st.classMembers.map((cm: any) => (
                              <span
                                key={cm.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200/80 whitespace-nowrap"
                              >
                                <GraduationCap className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{cm.classGroup?.name}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium text-xs whitespace-nowrap">
                            Chưa xếp lớp
                          </span>
                        )}
                      </td>

                      {/* Tiến độ giờ học */}
                      <td className="py-3 px-3 align-middle">
                        <div className="space-y-1 w-36">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 whitespace-nowrap">
                              {formatHours(cHours)} / {formatHours(tHours)} giờ
                            </span>
                            <span className="text-slate-400 font-medium text-[11px]">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                            <div
                              className={`h-full rounded-full transition-all ${
                                st.isUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Số giờ còn lại */}
                      <td className="py-3 px-3 text-center align-middle whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full whitespace-nowrap border ${
                            rHours <= 1.5
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : rHours <= 3
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>Còn {formatHours(rHours)} giờ</span>
                        </span>
                      </td>

                      {/* Đợt đóng học phí tiếp theo (chỉ hiện ngày & số tiền/ghi chú) */}
                      <td className="py-3 px-3 align-middle whitespace-nowrap">
                        {st.nextInstallment ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{dueDateStr}</span>
                            </div>
                            <div className="text-xs text-emerald-700 font-bold">
                              {installmentAmount.toLocaleString('vi-VN')} đ
                              {installmentNote && (
                                <span className="ml-1.5 text-[11px] font-normal text-slate-500">
                                  ({installmentNote})
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Chưa có lịch đóng
                          </span>
                        )}
                      </td>

                      {/* Thao tác (Cố định ở mép phải, không bao giờ bị che khuất) */}
                      <td className="py-3 px-4 text-right align-middle whitespace-nowrap sticky right-0 bg-white/95 backdrop-blur-xs shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditStudent(st)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold shadow-xs"
                            title="Chỉnh sửa thông tin học viên"
                          >
                            <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sửa</span>
                          </button>

                          <Link
                            href={`/students/${st.id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <span>Hồ sơ</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Thêm Học Viên Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-sm">
              {/* Thông tin cơ bản */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Thông tin cá nhân
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ Tên Học Viên *
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn A"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số Điện Thoại (SĐT) *
                    </label>
                    <input
                      type="tel"
                      placeholder="0901234567"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Học Viên
                  </label>
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tên Phụ Huynh
                    </label>
                    <input
                      type="text"
                      placeholder="Chị Lan"
                      value={newParentName}
                      onChange={(e) => setNewParentName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Phụ Huynh
                    </label>
                    <input
                      type="email"
                      placeholder="parent@gmail.com"
                      value={newParentEmail}
                      onChange={(e) => setNewParentEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Lớp học */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Xếp lớp học
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lớp Đang Học (Tùy chọn)
                  </label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white"
                  >
                    <option value="">-- Chưa xếp lớp (xếp sau) --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gói giờ học */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    3. Gói giờ học & Đơn giá
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Dự kiến: {(Number(newTotalSessions || 0) * Number(newPricePerSession || 0)).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tổng Số Giờ (Gói)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={newTotalSessions}
                      onChange={(e) => setNewTotalSessions(e.target.value)}
                      placeholder="VD: 20 hoặc 30"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Đơn Giá / Giờ (VNĐ)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      value={newPricePerSession}
                      onChange={(e) => setNewPricePerSession(e.target.value)}
                      placeholder="VD: 300000"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Các Đợt Đóng Học Phí */}
              <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Các Đợt Đóng Học Phí</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Chọn các ngày đóng học phí và số tiền cho mỗi đợt
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewInstallmentRow}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm đợt đóng</span>
                  </button>
                </div>

                {newInstallments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center bg-white rounded-xl border border-dashed border-slate-200">
                    Chưa thêm đợt đóng nào. Nhấn <strong>&quot;+ Thêm đợt đóng&quot;</strong> để thiết lập lịch đóng học phí.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {newInstallments.map((inst, index) => (
                      <div
                        key={inst.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-2"
                      >
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Ngày Đóng #{index + 1} *
                          </label>
                          <input
                            type="date"
                            value={inst.dueDate}
                            onChange={(e) =>
                              handleUpdateNewInstallmentRow(inst.id, 'dueDate', e.target.value)
                            }
                            required
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="w-36">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Số Tiền (VNĐ) *
                          </label>
                          <input
                            type="number"
                            placeholder="Số tiền"
                            value={inst.amount}
                            onChange={(e) =>
                              handleUpdateNewInstallmentRow(inst.id, 'amount', e.target.value)
                            }
                            required
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Ghi Chú
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Đợt 1, Gói 20b..."
                            value={inst.note}
                            onChange={(e) =>
                              handleUpdateNewInstallmentRow(inst.id, 'note', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:pt-4">
                          <button
                            type="button"
                            onClick={() => handleRemoveNewInstallmentRow(inst.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            title="Xóa đợt này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                >
                  {isSubmittingAdd ? 'Đang lưu...' : 'Lưu Học Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Pencil className="w-5 h-5 text-emerald-600" />
                <span>Chỉnh Sửa Thông Tin Học Viên</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-4 text-sm">
              {/* Thông tin cơ bản */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Thông tin cá nhân
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ Tên Học Viên *
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn A"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số Điện Thoại (SĐT) *
                    </label>
                    <input
                      type="tel"
                      placeholder="0901234567"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Học Viên
                  </label>
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tên Phụ Huynh
                    </label>
                    <input
                      type="text"
                      placeholder="Chị Lan"
                      value={editParentName}
                      onChange={(e) => setEditParentName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Phụ Huynh
                    </label>
                    <input
                      type="email"
                      placeholder="parent@gmail.com"
                      value={editParentEmail}
                      onChange={(e) => setEditParentEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Lớp học */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Xếp lớp học
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lớp Đang Học
                  </label>
                  <select
                    value={editClassId}
                    onChange={(e) => setEditClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white"
                  >
                    <option value="">-- Chưa xếp lớp (hoặc bỏ lớp) --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gói giờ học */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    3. Gói giờ học & Đơn giá
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Dự kiến: {(Number(editTotalSessions || 0) * Number(editPricePerSession || 0)).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tổng Số Giờ (Gói)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={editTotalSessions}
                      onChange={(e) => setEditTotalSessions(e.target.value)}
                      placeholder="VD: 20 hoặc 30"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Đơn Giá / Giờ (VNĐ)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      value={editPricePerSession}
                      onChange={(e) => setEditPricePerSession(e.target.value)}
                      placeholder="VD: 300000"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Các Đợt Đóng Học Phí */}
              <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Các Đợt Đóng Học Phí</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Chọn các ngày đóng học phí và số tiền cho mỗi đợt
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEditInstallmentRow}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm đợt đóng</span>
                  </button>
                </div>

                {editInstallments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center bg-white rounded-xl border border-dashed border-slate-200">
                    Chưa có đợt đóng học phí nào. Nhấn <strong>&quot;+ Thêm đợt đóng&quot;</strong> để lên lịch.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {editInstallments.map((inst, index) => (
                      <div
                        key={inst.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-2"
                      >
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Ngày Đóng #{index + 1} *
                          </label>
                          <input
                            type="date"
                            value={inst.dueDate}
                            onChange={(e) =>
                              handleUpdateEditInstallmentRow(inst.id, 'dueDate', e.target.value)
                            }
                            required
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="w-32">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Số Tiền (VNĐ) *
                          </label>
                          <input
                            type="number"
                            placeholder="Số tiền"
                            value={inst.amount}
                            onChange={(e) =>
                              handleUpdateEditInstallmentRow(inst.id, 'amount', e.target.value)
                            }
                            required
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="w-28">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Trạng Thái
                          </label>
                          <select
                            value={inst.status || 'PENDING'}
                            onChange={(e) =>
                              handleUpdateEditInstallmentRow(inst.id, 'status', e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                          >
                            <option value="PENDING">Chưa đóng</option>
                            <option value="PAID">Đã đóng</option>
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Ghi Chú
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Đợt 1, Cọc..."
                            value={inst.note}
                            onChange={(e) =>
                              handleUpdateEditInstallmentRow(inst.id, 'note', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:pt-4">
                          <button
                            type="button"
                            onClick={() => handleRemoveEditInstallmentRow(inst.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            title="Xóa đợt này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                >
                  {isSubmittingEdit ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
