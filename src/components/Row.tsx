// Row.tsx
import React, { useRef } from 'react'
import AnimeCard from './AnimeCard'
import type { Anime } from '@/types/anime'

type Props = {
  title: string
  items: Anime[]
  hideScrollbar?: boolean
  showArrows?: boolean
  onPlayTrailer?: (t?: Anime['trailer']) => void
}

export default function Row({
  title,
  items,
  hideScrollbar = true,
  showArrows = true,
  onPlayTrailer,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.9)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!trackRef.current) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      trackRef.current.scrollLeft += e.deltaY
    }
  }

  return (
    <section className="relative overflow-hidden">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>

      {showArrows && (
        <>
          {/* LEFT ARROW */}
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="absolute z-10 hidden -translate-y-1/2 pointer-events-none sm:flex left-2 top-1/2"
          >
            <span className="flex items-center justify-center text-white rounded-full pointer-events-auto h-9 w-9 bg-black/70 hover:bg-black/90">
              ‹
            </span>
          </button>

          {/* RIGHT ARROW */}
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="absolute z-10 hidden -translate-y-1/2 pointer-events-none sm:flex right-2 top-1/2"
          >
            <span className="flex items-center justify-center text-white rounded-full pointer-events-auto h-9 w-9 bg-black/70 hover:bg-black/90">
              ›
            </span>
          </button>
        </>
      )}

      <div
        ref={trackRef}
        onWheel={onWheel}
        className={[
          'overflow-x-auto overflow-y-hidden max-w-full min-w-0',
          hideScrollbar ? 'scrollbar-none pb-3 -mb-3' : '',
        ].join(' ')}
      >
        <div className="flex gap-4 py-1">
          {items.map((a) => (
            <div key={a.mal_id} className="w-40 shrink-0 sm:w-48 md:w-56">
              <AnimeCard anime={a} onPlayTrailer={onPlayTrailer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

