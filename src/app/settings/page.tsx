'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setFullName(res.data.fullName || '');
          setEmail(res.data.email || '');
          setPhone(res.data.phone || '');
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải thông tin giáo viên:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
        }),
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(`Máy chủ phản hồi không đúng định dạng (${res.status})`);
      }

      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert('Lỗi: ' + (data.error || 'Không thể lưu thông tin'));
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          Cài Đặt Thông Tin Giáo Viên
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cài đặt thông tin cá nhân của giáo viên để hiển thị trên hệ thống và các báo cáo học tập gửi phụ huynh
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã lưu cập nhật thông tin giáo viên thành công!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Đang tải thông tin cài đặt...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 text-sm">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Hồ Sơ Giáo Viên</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các thông tin liên hệ chính sẽ được hiển thị cho phụ huynh và học viên
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Họ và Tên Giáo Viên *</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="VD: Nguyễn Đình Linh"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Email Giáo Viên</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: giaovien@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Số Điện Thoại / Zalo</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0901234567"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs bg-white text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dữ liệu được lưu trữ an toàn trên máy chủ của bạn</span>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'Lưu Cài Đặt'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
