import { useId, useRef, useState } from "react";
import { Info, ZoomIn, ZoomOut } from "lucide-react";

export function GalleryImage({ photo }: { photo: { src: string; title: string; width: number; height: number; index: number } }) {
  const [zoomed, setZoomed] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const infoId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const zoomImage = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  return (
    <div className="relative h-[48dvh] bg-rysen-soft sm:h-[55dvh]">
      <div
        ref={viewport}
        tabIndex={zoomed ? 0 : undefined}
        role={zoomed ? "region" : undefined}
        aria-label={zoomed ? "Zoomed photograph. Move the pointer, drag on touch screens, or use arrow keys to explore." : undefined}
        onKeyDown={(event) => {
          if (!zoomed || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          event.preventDefault();
          event.stopPropagation();
          setPan(current => ({
            x: clamp(current.x + (event.key === "ArrowRight" ? 10 : event.key === "ArrowLeft" ? -10 : 0)),
            y: clamp(current.y + (event.key === "ArrowDown" ? 10 : event.key === "ArrowUp" ? -10 : 0)),
          }));
        }}
        onPointerDown={(event) => {
          if (!zoomed || event.pointerType === "mouse") return;
          drag.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!zoomed) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.pointerType === "mouse") {
            setPan({ x: clamp((event.clientX - bounds.left) / bounds.width * 100), y: clamp((event.clientY - bounds.top) / bounds.height * 100) });
          } else if (drag.current && zoomImage.current) {
            const deltaX = event.clientX - drag.current.x;
            const deltaY = event.clientY - drag.current.y;
            const rangeX = Math.max(1, zoomImage.current.offsetWidth - bounds.width);
            const rangeY = Math.max(1, zoomImage.current.offsetHeight - bounds.height);
            setPan(current => ({ x: clamp(current.x - deltaX / rangeX * 100), y: clamp(current.y - deltaY / rangeY * 100) }));
            drag.current = { x: event.clientX, y: event.clientY };
          }
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}
        className={`relative h-full w-full overflow-hidden ${zoomed ? "touch-none cursor-move" : ""}`}
      >
        <img
          ref={zoomImage}
          draggable={false}
          src={photo.src}
          alt={`${photo.title} - photo ${photo.index + 1}`}
          width={photo.width}
          height={photo.height}
          className={zoomed ? "pointer-events-none absolute block h-auto max-w-none select-none" : "h-full w-full object-contain"}
          style={zoomed ? { width: `max(200%, calc(110dvh * ${photo.width / photo.height}))`, left: `${pan.x}%`, top: `${pan.y}%`, transform: `translate(-${pan.x}%, -${pan.y}%)` } : undefined}
        />
      </div>
      <div className="absolute left-3 top-3 z-10" onPointerLeave={() => setInfoVisible(false)}>
        <button
          type="button"
          aria-label="Show full image title"
          aria-describedby={infoVisible ? infoId : undefined}
          onPointerEnter={() => setInfoVisible(true)}
          onFocus={() => setInfoVisible(true)}
          onBlur={() => setInfoVisible(false)}
          onClick={() => setInfoVisible(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && infoVisible) { event.preventDefault(); event.stopPropagation(); setInfoVisible(false); }
          }}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/40 text-rysen-ink shadow-sm backdrop-blur-md transition hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rysen-orange"
        ><Info className="h-5 w-5" aria-hidden="true" /></button>
        {infoVisible && <div id={infoId} role="tooltip" className="absolute left-0 top-full z-20 mt-2 w-[min(20rem,calc(100vw-5rem))] rounded-lg bg-rysen-ink/90 px-4 py-3 text-sm leading-6 text-white shadow-lg backdrop-blur-md">{photo.title}</div>}
      </div>
      <button
        type="button"
        aria-pressed={zoomed}
        onClick={() => {
          setZoomed(!zoomed);
          setPan({ x: 50, y: 50 });
          drag.current = null;
        }}
        className="absolute right-3 top-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 bg-white/40 px-4 py-2 text-sm font-semibold text-rysen-ink shadow-sm backdrop-blur-md transition hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rysen-orange"
      >
        {zoomed ? <ZoomOut className="h-4 w-4" aria-hidden="true" /> : <ZoomIn className="h-4 w-4" aria-hidden="true" />}
        {zoomed ? "Fit image" : "Zoom in"}
      </button>
    </div>
  );
}
