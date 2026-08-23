import { ArrowRight } from "lucide-react";
import { Link, type LinkProps } from "react-router-dom";

type ButtonLinkProps = LinkProps & {
  variant?: "primary" | "secondary" | "dark";
  showIcon?: boolean;
};

export function ButtonLink({
  children,
  variant = "primary",
  showIcon = true,
  className = "",
  ...props
}: ButtonLinkProps) {
  const variants = {
    primary:
      "bg-orange-sheen text-white shadow-warm hover:-translate-y-0.5 hover:shadow-executive",
    secondary:
      "border border-rysen-ink/20 bg-white/70 text-rysen-ink hover:border-rysen-orange hover:bg-white",
    dark: "bg-rysen-ink text-white hover:-translate-y-0.5 hover:bg-black",
  };

  return (
    <Link
      className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {showIcon && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </Link>
  );
}
