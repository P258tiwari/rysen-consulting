import { useEffect, useState } from "react";
import { BookOpen, BriefcaseBusiness, Inbox, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { getBackendHealth } from "../utils/api";

type Health = Awaited<ReturnType<typeof getBackendHealth>>;

export function AdminDashboard() {
  const [health, setHealth] = useState<Health | null>(null);
  const [message, setMessage] = useState("Connecting to backend…");

  function refresh() {
    getBackendHealth()
      .then((result) => {
        setHealth(result);
        setMessage("Backend connected and persistent storage is ready.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Backend is unavailable."));
  }

  useEffect(refresh, []);

  const cards = [
    { label: "Backend blogs", value: health?.counts.blogs ?? "—", icon: BookOpen, to: "/admin/resources" },
    { label: "Backend case studies", value: health?.counts.caseStudies ?? "—", icon: BriefcaseBusiness, to: "/admin/case-studies" },
    { label: "Contact entries", value: health?.counts.contacts ?? "—", icon: Inbox, to: "/admin/contacts" },
  ];

  return (
    <>
      <Seo title="Content Admin" description="RYSEN backend content and enquiry management." path="/admin" />
      <section className="bg-rysen-ink py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Admin Dashboard</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Content and enquiries backend</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">Manage published blogs, case studies, and every contact-form submission from one persistent backend.</p>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map(({ label, value, icon: Icon, to }) => (
              <Link key={label} to={to} className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-executive">
                <Icon className="h-6 w-6 text-rysen-orange" aria-hidden="true" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/50">{label}</p>
                <p className="mt-2 font-display text-5xl text-rysen-ink">{value}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-rysen-orange" aria-hidden="true" />
                <h2 className="text-2xl font-semibold text-rysen-ink">Backend status</h2>
              </div>
              <p className="mt-4 rounded-lg bg-rysen-ivory px-4 py-3 font-semibold text-rysen-charcoal/75">{message}</p>
              <dl className="mt-5 grid gap-3 text-sm text-rysen-charcoal/70">
                <div className="flex justify-between gap-4"><dt>Storage</dt><dd className="font-bold text-rysen-ink">{health?.storage ?? "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt>Password login</dt><dd className="font-bold text-rysen-ink">{health?.passwordLoginEnabled ? "Enabled" : "Not configured"}</dd></div>
                <div className="flex justify-between gap-4"><dt>Access mode</dt><dd className="font-bold text-rysen-ink">Password-protected portal</dd></div>
              </dl>
              <button type="button" onClick={refresh} className="mt-5 rounded-full bg-rysen-ink px-5 py-2.5 text-sm font-bold text-white">Refresh status</button>
          </div>
        </div>
      </section>
    </>
  );
}
