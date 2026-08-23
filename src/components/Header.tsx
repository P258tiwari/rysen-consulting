import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { services } from "../data/content";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-2 text-sm font-semibold transition ${
    isActive ? "text-rysen-orange" : "text-rysen-charcoal hover:text-rysen-orange"
  }`;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-rysen-ivory/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-rysen-charcoal transition hover:text-rysen-orange"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((open) => !open)}
            >
              Services <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full w-80 pt-3">
                <div className="rounded-lg border border-rysen-ink/10 bg-white p-3 shadow-executive">
                  <Link
                    to="/services"
                    className="block rounded-md px-4 py-3 text-sm font-bold text-rysen-ink hover:bg-rysen-ivory"
                  >
                    Services overview
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="block rounded-md px-4 py-3 text-sm font-semibold text-rysen-charcoal hover:bg-rysen-ivory hover:text-rysen-orange"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavLink to="/case-studies" className={navLinkClass}>
            Case Studies
          </NavLink>
          <NavLink to="/resources" className={navLinkClass}>
            Resources
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink to="/contact" className="min-h-10 px-5 py-2.5">
            Book a Discovery Call
          </ButtonLink>
        </div>
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rysen-ink/10 bg-white text-rysen-ink lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-rysen-ink/10 bg-rysen-ivory px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Mobile navigation">
            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/services", "Services"],
              ["/case-studies", "Case Studies"],
              ["/resources", "Resources"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-4 py-3 font-semibold text-rysen-charcoal hover:bg-white"
              >
                {label}
              </Link>
            ))}
            <div className="grid gap-1 border-l border-rysen-orange/25 pl-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-rysen-charcoal/75 hover:bg-white hover:text-rysen-orange"
                >
                  {service.title}
                </Link>
              ))}
            </div>
            <ButtonLink to="/contact" onClick={() => setMobileOpen(false)} className="mt-2">
              Book a Discovery Call
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
