import { Mail, Phone } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { contact } from "../data/content";

export function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description="Contact RYSEN Leadership and Coaching to discuss leadership development, coaching, AI, talent strategy, culture transformation, or speaking engagements."
        path="/contact"
      />
      <section className="page-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h1 className="hero-title">Let us build leaders who are ready for what comes next.</h1>
            <div className="mt-8 grid gap-4 text-white/80">
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 text-lg font-semibold hover:text-white">
                <Mail className="h-5 w-5 text-rysen-orange" aria-hidden="true" /> {contact.email}
              </a>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-3 text-lg font-semibold hover:text-white">
                <Phone className="h-5 w-5 text-rysen-orange" aria-hidden="true" /> {contact.phone}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
