import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'TutorFlow - Nền Tảng Quản Lý Lớp Học & Lịch Dạy Gia Sư',
  description: 'Quản lý lịch học trực quan, theo dõi tiến độ học tập và quản lý học phí học viên',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
