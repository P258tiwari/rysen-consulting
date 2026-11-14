import { Link } from "react-router-dom";

export function Logo({ light = false, large = false }: { light?: boolean; large?: boolean }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="RYSEN Leadership and Consulting home">
      <img
        src={light ? "/assets/rysen-logo-white.png" : "/assets/rysen-logo-black.png"}
        alt="RYSEN Leadership and Consulting"
        className={`w-auto object-contain ${large ? "h-16 sm:h-20" : "h-14 sm:h-16"}`}
        decoding="async"
      />
    </Link>
  );
}
