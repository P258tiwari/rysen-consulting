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
    <div className="flex min-h-screen flex-col bg-rysen-soft">
      <ScrollToTop />
      <header className="border-b border-white/10 bg-rysen-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo light />
            <span className="hidden h-9 w-px bg-white/15 sm:block" />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
              <ShieldCheck className="h-4 w-4 text-rysen-orange" aria-hidden="true" /> Admin Console
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/75 transition hover:border-white/30 hover:text-white">
              View Website <SquareArrowOutUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full bg-rysen-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-rysen-ember">
              Sign Out <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <AdminNav />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-rysen-ink text-white/55">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>RYSEN secure administration</p>
          <p>Blogs · Case Studies · Contact Entries</p>
        </div>
      </footer>
    </div>
  );
}
