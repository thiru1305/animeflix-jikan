// HoverAnimeCard.tsx (drop-in — minimal edits to yours)
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggle } from '@/store/myListSlice'
import type { Anime } from '@/types/anime'
import { FiPlay, FiBookmark, FiFilm } from 'react-icons/fi'

type Props = { anime: Anime }

export default function HoverAnimeCard({ anime }: Props) {
  const dispatch = useAppDispatch()
  const inList = useAppSelector((s) => Boolean(s.myList?.items?.[anime.mal_id]))

  const title = anime.title_english ?? anime.title
  const scoreTxt =
    typeof anime.score === 'number'
      ? `${anime.score.toFixed(1)} ★${
          typeof anime.scored_by === 'number'
            ? ` (${Intl.NumberFormat('en', { notation: 'compact' }).format(anime.scored_by)})`
            : ''
        }`
      : '—'
  const favTxt =
    typeof anime.favorites === 'number'
      ? `${Intl.NumberFormat('en', { notation: 'compact' }).format(anime.favorites)} favs`
      : ''
  const epTxt = anime.episodes != null ? `${anime.episodes} eps` : ''
  const seasonYear = anime.season
    ? `${anime.season[0].toUpperCase()}${anime.season.slice(1)}${anime.year ? ` ${anime.year}` : ''}`
    : (anime.year ?? '')

  const jpg = anime.images?.jpg
  const webp = anime.images?.webp
  const webp1x = webp?.image_url
  const webp2x = webp?.large_image_url ?? webp1x
  const jpg1x  = jpg?.image_url ?? webp1x
  const jpg2x  = jpg?.large_image_url ?? jpg1x

  return (
    // group + isolate => overlay z-index always wins inside scrollers
    <div className="group relative isolate overflow-hidden rounded-lg bg-[#141414] shadow-card">
      <Link to={`/anime/${anime.mal_id}`} className="block" aria-label={title}>
        <div style={{ aspectRatio: '2 / 3' }} className="w-full overflow-hidden">
          <picture>
            {webp1x && <source type="image/webp" srcSet={`${webp1x} 1x${webp2x ? `, ${webp2x} 2x` : ''}`} />}
            <img
              src={jpg1x || webp1x || ''}
              srcSet={`${jpg1x || webp1x || ''} 1x${jpg2x ? `, ${jpg2x} 2x` : ''}`}
              sizes="(min-width:1024px) 224px, (min-width:640px) 192px, 160px"
              loading="lazy"
              decoding="async"
              alt={title}
              className="z-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </picture>
        </div>
      </Link>

      {/* Hover overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 transition-opacity duration-200 opacity-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/45 to-transparent group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="pointer-events-auto">
          <h3 className="text-sm font-semibold sm:text-base">{title}</h3>

          <div className="flex flex-wrap items-center mt-1 text-xs gap-x-2 gap-y-1 text-white/80">
            {scoreTxt !== '—' && <span>{scoreTxt}</span>}
            {favTxt && <span>• {favTxt}</span>}
            {epTxt && <span>• {epTxt}</span>}
            {seasonYear && <span>• {seasonYear}</span>}
          </div>

          {anime.synopsis && (
            <p className="mt-2 text-xs line-clamp-4 text-white/80">{anime.synopsis}</p>
          )}

          <div className="flex items-center gap-3 mt-3">
            <Link to={`/anime/${anime.mal_id}`} title="Play / Details"
              className="inline-flex items-center justify-center w-8 h-8 rounded bg-white/15 hover:bg-white/25">
              <FiPlay />
            </Link>

            {anime.trailer?.embed_url && (
              <a href={anime.trailer.embed_url} target="_blank" rel="noreferrer" title="Play Trailer"
                 className="inline-flex items-center justify-center w-8 h-8 rounded bg-white/15 hover:bg-white/25">
                <FiFilm />
              </a>
            )}

            <button
              title={inList ? 'In My List' : 'Add to Watchlist'}
              onClick={() =>
                dispatch(
                  toggle({
                    mal_id: anime.mal_id,
                    title: anime.title,
                    images: anime.images,
                    score: typeof anime.score === 'number' ? anime.score : undefined,
                  }),
                )
              }
              className="inline-flex items-center justify-center w-8 h-8 rounded bg-white/15 hover:bg-white/25">
              <FiBookmark className={inList ? 'opacity-100' : 'opacity-80'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
