import { Outlet } from "react-router-dom";
import { PublicHeader } from "@/components/Header";
import { PublicFooter } from "@/components/Footer";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
