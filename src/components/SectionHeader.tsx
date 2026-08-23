type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  inverted?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left",
  inverted = false,
}: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-rysen-orange">
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-4xl leading-tight md:text-5xl ${
          inverted ? "text-white" : "text-rysen-ink"
        }`}
      >
        {title}
      </h2>
      {text && (
        <p className={`mt-5 text-lg leading-8 ${inverted ? "text-white/70" : "text-rysen-charcoal/70"}`}>
          {text}
        </p>
      )}
    </div>
  );
}
