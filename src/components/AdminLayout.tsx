import { LogOut, ShieldCheck, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAdminSession, logoutAdmin } from "../utils/api";
import { AdminNav } from "./AdminNav";
import { Logo } from "./Logo";
import { ScrollToTop } from "./ScrollToTop";

export function AdminLayout() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getAdminSession()
      .then((session) => setAuthenticated(session.authenticated))
      .catch(() => setAuthenticated(false));
    const handleUnauthorized = () => setAuthenticated(false);
    window.addEventListener("rysen-admin-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("rysen-admin-unauthorized", handleUnauthorized);
  }, []);

  async function signOut() {
    await logoutAdmin().catch(() => undefined);
    setAuthenticated(false);
    navigate("/admin/login", { replace: true });
  }

  if (authenticated === null) {
    return <div className="grid min-h-screen place-items-center bg-rysen-ink font-semibold text-white/70">Checking admin session…</div>;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="admin-shell min-h-screen bg-[#f5f6f8]">
      <ScrollToTop />
      <aside className="bg-[#171b23] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col">
        <div className="flex items-center justify-between px-6 py-6 lg:block"><Logo light /><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Workspace / Rysen</p></div>
        <p className="hidden px-8 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 lg:block">Manage</p>
        <AdminNav />
        <div className="mt-auto hidden border-t border-white/10 p-6 lg:block"><ShieldCheck className="mb-3 h-5 w-5 text-rysen-orange" /><p className="text-sm font-semibold">Your admin workspace</p><p className="mt-2 text-xs leading-5 text-white/45">Content, stories and conversations in one place.</p></div>
      </aside>
      <div className="min-w-0 lg:ml-60">
        <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div><p className="text-xs text-slate-400">RYSEN / Administration</p><p className="mt-1 text-sm font-semibold">{location.pathname.includes("resources") ? "Articles" : location.pathname.includes("case-studies") ? "Case studies" : location.pathname.includes("contacts") ? "Enquiries" : "Overview"}</p></div>
          <div className="flex items-center gap-3"><Link to="/" target="_blank" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rysen-orange">View website <SquareArrowOutUpRight className="h-4 w-4" /></Link><span className="h-6 w-px bg-slate-200" /><button type="button" onClick={signOut} className="flex items-center gap-2 text-sm text-slate-500 hover:text-rysen-orange">Sign out <LogOut className="h-4 w-4" /></button></div>
        </header>
        <main className="admin-main min-w-0 pb-12"><Outlet key={location.pathname} /></main>
        <footer className="px-5 py-5 text-xs text-slate-400 sm:px-8">RYSEN administration &middot; Leadership that moves forward.</footer>
      </div>
    </div>
  );
}
