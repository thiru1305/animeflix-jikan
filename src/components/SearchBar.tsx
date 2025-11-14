
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setQuery } from '@/store/uiSlice'

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const query = useAppSelector((s) => s.search.query)

  return (
    <div className="w-full">
      <input
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        placeholder="Search for anime (e.g., Naruto, One Piece, Spy x Family)"
        className="w-full rounded-md bg-[#1a1a1a] border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-netflix-red placeholder:text-white/50"
        aria-label="Search anime"
      />
      {/* <p className="mt-2 text-xs text-white/50">Instant search with 250ms debounce. Previous requests auto-cancel on input change.</p> */}
    </div>
  )
}
