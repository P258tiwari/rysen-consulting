import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Images, Info, Maximize2, X } from "lucide-react";
import { workGallery } from "../data/workGallery";
import { Modal } from "./Modal";
import { GalleryImage } from "./GalleryImage";
import { Reveal } from "./Reveal";

const photos = workGallery.flatMap((group) => group.images.map((image, index) => ({ ...image, group, index })));
const previewIds = ["work-05", "work-01", "work-03", "work-09", "work-18", "work-20"];
const previewGroups = previewIds.flatMap(id => workGallery.filter(group => group.id === id));
const control = "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-current/15 transition hover:bg-rysen-orange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rysen-orange";

export function WorkGallery() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const selected = active === null ? null : photos[active];
  const groupPhotos = selected ? photos.filter(photo => photo.group.id === selected.group.id) : [];
  const selectGroupPhoto = (index: number) => {
    const photo = groupPhotos[index];
    if (photo) setActive(photos.findIndex(item => item.src === photo.src));
  };
  const showPhoto = (index: number) => {
    setActive(index);
    setOpen(true);
    scrollArea.current?.scrollTo({ top: 0 });
  };
  const close = () => { setOpen(false); setActive(null); };
  const step = (direction: number) => {
    if (!selected || groupPhotos.length < 2) return;
    selectGroupPhoto((selected.index + direction + groupPhotos.length) % groupPhotos.length);
    scrollArea.current?.scrollTo({ top: 0 });
  };

  return (
    <section id="our-work-in-focus" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Inside our learning journeys</p>
            <h2 className="mt-4 font-display text-4xl text-rysen-ink sm:text-5xl">Our Work in Focus</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-rysen-charcoal/70">Moments of connection, reflection, and growth. Explore our work with leaders and teams.</p>
          </div>
          <button type="button" onClick={() => { setActive(null); setOpen(true); }} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-full bg-rysen-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-rysen-orange sm:self-auto">
            See Full Gallery <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </Reveal>
        <div className="mt-10 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {previewGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.04}>
              <button type="button" className="group block w-full text-left" onClick={() => showPhoto(photos.findIndex(photo => photo.group.id === group.id))} aria-label={`View ${group.title}`}>
                <div className="relative overflow-hidden rounded-xl bg-rysen-soft">
                  <img src={group.images[0].thumbnail} alt={group.title} width={group.images[0].width} height={group.images[0].height} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transform-none" loading="lazy" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold"><Images className="h-3.5 w-3.5" aria-hidden="true" />{group.images.length} {group.images.length === 1 ? "photo" : "photos"}</span>
                  <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/40 text-rysen-ink shadow-sm backdrop-blur-md transition group-hover:bg-white/60"><Maximize2 className="h-4 w-4" aria-hidden="true" /></span>
                </div>
              </button>
              <div className="mt-1"><GalleryTitle title={group.title} /></div>
            </Reveal>
          ))}
        </div>
      </div>

      {open && (
        <Modal labelId="work-gallery-title" onClose={close}>
          <div className="flex max-h-[92dvh] flex-col" onKeyDown={(event) => {
            if (!selected || event.target instanceof HTMLInputElement) return;
            if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
            if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
          }}>
            <header className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-rysen-ink/10 px-4 py-4 sm:flex sm:justify-between sm:px-7">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {selected && <button type="button" onClick={() => setActive(null)} className={control} aria-label="Back to all journeys"><ArrowLeft className="h-5 w-5" /></button>}
                <div className="min-w-0 flex-1">
                  <GalleryTitle showInfo={false} id="work-gallery-title" as="h2" title={selected ? selected.group.title : "Our Work in Focus"} />
                  <p className="mt-1 text-xs text-rysen-charcoal/60 sm:text-sm">{selected ? `Photo ${selected.index + 1} of ${groupPhotos.length}` : `${photos.length} photographs across ${workGallery.length} learning journeys`}</p>
                </div>
              </div>
              <div className="col-span-2 flex shrink-0 items-center justify-end gap-2 sm:col-span-1">
                {selected && groupPhotos.length > 1 && <>
                  <button type="button" className={control} onClick={() => step(-1)} aria-label="Previous photo"><ChevronLeft className="h-5 w-5" /></button>
                  <button type="button" className={control} onClick={() => step(1)} aria-label="Next photo"><ChevronRight className="h-5 w-5" /></button>
                </>}
                <button type="button" onClick={close} className={control} aria-label="Close gallery"><X className="h-5 w-5" /></button>
              </div>
            </header>
            <div ref={scrollArea} className="min-h-0 overflow-y-auto overscroll-contain">
              {selected ? (
                <div>
                  <figure>
                    <GalleryImage key={selected.src} photo={selected} />
                  <div className="flex gap-2 overflow-x-auto overscroll-x-contain px-4 py-4 sm:px-7" aria-label="Photo thumbnails">
                    {groupPhotos.map((photo, index) => <button
                      key={photo.src}
                      type="button"
                      aria-label={`View photo ${index + 1}: ${photo.title}`}
                      aria-pressed={photo.src === selected.src}
                      onPointerEnter={(event) => { if (event.pointerType === "mouse") selectGroupPhoto(index); }}
                      onFocus={() => selectGroupPhoto(index)}
                      onClick={() => selectGroupPhoto(index)}
                      className={`shrink-0 overflow-hidden rounded-lg border-2 p-1 transition ${photo.src === selected.src ? "border-rysen-orange" : "border-transparent hover:border-rysen-orange/50"}`}
                    ><img src={photo.thumbnail} alt="" className="h-16 w-24 rounded object-cover" loading="lazy" /></button>)}
                  </div>
                  </figure>

                </div>
              ) : (
                <div className="divide-y divide-rysen-ink/15 px-4 sm:px-7">
                  {workGallery.map((group) => <section key={group.id} aria-labelledby={`${group.id}-title`} className="py-6 sm:py-8">
                    <div className="mb-4 flex min-w-0 items-center gap-3"><Images className="h-5 w-5 shrink-0 text-rysen-orange" aria-hidden="true" /><GalleryTitle showInfo={false} id={`${group.id}-title`} title={group.title} /></div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.images.map((photo, photoIndex) => <button key={photo.src} type="button" onClick={() => showPhoto(photos.findIndex(item => item.src === photo.src))} aria-label={`Enlarge ${photo.title}, photo ${photoIndex + 1}`} className="group relative overflow-hidden rounded-lg bg-rysen-soft">
                        <img src={photo.thumbnail} alt={`${group.title} — photo ${photoIndex + 1}`} width={photo.width} height={photo.height} className="h-64 w-full object-cover sm:h-60" loading="lazy" />
                        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-white/40 text-rysen-ink shadow-sm backdrop-blur-md transition group-hover:bg-white/60"><Maximize2 className="h-4 w-4" aria-hidden="true" /></span>
                      </button>)}
                    </div>
                  </section>)}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

function GalleryTitle({ title, id, as: Heading = "h3", showInfo = true }: { title: string; id?: string; as?: "h2" | "h3"; showInfo?: boolean }) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative flex min-w-0 flex-1 items-center gap-2" onPointerLeave={() => setVisible(false)}>
      <Heading id={id} className="min-w-0 flex-1 truncate text-base font-semibold leading-7 text-rysen-ink sm:text-lg">{title}</Heading>
      {showInfo && <button
        type="button"
        aria-label="Show full image title"
        aria-describedby={visible ? tooltipId : undefined}
        onPointerEnter={() => setVisible(true)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && visible) { event.preventDefault(); event.stopPropagation(); setVisible(false); }
        }}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-rysen-charcoal/60 transition hover:bg-rysen-soft hover:text-rysen-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-rysen-orange"
      ><Info className="h-5 w-5" aria-hidden="true" /></button>}
      {showInfo && visible && <div id={tooltipId} role="tooltip" className="absolute left-0 top-full z-50 w-full rounded-lg bg-rysen-ink px-4 py-3 text-sm font-normal leading-6 text-white shadow-xl">{title}</div>}
    </div>
  );
}
