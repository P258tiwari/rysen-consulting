import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Seo } from "../components/Seo";
import { getAdminSession, loginAdmin } from "../utils/api";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from || "/admin";

  useEffect(() => {
    getAdminSession()
      .then((session) => { if (session.authenticated) navigate(destination, { replace: true }); })
      .catch(() => undefined);
  }, [destination, navigate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) { setError("Enter the admin password."); return; }
    setSubmitting(true);
    setError("");
    try {
      await loginAdmin(password);
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Admin login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-rysen-ink text-white">
      <Seo title="Admin Login" description="Secure RYSEN administration login." path="/admin/login" noIndex />
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Logo light />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/70"><ShieldCheck className="h-4 w-4 text-rysen-orange" /> Secure Admin</span>
        </div>
      </header>
      <main className="grid flex-1 place-items-center px-4 py-12 sm:px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-orange-sheen p-8 text-white sm:p-10">
            <LockKeyhole className="h-10 w-10" aria-hidden="true" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-white/70">Protected Workspace</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Manage RYSEN content securely.</h1>
            <p className="mt-5 leading-7 text-white/80">One password gives authorised administrators complete access to blogs, categories, case studies, and confidential enquiries.</p>
          </div>
          <form onSubmit={submit} className="p-8 text-rysen-ink sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rysen-orange">Administrator Login</p>
            <h2 className="mt-3 text-3xl font-semibold">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-rysen-charcoal/60">Enter the secure password configured on the website server.</p>
            <label className="mt-8 block">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/55">Admin password</span>
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-rysen-charcoal/35" aria-hidden="true" />
                <input type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} className="min-h-12 w-full rounded-md border border-rysen-ink/10 bg-rysen-soft py-3 pl-12 pr-4 outline-none transition focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10" placeholder="Admin password" autoFocus />
              </div>
            </label>
            {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button disabled={submitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-rysen-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-60">{submitting ? "Signing in…" : "Sign in to Admin"}</button>
          </form>
        </div>
      </main>
      <footer className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/40">RYSEN administration · Authorised access only</footer>
    </div>
  );
}
