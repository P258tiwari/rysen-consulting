import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";

export function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy" description="Privacy policy for RYSEN Leadership and Coaching." path="/privacy-policy" />
      <section className="section bg-rysen-ivory">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow text-rysen-orange">Privacy Policy</p>
            <h1 className="font-display text-5xl text-rysen-ink">Privacy Policy</h1>
            <div className="prose-rysen mt-8">
              <p>
                RYSEN Leadership and Coaching respects the privacy of clients, participants, and website visitors. Information submitted through this website is used to respond to enquiries, manage prospective engagements, and share relevant updates when requested.
              </p>
              <p>
                We may collect contact details, organisation information, role details, and messages shared through the contact form. We do not sell personal information.
              </p>
              <p>
                Coaching, facilitation, assessment, and consulting engagements may involve additional confidentiality and data handling terms agreed directly with the client organisation.
              </p>
              <p>
                To request access, correction, or deletion of information you have shared with us, contact bidisha@rysencoaching.com.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
