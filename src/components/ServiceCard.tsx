import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "../data/content";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-rysen-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-rysen-orange/40 hover:shadow-warm focus:outline-none focus:ring-2 focus:ring-rysen-orange"
    >
      <img src={service.image} alt={service.imageAlt} className="aspect-[16/10] w-full object-cover" loading="lazy" decoding="async" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm font-bold text-rysen-orange">{String(index + 1).padStart(2, "0")}</span>
          <span className="rounded-full bg-rysen-ivory p-3 text-rysen-orange transition group-hover:bg-rysen-orange group-hover:text-white">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-7 text-2xl font-semibold leading-tight text-rysen-ink">{service.title}</h3>
        <p className="mt-4 flex-1 leading-7 text-rysen-charcoal/70">{service.shortDescription}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {service.outcomes.map((outcome) => (
            <span key={outcome} className="rounded-full bg-rysen-soft px-3 py-1 text-xs font-semibold text-rysen-charcoal/75">
              {outcome}
            </span>
          ))}
        </div>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-rysen-orange">
          Explore practice area <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
