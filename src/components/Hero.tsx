import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTopAnimeQuery } from '@/store/jikanApi'
import { useEffect, useMemo, useState } from 'react'
import { FcInfo } from 'react-icons/fc'
import { BsPlayBtnFill, BsBookmarkPlusFill, BsBookmarkCheckFill } from 'react-icons/bs'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggle } from '@/store/myListSlice'

import type { Anime } from '@/types/anime'

type Props = {
  anime: Anime
  onPlayTrailer?: (t?: Anime['trailer']) => void
}

type Slide = Anime

const MotionDiv = motion.div

function getYear(a?: Anime | null) {
  return a?.year ?? a?.aired?.prop?.from?.year ?? ''
}

function buildSources(a?: Anime) {
  const w = a?.images?.webp
  const j = a?.images?.jpg
  const webp1 = w?.large_image_url ?? w?.image_url
  const jpg1 = j?.large_image_url ?? j?.image_url
  return { webp1x: webp1, webp2x: webp1, jpg1x: jpg1, jpg2x: jpg1 }
}

/**
 * Prefer a wide trailer thumbnail for the hero background.
 * Fallback to the main poster if no trailer image exists.
 */
function getHeroBackgroundUrl(a?: Anime): string {
  if (!a) return ''

  const tImgs: any = (a as any).trailer?.images
  const trailerBg =
    tImgs?.maximum_image_url ??
    tImgs?.large_image_url ??
    tImgs?.medium_image_url ??
    tImgs?.small_image_url ??
    tImgs?.image_url

  if (trailerBg) return trailerBg

  const w = a.images?.webp
  const j = a.images?.jpg
  return (
    j?.large_image_url ??
    w?.large_image_url ??
    j?.image_url ??
    w?.image_url ??
    ''
  )
}

