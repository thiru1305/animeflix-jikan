import { useParams, Link } from 'react-router-dom'
import { useGetAnimeByIdQuery } from '@/store/jikanApi'
import SkeletonCard from '@/components/SkeletonCard'
import ErrorState from '@/components/ErrorState'
import { SiCrunchyroll } from 'react-icons/si'
import { FcHome } from 'react-icons/fc'

type Trailer = {
  youtube_id?: string | null
  embed_url?: string | null
  url?: string | null
}

function getYoutubeId(trailer?: Trailer | null): string | null {
  if (!trailer) return null
  if (trailer.youtube_id) return trailer.youtube_id

  if (trailer.embed_url) {
    try {
      const url = new URL(trailer.embed_url)
      const segments = url.pathname.split('/')
      const last = segments[segments.length - 1]
      return last || null
    } catch {
      return null
    }
  }

  return null
}

function buildTrailerUrl(trailer?: Trailer | null): string {
  const id = getYoutubeId(trailer)
  if (!id) return ''

  const url = new URL(`https://www.youtube-nocookie.com/embed/${id}`)
  const p = url.searchParams

  // Autoplay is allowed only when muted in most browsers
  p.set('autoplay', '1')
  p.set('mute', '0')
  p.set('playsinline', '1')
  p.set('rel', '0')
  p.set('modestbranding', '1')
  p.set('controls', '1')
  p.set('loop', '1')
  p.set('playlist', id)

  url.search = p.toString()
  return url.toString()
}

