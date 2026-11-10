import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/app";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useLocalStorage(STORAGE_KEYS.sidebarCollapsed, false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      <AppHeader sidebarCollapsed={collapsed} />
      <main
        className="min-h-[calc(100vh-3.5rem)] mt-14 p-6 transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <Outlet />
      </main>
    </div>
  );
}
