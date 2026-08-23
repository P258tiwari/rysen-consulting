import { NavLink } from "react-router-dom";

const links = [
  ["/admin", "Overview"],
  ["/admin/resources", "Blogs"],
  ["/admin/case-studies", "Case Studies"],
  ["/admin/contacts", "Contact Entries"],
] as const;

export function AdminNav() {
  return (
    <nav className="border-b border-rysen-ink/10 bg-white" aria-label="Admin sections">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                isActive ? "bg-rysen-orange text-white" : "bg-rysen-ivory text-rysen-charcoal hover:text-rysen-orange"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
