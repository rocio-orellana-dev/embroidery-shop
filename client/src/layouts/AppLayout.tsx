import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
// import { SiteFooter } from "@/components/SiteFooter"; // si existe

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {/* <SiteFooter /> */}
    </div>
  );
}
