import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { forwardRef } from "react";

export const DashboardLayout = forwardRef<HTMLDivElement>(function DashboardLayout(_props, ref) {
  return (
    <div ref={ref} className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