export default function Hero({ anime, onPlayTrailer }: Props) {
  const dispatch = useAppDispatch()

  // Top anime slides
  const { data } = useTopAnimeQuery({ page: 1, limit: 5 })
  const slides: Slide[] = data?.data ?? []

  const [index, setIndex] = useState(0)
  const active = slides[index]

  // Read watchlist from store and compute "inList" for the active slide
  const listMap = useAppSelector((s) => s.myList?.items ?? {})
  const inList = !!(active && listMap[active.mal_id])

  const toggleWatchlist = () => {
    if (!active) return
    dispatch(
      toggle({
        mal_id: active.mal_id,
        title: active.title_english ?? active.title,
        images: active.images,
        score: active.score,
        addedAt: Date.now(),
      } as any)
    )
  }

  // If Discover provided an initial anime, sync starting slide
  useEffect(() => {
    if (!anime || !slides.length) return
    const i = slides.findIndex((s) => s.mal_id === anime.mal_id)
    if (i >= 0) setIndex(i)
  }, [anime?.mal_id, slides])

  // Auto-advance
  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [slides.length])

  const go = (dir: number) => {
    if (!slides.length) return
    setIndex((i) => (i + dir + slides.length) % slides.length)
  }

  const sources = useMemo(() => slides.map(buildSources), [slides])

  return (
    <section className="relative mb-6 h-[420px] overflow-hidden bg-black md:h-[560px]">
      {/* Slides */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {active && (
            <MotionDiv
              key={active.mal_id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black"
            >
              {(() => {
                const heroBg = getHeroBackgroundUrl(active)
                const { webp1x, webp2x, jpg1x, jpg2x } = buildSources(active)

                if (!heroBg && !(webp1x || jpg1x)) return null

                return (
                  <>
                    {/* Focused background – fully contained, not zoomed or blurry */}
                    {heroBg && (
                      <img
                        src={heroBg}
                        loading="eager"
                        decoding="async"
                        alt=""
                        className="
                          absolute inset-0 h-full w-full
                          object-contain
                          mx-auto
                          brightness-[0.7]
                        "
                      />
                    )}

                    {/* Soft vignette so text remains readable */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

                    {/* Small poster in the bottom-right, fully visible */}
                    {(webp1x || jpg1x) && (
                      <div className="absolute hidden pointer-events-none bottom-6 right-6 sm:block">
                        <picture>
                          {webp1x && (
                            <source
                              type="image/webp"
                              srcSet={`${webp1x} 1x${
                                webp2x ? `, ${webp2x} 2x` : ''
                              }`}
                            />
                          )}
                          <img
                            src={jpg1x || webp1x || ''}
                            srcSet={`${jpg1x || webp1x || ''} 1x${
                              jpg2x ? `, ${jpg2x} 2x` : ''
                            }`}
                            loading="eager"
                            decoding="async"
                            alt={active.title_english ?? active.title}
                            className="h-40 w-auto rounded shadow-[0_6px_20px_rgba(0,0,0,0.8)] object-contain"
                          />
                        </picture>
                      </div>
                    )}
                  </>
                )
              })()}
            </MotionDiv>
          )}
        </AnimatePresence>

        {/* Preload off-screen slides */}
        {slides.map((s, i) => {
          if (i === index) return null
          const { webp1x, webp2x, jpg1x, jpg2x } = sources[i] ?? {}
          if (!(webp1x || jpg1x)) return null
          return (
            <picture key={s.mal_id} aria-hidden className="hidden">
              {webp1x && (
                <source
                  type="image/webp"
                  srcSet={`${webp1x} 1x${webp2x ? `, ${webp2x} 2x` : ''}`}
                  sizes="100vw"
                />
              )}
              <img
                src={jpg1x || webp1x || ''}
                srcSet={`${jpg1x || webp1x || ''} 1x${
                  jpg2x ? `, ${jpg2x} 2x` : ''
                }`}
                sizes="100vw"
                loading="lazy"
                decoding="async"
                alt=""
              />
            </picture>
          )
        })}
      </div>

      {/* Top gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Content overlay */}
      <div className="relative mx-auto h-full max-w-[1400px] px-4 md:px-8 lg:px-12">
        <div className="flex flex-col justify-end h-full max-w-3xl gap-3 pb-6 md:pb-10">
          {!active ? (
            <>
              <div className="w-2/3 h-8 rounded animate-pulse bg-white/20" />
              <div className="w-full rounded h-14 animate-pulse bg-white/10" />
              <div className="flex gap-3 mt-1">
                <div className="h-10 rounded w-36 animate-pulse bg-white/20" />
                <div className="w-32 h-10 rounded animate-pulse bg-white/10" />
              </div>
            </>
          ) : (
            <>
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-extrabold md:text-5xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                  {active.title_english ?? active.title}
                </h1>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <p className="line-clamp-3 text-white/80">
                  {active.synopsis}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {active.type ?? '—'}{' '}
                  {active.episodes ? `• ${active.episodes} ep` : ''}{' '}
                  {active.score ? `• ⭐ ${active.score}` : ''}{' '}
                  {getYear(active) ? `• ${getYear(active)}` : ''}
                </p>
              </MotionDiv>

              <div className="flex gap-3 mt-1">
                {Boolean(active?.trailer?.embed_url || active?.trailer?.youtube_id) && (
                  <button
                    type="button"
                    onClick={() => onPlayTrailer?.(active!.trailer)}
                    className="inline-flex items-center gap-2 px-4 py-2 font-medium rounded bg-netflix-red hover:opacity-90"
                  >
                    <BsPlayBtnFill size={20} className="shrink-0" aria-hidden />
                    Play Trailer
                  </button>
                )}

                <Link
                  to={`/anime/${active?.mal_id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 font-medium text-black bg-white rounded hover:bg-white/90"
                >
                  <FcInfo size={20} className="shrink-0" aria-hidden />
                  Details
                </Link>

                <button
                  type="button"
                  onClick={toggleWatchlist}
                  aria-pressed={inList}
                  className={`inline-flex items-center gap-2 rounded px-4 py-2 font-medium ${
                    inList
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  title={inList ? 'Remove from My List' : 'Add to My List'}
                >
                  {inList ? (
                    <>
                      <BsBookmarkCheckFill size={18} className="shrink-0" aria-hidden />
                      Saved
                    </>
                  ) : (
                    <>
                      <BsBookmarkPlusFill size={18} className="shrink-0" aria-hidden />
                      Add to My List
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edge arrows */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => go(-1)}
            className="absolute items-center justify-center hidden p-2 text-white -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/60 hover:bg-black/80 sm:flex"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => go(1)}
            className="absolute items-center justify-center hidden p-2 text-white -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/60 hover:bg-black/80 sm:flex"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute left-0 right-0 flex justify-center gap-2 pointer-events-none bottom-3">
          {slides.map((s, i) => (
            <span
              key={s.mal_id}
              className={`h-1.5 w-8 rounded-full transition-opacity ${
                i === index ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
