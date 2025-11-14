// AnimeCard.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggle } from '@/store/myListSlice'
import type { Anime } from '@/types/anime'
import type { MouseEvent } from 'react'

type Props = {
  anime: Anime
  to?: string
  onPlayTrailer?: (t?: Anime['trailer']) => void
}

const MotionDiv = motion.div

function formatCompactCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export default function AnimeCard({
  anime,
  to = `/anime/${anime.mal_id}`,
  onPlayTrailer,
}: Props) {
  const dispatch = useAppDispatch()
  const inList = useAppSelector((s) => Boolean(s.myList?.items?.[anime.mal_id]))

  const jpg = anime.images?.jpg
  const webp = anime.images?.webp

  const webp1x = webp?.image_url
  const webp2x = webp?.large_image_url ?? webp1x

  const jpg1x = jpg?.image_url ?? webp1x
  const jpg2x = jpg?.large_image_url ?? jpg1x

  const handleToggle = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()

    dispatch(
      toggle({
        mal_id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english,
        images: anime.images,
        score: typeof anime.score === 'number' ? anime.score : undefined,
        episodes: anime.episodes,
        synopsis: anime.synopsis,
        season: (anime as any).season,
        year: (anime as any).year,
        scored_by:
          typeof (anime as any).scored_by === 'number'
            ? (anime as any).scored_by
            : undefined,
        favorites:
          typeof (anime as any).favorites === 'number'
            ? (anime as any).favorites
            : undefined,
        trailer: anime.trailer,
      }),
    )
  }


  const handlePlayClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (onPlayTrailer) {
      onPlayTrailer(anime.trailer)
    }
  }

  const ratingText =
    typeof anime.score === 'number' ? anime.score.toFixed(1) : undefined

  const rawCount =
    (anime as any).scored_by ??
    (anime as any).members ??
    (anime as any).favorites
  const ratingCount =
    typeof rawCount === 'number' ? `(${formatCompactCount(rawCount)})` : undefined

  const seasonLabel =
    (anime as any).season && (anime as any).year
      ? `${String((anime as any).season).charAt(0).toUpperCase()}${String(
          (anime as any).season,
        ).slice(1)} ${(anime as any).year}`
      : undefined

  const episodesText =
    anime.episodes != null ? `${anime.episodes} Episodes` : undefined

  return (
    <div className="relative overflow-hidden rounded-lg bg-[#141414] shadow-card">
      <Link to={to} className="block" aria-label={anime.title_english ?? anime.title}>
        <div style={{ aspectRatio: '2 / 3' }} className="w-full overflow-hidden">
          <MotionDiv
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative w-full h-full transform-gpu will-change-transform group"
          >
            <picture>
              {webp1x && (
                <source
                  type="image/webp"
                  srcSet={`${webp1x} 1x${webp2x ? `, ${webp2x} 2x` : ''}`}
                />
              )}
              <img
                src={jpg1x || webp1x || ''}
                srcSet={`${jpg1x || webp1x || ''} 1x${jpg2x ? `, ${jpg2x} 2x` : ''}`}
                sizes="(min-width:1024px) 224px, (min-width:640px) 192px, 160px"
                loading="lazy"
                decoding="async"
                alt={anime.title_english ?? anime.title}
                className="absolute inset-0 object-cover w-full h-full transition duration-200 ease-out group-hover:blur-sm group-hover:brightness-75"
              />
            </picture>

            {/* CENTERED OVERLAY */}
            <div
              className="absolute inset-0 z-10 flex px-3 py-4 transition-all duration-200 ease-out translate-y-1 opacity-0 bg-gradient-to-b from-black/90 via-black/85 to-black/95 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
            >
              {/* Layout: center text block, icons at bottom */}
              <div className="flex h-full w-full max-w-[90%] flex-col text-left">
                {/* Middle content (details) */}
                <div className="flex flex-col justify-center flex-1 space-y-2">
                  {/* Title + meta */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-snug line-clamp-2">
                      {anime.title_english ?? anime.title}
                    </p>

                    {(ratingText || ratingCount) && (
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        {ratingText && <span>{ratingText}</span>}
                        <span className="text-[11px]">★</span>
                        {ratingCount && (
                          <span className="text-[11px] text-white/60">
                            {ratingCount}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="space-y-0.5 text-xs text-white/70">
                      {seasonLabel && <p>{seasonLabel}</p>}
                      {episodesText && <p>{episodesText}</p>}
                    </div>
                  </div>

                  {/* Synopsis */}
                  {anime.synopsis && (
                    <p className="text-[11px] leading-snug text-white/75 line-clamp-3">
                      {anime.synopsis}
                    </p>
                  )}
                </div>

                {/* Icon row pinned to bottom */}
                <div className="flex items-center gap-5 pt-2 text-orange-500">
                  {/* Play – only rendered if trailer callback + data exist */}
                  {onPlayTrailer && anime.trailer && (
                    <button
                      type="button"
                      onClick={handlePlayClick}
                      aria-label="Play trailer"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="8 5 19 12 8 19 8 5" />
                      </svg>
                    </button>
                  )}

                  {/* Bookmark */}
                  <button
                    type="button"
                    onClick={handleToggle}
                    aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                  >
                    {inList ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </Link>

      {/* Top score badge (optional) */}
      {typeof anime.score === 'number' && (
        <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white rounded left-2 top-2 bg-netflix-red">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="opacity-90"
            fill="currentColor"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.401 8.166L12 18.897 4.665 23.163l1.401-8.166L.132 9.21l8.2-1.192z" />
          </svg>
          {anime.score.toFixed(2)}
        </div>
      )}

      {/* Static bottom (good for mobile / no hover) */}
      <div className="p-2">
        <p className="text-sm font-medium truncate">
          {anime.title_english ?? anime.title}
        </p>
        <p className="mt-1 text-xs text-white/60">
          {anime.episodes != null ? `${anime.episodes} ep` : '—'}
        </p>
      </div>
    </div>
  )
}
