import { ButtonLink } from "../components/ButtonLink";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";

export function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The requested RYSEN page could not be found." path="/404" />
      <section className="section bg-rysen-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-rysen-orange">404</p>
            <h1 className="mt-5 font-display text-6xl">This page has moved out of view.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
              The leadership journey continues from the home page or the services overview.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink to="/">Return Home</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
