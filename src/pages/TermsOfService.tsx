import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";

export function TermsOfService() {
  return (
    <>
      <Seo title="Terms of Service" description="Terms of service for RYSEN Leadership and Coaching." path="/terms-of-service" />
      <section className="section bg-rysen-ivory">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow text-rysen-orange">Terms of Service</p>
            <h1 className="font-display text-5xl text-rysen-ink">Terms of Service</h1>
            <div className="prose-rysen mt-8">
              <p>
                This website provides information about RYSEN Leadership and Coaching services, speaking engagements, and insights. Website content is for general information and does not create a client engagement by itself.
              </p>
              <p>
                Consulting, coaching, facilitation, assessment, and speaking services are governed by written proposals or agreements confirmed with each client.
              </p>
              <p>
                Website copy, visual identity elements, programme descriptions, and resources may not be reproduced or republished without permission.
              </p>
              <p>
                RYSEN may update website content, service descriptions, and these terms from time to time.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
