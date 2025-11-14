// Discover.tsx
import Hero from './Hero'
import Row from './Row'
import { useTopAnimeQuery, useSeasonsNowQuery } from '@/store/jikanApi'
import type { Anime } from '@/types/anime'

type Props = {
  onPlayTrailer?: (t?: Anime['trailer']) => void
}

const MAX_ROW_ITEMS = 18

export default function Discover({ onPlayTrailer }: Props) {
  const { data: top, isFetching: loadingTop } = useTopAnimeQuery({ page: 1, limit: 24 })
  const topItems = top?.data ?? []

  const hero = topItems[0]
  const restTop = hero ? topItems.slice(1) : topItems

  const { data: seasonNow } = useSeasonsNowQuery()
  const seasonItems = seasonNow?.data ?? []

  // ----- Row 1: Trending Now (top anime, after hero) -----
  const trendingItems = restTop.slice(0, MAX_ROW_ITEMS)

  // ----- Row 2: Season Now -----
  const seasonRowItems = seasonItems.slice(0, MAX_ROW_ITEMS)

  // ----- Track which IDs are already used (hero + row1 + row2) -----
  const usedIds = new Set<number>()
  if (hero) usedIds.add(hero.mal_id)
  trendingItems.forEach((a) => usedIds.add(a.mal_id))
  seasonRowItems.forEach((a) => usedIds.add(a.mal_id))

  // Remaining candidates from both lists
  const remainingTop = restTop.slice(MAX_ROW_ITEMS)
  const remainingSeason = seasonItems.slice(MAX_ROW_ITEMS)

  // ----- Row 3: Top Picks for You (only unseen items) -----
  const topPicks: Anime[] = []
  for (const a of [...remainingSeason, ...remainingTop]) {
    if (!usedIds.has(a.mal_id)) {
      topPicks.push(a)
      usedIds.add(a.mal_id)
      if (topPicks.length >= MAX_ROW_ITEMS) break
    }
  }

  return (
    <div className="space-y-10">
      {!loadingTop && hero && <Hero anime={hero} onPlayTrailer={onPlayTrailer} />}

      {trendingItems.length > 0 && (
        <Row
          title="Trending Now"
          items={trendingItems}
          hideScrollbar
          onPlayTrailer={onPlayTrailer}
        />
      )}

      {seasonRowItems.length > 0 && (
        <Row
          title="Season Now"
          items={seasonRowItems}
          hideScrollbar
          onPlayTrailer={onPlayTrailer}
        />
      )}

      {topPicks.length > 0 && (
        <Row
          title="Top Picks for You"
          items={topPicks}
          hideScrollbar
          onPlayTrailer={onPlayTrailer}
        />
      )}
    </div>
  )
}
