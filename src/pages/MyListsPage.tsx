import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/hooks/useStore'
import AnimeCard from '@/components/AnimeCard'
import { toggle } from '@/store/myListSlice'
import { FiBookmark, FiClock, FiSliders } from 'react-icons/fi'
import type { Saved } from '@/store/myListSlice'

type HistoryItem = {
  mal_id: number
  at?: number
  title?: string
  images?: any
}

export default function MyListsPage() {
  const dispatch = useAppDispatch()
  const listMap = useAppSelector((s) => s.myList?.items ?? {})
  const watchlist = useMemo(() => Object.values(listMap) as Saved[], [listMap])
  const recentWatchlist = useMemo(
    () => watchlist.slice().sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0)),
    [watchlist]
  )

  const history = useAppSelector((s) => (s as any).history?.items ?? []) as HistoryItem[]

  const [tab, setTab] = useState<'watchlist' | 'history'>('watchlist')

  return (
    <section className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-10">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <FiBookmark className="text-white/80" size={22} />
        <h1 className="text-2xl font-semibold md:text-3xl">My Lists</h1>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-8 mb-6 text-sm border-b border-white/10">
        {([
          ['watchlist', 'WATCHLIST'],
          ['history', 'HISTORY'],
        ] as const).map(([id, label]) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`pb-3 font-medium ${
                active ? 'text-white' : 'text-white/60 hover:text-white'
              } ${active ? 'border-b-2 border-orange-500' : ''}`}
            >
              {label}
            </button>
          )
        })}
      </nav>

 
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {tab === 'history' ? 'History' : 'Recent Activity'}
        </h2>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <span className="inline-flex items-center gap-2">
            <FiClock /> {tab === 'history' ? 'LAST WATCHED' : 'RECENT ACTIVITY'}
          </span>
          <span className="inline-flex items-center gap-2">
            <FiSliders /> FILTER
          </span>
        </div>
      </div>

      {/* CONTENT */}
      {tab === 'watchlist' && (
        <>
          {recentWatchlist.length === 0 ? (
            <div className="p-10 text-center border rounded-xl border-white/10 bg-white/5">
              <p className="text-white/80">
                Your watchlist is empty. Browse{' '}
                <Link to="/" className="text-netflix-red underline-offset-2 hover:underline">
                  Discover
                </Link>{' '}
                and add some anime.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
              {recentWatchlist.map((a) => (
                <div key={a.mal_id} className="relative group">
                  <AnimeCard anime={a as any} />
                  <button
                    onClick={() => dispatch(toggle({ ...a } as any))}
                    className="absolute hidden px-2 py-1 text-xs text-white rounded right-2 top-2 bg-black/70 group-hover:block hover:bg-black/90"
                    title="Remove from My List"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {tab === 'history' && (
        <>
          {history.length === 0 ? (
            <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
              {/* Friendly empty-state illustration substitute */}
              <div className="mb-6">
                <div className="mx-auto rounded-full h-28 w-28 bg-white/5 ring-1 ring-white/10" />
              </div>
              <p className="text-lg font-semibold">Make History… with history.</p>
              <p className="mt-1 text-white/70">
                Start watching to fill this feed.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 font-medium rounded bg-netflix-red hover:opacity-90"
                >
                  Go to Home Feed
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
              {history
                .slice()
                .sort((a, b) => (b.at ?? 0) - (a.at ?? 0))
                .map((h) => (
                  <div key={`${h.mal_id}-${h.at ?? ''}`}>
                    <AnimeCard anime={h as any} />
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
