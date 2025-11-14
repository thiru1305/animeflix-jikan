import { useEffect } from 'react';

type Props = {
  url: string;
  onClose: () => void;
};

export default function TrailerModal({ url, onClose }: Props) {
  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={url}
          title="Trailer"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <button
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute top-2 right-2 rounded bg-black/60 px-3 py-1 text-sm hover:bg-black/80"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
