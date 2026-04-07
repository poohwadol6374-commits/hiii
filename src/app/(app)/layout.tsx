"use client";

import TopBar from "@/components/app/TopBar";
import Sidebar from "@/components/app/Sidebar";
import LumaFab from "@/components/app/LumaFab";
import BottomNav from "@/components/app/BottomNav";
import { ToastProvider } from "@/components/app/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-lumina-50">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
      <LumaFab />
    </ToastProvider>
  );
}
