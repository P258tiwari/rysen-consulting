import { ArrowRight, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { subscribeNewsletter } from "../utils/api";

type NewsletterSignupProps = {
  compact?: boolean;
  dark?: boolean;
};

export function NewsletterSignup({ compact = false, dark = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const result = await subscribeNewsletter(email, website);
      setMessage(result.alreadySubscribed ? "You are already on the list." : "You’re subscribed. Welcome to RYSEN.");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Subscription could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className={compact ? "mt-5" : "mt-7"}>
      <label className="sr-only" htmlFor={compact ? "footer-newsletter-email" : "article-newsletter-email"}>Work email</label>
      <div className={`flex gap-2 ${compact ? "" : "flex-col sm:flex-row"}`}>
        <div className="relative min-w-0 flex-1">
          <Mail className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-white/45" : "text-rysen-charcoal/45"}`} aria-hidden="true" />
          <input
            id={compact ? "footer-newsletter-email" : "article-newsletter-email"}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Work email"
            className={`min-h-12 w-full rounded-full border py-3 pl-11 pr-4 text-sm outline-none ${dark ? "border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:border-rysen-orange" : "border-rysen-ink/10 bg-white text-rysen-ink placeholder:text-rysen-charcoal/40 focus:border-rysen-orange"}`}
          />
        </div>
        <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(event) => setWebsite(event.target.value)} name="website" />
        <button disabled={submitting} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-rysen-orange px-5 py-3 text-sm font-bold text-white transition hover:bg-rysen-amber disabled:opacity-60">
          {submitting ? "Joining…" : "Join"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {message && <p role="status" className={`mt-3 text-sm font-semibold ${dark ? "text-white/75" : "text-rysen-charcoal/70"}`}>{message}</p>}
    </form>
  );
}
