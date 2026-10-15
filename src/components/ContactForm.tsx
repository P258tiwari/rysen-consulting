import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { services } from "../data/content";
import { submitContactEntry } from "../utils/api";

const initial = {
  name: "",
  email: "",
  phone: "",
  organisation: "",
  role: "",
  interest: "",
  message: "",
};

type RecaptchaApi = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

function recaptchaApi() {
  return (window as Window & { grecaptcha?: RecaptchaApi }).grecaptcha;
}

function loadRecaptcha(siteKey: string) {
  if (recaptchaApi()) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("rysen-recaptcha-v3") as HTMLScriptElement | null;
    const ready = () => recaptchaApi() ? resolve() : reject(new Error("Bot protection could not be loaded."));
    if (existing) {
      existing.addEventListener("load", ready, { once: true });
      existing.addEventListener("error", () => reject(new Error("Bot protection could not be loaded.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "rysen-recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}&trustedtypes=true`;
    script.async = true;
    script.defer = true;
    script.onload = ready;
    script.onerror = () => reject(new Error("Bot protection could not be loaded."));
    document.head.appendChild(script);
  });
}

async function createRecaptchaToken(siteKey: string) {
  await loadRecaptcha(siteKey);
  const api = recaptchaApi();
  if (!api) throw new Error("Bot protection is unavailable. Please refresh and try again.");
  return new Promise<string>((resolve, reject) => {
    api.ready(() => api.execute(siteKey, { action: "contact" }).then(resolve).catch(reject));
  });
}

export function ContactForm() {
  const recaptchaSiteKey = String(import.meta.env.VITE_RECAPTCHA_SITE_KEY || "").trim();
  const [values, setValues] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (recaptchaSiteKey) void loadRecaptcha(recaptchaSiteKey).catch(() => undefined);
  }, [recaptchaSiteKey]);

  function update(field: keyof typeof initial, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
    setSubmitted(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name || !values.email || !values.interest || !values.message) {
      setError("Please complete your name, work email, area of interest, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError("Please enter a valid work email address.");
      return;
    }
    setSubmitting(true);
    setSubmitted(false);
    try {
      if (!recaptchaSiteKey && import.meta.env.PROD) throw new Error("Bot protection is not configured. Please contact us by email.");
      const recaptchaToken = recaptchaSiteKey ? await createRecaptchaToken(recaptchaSiteKey) : "";
      await submitContactEntry({ ...values, recaptchaToken });
      setSubmitted(true);
      setValues(initial);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Your enquiry could not be saved. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "min-h-12 rounded-md border border-rysen-ink/10 bg-white px-4 py-3 text-sm text-rysen-ink outline-none transition placeholder:text-rysen-charcoal/40 focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10";

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-executive md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <input className={fieldClass} value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" aria-label="Name" />
        <input className={fieldClass} value={values.email} onChange={(e) => update("email", e.target.value)} placeholder="Work Email" aria-label="Work Email" />
        <input className={fieldClass} value={values.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" aria-label="Phone" />
        <input className={fieldClass} value={values.organisation} onChange={(e) => update("organisation", e.target.value)} placeholder="Organisation" aria-label="Organisation" />
        <input className={fieldClass} value={values.role} onChange={(e) => update("role", e.target.value)} placeholder="Role" aria-label="Role" />
        <select className={fieldClass} value={values.interest} onChange={(e) => update("interest", e.target.value)} aria-label="Interested In">
          <option value="">Interested In</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
          <option value="Speaking Engagement">Speaking Engagement</option>
        </select>
      </div>
      <textarea
        className={`${fieldClass} mt-4 min-h-36 w-full resize-y`}
        value={values.message}
        onChange={(e) => update("message", e.target.value)}
        placeholder="Message"
        aria-label="Message"
      />
      <p className="mt-4 text-xs leading-5 text-rysen-charcoal/75">
        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline hover:text-rysen-orange">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline hover:text-rysen-orange">Terms of Service</a> apply.
      </p>
      {error && <p className="mt-4 text-sm font-semibold text-rysen-ember">{error}</p>}
      {submitted && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Thank you. Your enquiry has been saved for follow-up.
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-sheen px-6 py-3 text-sm font-bold text-white shadow-warm transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Verifying & Sending…" : "Send Enquiry"} <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
