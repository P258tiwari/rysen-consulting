import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { contact, services } from "../data/content";
import { Logo } from "./Logo";
import { NewsletterSignup } from "./NewsletterSignup";

export function Footer() {
  return (
    <footer className="bg-rysen-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Logo light />
          <p className="mt-6 max-w-sm leading-7 text-white/70">
            Leadership development, executive coaching, talent strategy, and culture transformation for organisations ready to rise.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-white/70">
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4 text-rysen-orange" aria-hidden="true" /> {contact.email}
            </a>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-white">
              <Phone className="h-4 w-4 text-rysen-orange" aria-hidden="true" /> {contact.phone}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rysen-orange" aria-hidden="true" /> India, UK, US & Gulf Markets
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/50">Services</h3>
          <div className="mt-5 grid gap-3">
            {services.map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`} className="text-sm text-white/70 hover:text-white">
                {service.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/50">Company</h3>
          <div className="mt-5 grid gap-3">
            {[
              ["/about", "About"],
              ["/case-studies", "Case Studies"],
              ["/testimonials", "Testimonials"],
              ["/book-speaking", "Book & Speaking"],
              ["/resources", "Resources"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="text-sm text-white/70 hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/50">Newsletter</h3>
          <p className="mt-5 text-sm leading-6 text-white/70">
            Receive occasional notes on leadership, culture, AI adoption, and executive presence.
          </p>
          <NewsletterSignup compact dark />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} RYSEN Leadership and Coaching. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
