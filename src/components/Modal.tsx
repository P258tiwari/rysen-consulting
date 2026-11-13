import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function Modal({ children, labelId, onClose, className = "" }: {
  children: ReactNode;
  labelId: string;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={labelId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
      className={`gallery-modal m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-6xl overflow-hidden rounded-2xl border-0 bg-white p-0 text-rysen-ink shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm ${className}`}
    >
      {children}
    </dialog>, document.body,
  );
}