// ---------------------------------------------------------------------------

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const animeId = Number(id)
  const { data, isFetching, error } = useGetAnimeByIdQuery(animeId, {
    skip: !Number.isFinite(animeId),
  })

  if (!id || !Number.isFinite(animeId)) {
    return <ErrorState message="Invalid anime id." />
  }

  if (isFetching) {
    return (
      <section className="px-4 py-6 mx-auto space-y-8 max-w-7xl sm:px-6 md:py-10 lg:px-8">
        <div className="h-72 w-full animate-pulse rounded-2xl bg-[#111] shadow-card md:h-[420px]" />
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (error || !data) {
    return <ErrorState message="Failed to load anime details." />
  }

  const a = data.data
  const jpg = a.images.jpg
  const webp = a.images.webp

  // Banner fallback image
  const bannerWebp1x =
    webp?.large_image_url || webp?.image_url || webp?.small_image_url
  const bannerWebp2x = webp?.large_image_url || bannerWebp1x

  const bannerJpg1x =
    jpg?.large_image_url || jpg?.image_url || jpg?.small_image_url
  const bannerJpg2x = jpg?.large_image_url || bannerJpg1x

  // Poster: normal image as base, large as 2x
  const posterWebp1x = webp?.image_url || webp?.small_image_url
  const posterWebp2x = webp?.large_image_url || posterWebp1x

  const posterJpg1x = jpg?.image_url || jpg?.small_image_url
  const posterJpg2x = jpg?.large_image_url || posterJpg1x

  const genres = a.genres?.map((g) => g.name).join(' • ')
  const themes = a.themes?.map((t) => t.name).join(' • ')
  const demographics = a.demographics?.map((d) => d.name).join(' • ')

  const englishTitle =
    a.title_english ||
    a.titles?.find((t) => t.type === 'English')?.title ||
    undefined
  const japaneseTitle = a.title_japanese || undefined
  const synonyms =
    a.title_synonyms && a.title_synonyms.length > 0
      ? a.title_synonyms.join(', ')
      : undefined

  const studios = a.studios?.map((s) => s.name).join(', ')
  const producers = a.producers?.map((p) => p.name).join(', ')

  const relations = a.relations ?? []
  const streaming = a.streaming ?? []

  const trailerUrl = buildTrailerUrl(a.trailer as Trailer | null)
  const hasBannerImage = bannerWebp1x || bannerJpg1x

  return (
    <section className="px-4 py-6 mx-auto space-y-8 max-w-7xl sm:px-6 md:space-y-10 md:py-10 lg:px-8">
      {/* Banner: trailer preferred, image fallback */}
      <div className="relative overflow-hidden bg-black rounded-2xl shadow-card ring-1 ring-white/10">
        <div className="relative h-72 md:h-[420px]">
          {trailerUrl ? (
            <iframe
              src={trailerUrl}
              title={`${a.title} trailer`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="eager"
            />
          ) : (
            hasBannerImage && (
              <picture>
                {bannerWebp1x && (
                  <source
                    type="image/webp"
                    srcSet={`${bannerWebp1x} 1x${
                      bannerWebp2x ? `, ${bannerWebp2x} 2x` : ''
                    }`}
                    sizes="100vw"
                  />
                )}
                <img
                  src={bannerJpg1x || bannerWebp1x || ''}
                  srcSet={`${bannerJpg1x || bannerWebp1x || ''} 1x${
                    bannerJpg2x ? `, ${bannerJpg2x} 2x` : ''
                  }`}
                  sizes="100vw"
                  loading="eager"
                  decoding="async"
                  alt={a.title}
                  className="object-cover w-full h-full"
                />
              </picture>
            )
          )}

          {/* Gradient + text overlay, but don't block clicks on video */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end p-4 pointer-events-none sm:p-6 lg:p-8">
            <div>
              <h1 className="text-3xl font-extrabold drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] md:text-4xl lg:text-5xl">
                {a.title}
              </h1>

              <p className="mt-2 text-sm text-white/80">
                {a.type ?? '—'}
                {a.episodes ? ` • ${a.episodes} ep` : ''}
                {a.score
                  ? ` • ⭐ ${a.score.toFixed(2)} (${
                      a.scored_by?.toLocaleString() ?? '—'
                    } ratings)`
                  : ''}
                {a.year ? ` • ${a.year}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-8 md:grid-cols-[300px,1fr] lg:gap-10">
        {/* Left column (poster + facts) */}
        <aside className="space-y-4">
          {(posterWebp1x || posterJpg1x) && (
            <picture>
              {posterWebp1x && (
                <source
                  type="image/webp"
                  srcSet={`${posterWebp1x} 1x${
                    posterWebp2x ? `, ${posterWebp2x} 2x` : ''
                  }`}
                  sizes="(min-width:1024px) 300px, 45vw"
                />
              )}
              <img
                src={posterJpg1x || posterWebp1x || ''}
                srcSet={`${posterJpg1x || posterWebp1x || ''} 1x${
                  posterJpg2x ? `, ${posterJpg2x} 2x` : ''
                }`}
                sizes="(min-width:1024px) 300px, 45vw"
                loading="lazy"
                decoding="async"
                alt={a.title}
                className="object-cover w-full rounded-xl shadow-card ring-1 ring-white/10"
              />
            </picture>
          )}

          {/* Titles / quick facts */}
          <div className="p-4 space-y-3 text-sm rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10">
            {englishTitle && (
              <p>
                <span className="text-white">English:</span> {englishTitle}
              </p>
            )}
            {japaneseTitle && (
              <p>
                <span className="text-white">Japanese:</span> {japaneseTitle}
              </p>
            )}
            {synonyms && (
              <p>
                <span className="text-white">Also known as:</span> {synonyms}
              </p>
            )}
            {a.status && (
              <p>
                <span className="text-white">Status:</span> {a.status}
              </p>
            )}
            {a.season && a.year && (
              <p>
                <span className="text-white">Season:</span>{' '}
                {`${a.season[0].toUpperCase()}${a.season.slice(1)} ${a.year}`}
              </p>
            )}
            {a.broadcast?.string && (
              <p>
                <span className="text-white">Broadcast:</span>{' '}
                {a.broadcast.string}
              </p>
            )}
            {a.duration && (
              <p>
                <span className="text-white">Duration:</span> {a.duration}
              </p>
            )}
            {a.rating && (
              <p>
                <span className="text-white">Age rating:</span> {a.rating}
              </p>
            )}
            {genres && (
              <p>
                <span className="text-white">Genres:</span> {genres}
              </p>
            )}
            {themes && (
              <p>
                <span className="text-white">Themes:</span> {themes}
              </p>
            )}
            {demographics && (
              <p>
                <span className="text-white">Demographic:</span> {demographics}
              </p>
            )}
            {studios && (
              <p>
                <span className="text-white">Studios:</span> {studios}
              </p>
            )}
            {producers && (
              <p>
                <span className="text-white">Producers:</span> {producers}
              </p>
            )}

            <p className="pt-2">
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="text-netflix-red hover:underline"
              >
                View on MyAnimeList
              </a>
            </p>
          </div>
        </aside>

        {/* Right column (synopsis + actions) */}
        <article className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">Synopsis</h2>
          <p className="leading-relaxed whitespace-pre-line text-white/80">
            {a.synopsis ?? 'No synopsis available.'}
          </p>

          {/* Actions: Where to Watch (left) + Back to Home (right) in one container */}
          <div className="pt-4">
            {streaming.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-[minmax(0,260px)_auto] items-start">
                {/* LEFT: heading + streaming platforms */}
                <div className="max-w-xs space-y-2 sm:max-w-sm">
                  <h3 className="text-lg font-semibold">Where to Watch</h3>

                  <div className="flex flex-col gap-2">
                    {streaming.map((s) => {
                      const isCrunchyroll = s.name
                        .toLowerCase()
                        .includes('crunchyroll')

                      return (
                        <a
                          key={s.name + s.url}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className={[
                            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition',
                            'w-full',
                            isCrunchyroll
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-white text-black hover:bg-white/90',
                          ].join(' ')}
                        >
                          {isCrunchyroll ? (
                            <>
                              <SiCrunchyroll size={18} aria-hidden />
                              <span>Crunchyroll</span>
                            </>
                          ) : (
                            <span>{s.name}</span>
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>

                {/* RIGHT: Back to Home */}
                <div className="flex sm:justify-start md:justify-end">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 font-medium rounded bg-netflix-red hover:opacity-90"
                  >
                    <FcHome size={20} className="shrink-0" aria-hidden />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 font-medium rounded bg-netflix-red hover:opacity-90"
                >
                  <FcHome size={20} className="shrink-0" aria-hidden />
                  <span>Back to Home</span>
                </Link>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Related anime */}
      {relations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">Related Titles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relations.map((rel, idx) => (
              <div
                key={`${rel.relation}-${idx}`}
                className="p-4 space-y-1 text-sm rounded-xl bg-white/5 text-white/85 ring-1 ring-white/10"
              >
                <h3 className="text-sm font-semibold text-white">
                  {rel.relation}
                </h3>
                <ul className="space-y-1">
                  {rel.entry?.map((e) => (
                    <li key={e.mal_id}>
                      {e.url ? (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {e.name}
                        </a>
                      ) : (
                        e.name
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
