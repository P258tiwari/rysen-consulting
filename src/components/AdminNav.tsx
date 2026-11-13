import { LayoutDashboard, BookOpen, BriefcaseBusiness, Inbox } from "lucide-react";
import { NavLink } from "react-router-dom";
const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/resources", label: "Articles", icon: BookOpen },
  { to: "/admin/case-studies", label: "Case studies", icon: BriefcaseBusiness },
  { to: "/admin/contacts", label: "Enquiries", icon: Inbox },
];
export function AdminNav() {
  return <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:gap-2 lg:p-4">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/admin"} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-rysen-orange text-white shadow-sm" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon className="h-5 w-5" />{label}</NavLink>)}</nav>;
}
