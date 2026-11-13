import type { ReactNode } from "react";
export function AdminPageHeader({ eyebrow = "Workspace", title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="admin-page-heading"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-rysen-orange">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div>{actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}</header>;
}
