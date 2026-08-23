import { Link } from "react-router-dom";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="RYSEN Leadership and Coaching home">
      <img
        src={light ? "/assets/rysen-logo-white.png" : "/assets/rysen-logo-black.png"}
        alt="RYSEN Leadership and Consulting"
        className="h-14 w-auto object-contain sm:h-16"
        decoding="async"
      />
    </Link>
  );
}
