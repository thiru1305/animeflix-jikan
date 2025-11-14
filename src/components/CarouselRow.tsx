import { useRef } from 'react'
import AnimeCard from './AnimeCard'
import type { Anime } from '@/types/anime'

export default function CarouselRow({ title, items }: { title: string; items: Anime[] }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div
        ref={ref}
        className="
          grid grid-flow-col auto-cols-[58%] sm:auto-cols-[33%] md:auto-cols-[23%] lg:auto-cols-[18%]
          gap-3 overflow-x-auto snap-x snap-mandatory pb-2
          [--sb:8px] [&::-webkit-scrollbar]:h-[var(--sb)]
          [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded
        "
        onWheel={(e) => {
          if (!ref.current) return
          ref.current.scrollLeft += e.deltaY
        }}
      >
        {items.map((a) => (
          <div key={a.mal_id} className="snap-start">
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>
    </section>
  )
}
