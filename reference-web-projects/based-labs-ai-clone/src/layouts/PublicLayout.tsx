import { Outlet } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { forwardRef } from "react";

export const PublicLayout = forwardRef<HTMLDivElement>(function PublicLayout(_props, ref) {
  return (
    <div ref={ref} className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
});
