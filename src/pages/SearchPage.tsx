// SearchPage.tsx
import { useState } from 'react'
import SkeletonCard from '@/components/SkeletonCard'
import ErrorState from '@/components/ErrorState'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import Discover from '@/components/Discover'
import { useSearchAnimeQuery } from '@/store/jikanApi'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setPage } from '@/store/uiSlice'
import useDebounce from '@/hooks/useDebounce'
import HorizontalScroller from '@/components/HorizontalScroller'
// import HoverAnimeCard from '@/components/HoverAnimeCard'
import AnimeCard from '@/components/AnimeCard'


function buildTrailerUrl(trailer?: { embed_url?: string | null; youtube_id?: string | null }) {
  const base =
    trailer?.embed_url ??
    (trailer?.youtube_id ? `https://www.youtube-nocookie.com/embed/${trailer.youtube_id}` : '')
  if (!base) return ''
  const join = base.includes('?') ? '&' : '?'
  return `${base}${join}autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1`
}


function TrailerModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-lg aspect-video ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          className="absolute inset-0 w-full h-full"
          src={url}
          title="Trailer"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <button
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute px-3 py-1 text-sm rounded right-2 top-2 bg-black/60 hover:bg-black/80"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const dispatch = useAppDispatch()
  const { query, page } = useAppSelector((s) => s.search)
  const debounced = useDebounce(query, 250)

  const { data, isFetching, error } = useSearchAnimeQuery(
    { q: debounced, page },
    { skip: debounced.trim().length === 0 }
  )

  const lastPage = data?.pagination?.last_visible_page ?? 1

  // trailer modal state (used by the carousel first)
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const openTrailer = (trailer?: { embed_url?: string | null; youtube_id?: string | null }) => {
    const url = buildTrailerUrl(trailer)
    if (url) setTrailerUrl(url)
  }

  return (
    <section className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-10">
      {debounced.trim().length === 0 ? (
        <div className="space-y-8">
          <Discover onPlayTrailer={openTrailer} />
        </div>
      ) : (
        <div className="space-y-6">
          {error ? (
            <ErrorState message="Could not load anime. Please try again." />
          ) : isFetching ? (
            <HorizontalScroller
              items={Array.from({ length: data?.pagination?.items?.per_page ?? 18 })}
              itemKey={(_, i) => i}
              render={(_, i) => (
                <div className="w-40 sm:w-48 md:w-56">
                  <SkeletonCard key={i} />
                </div>
              )}
            />
          ) : data && data.data.length > 0 ? (
            <>
              <HorizontalScroller
                items={data.data}
                itemKey={(a) => a.mal_id}
                render={(a) => (
                  <div className="w-40 sm:w-48 md:w-56">
                    <AnimeCard anime={a} onPlayTrailer={openTrailer} />
                  </div>
                )}
              />
              <div className="mt-6 md:mt-8">
                <Pagination page={page} lastPage={lastPage} onChange={(p) => dispatch(setPage(p))} />
              </div>
            </>
          ) : (
            <EmptyState query={debounced} />
          )}
        </div>
      )}

      {/* trailer modal */}
      {trailerUrl && <TrailerModal url={trailerUrl} onClose={() => setTrailerUrl(null)} />}
    </section>
  )
}
