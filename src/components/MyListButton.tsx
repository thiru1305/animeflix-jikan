import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggle } from '@/store/myListSlice'
import type { Anime } from '@/types/anime'

export default function MyListButton({ anime, variant = 'light' }: { anime: Anime; variant?: 'light' | 'dark' }) {
  const dispatch = useAppDispatch()
  const inList = useAppSelector((s) => Boolean(s.myList?.items?.[anime.mal_id]))
  const handle = () => {
    dispatch(toggle({ mal_id: anime.mal_id, title: anime.title, images: anime.images, score: anime.score }))
  }
  const base = variant === 'light'
    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
    : 'bg-black/70 hover:bg-black/80 text-white border border-white/10'
  return (
    <button onClick={handle} className={`inline-flex items-center gap-2 px-4 py-2 rounded ${base}`}>
      {inList ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
      )}
      {inList ? 'My List' : 'Add to My List'}
    </button>
  )
}
