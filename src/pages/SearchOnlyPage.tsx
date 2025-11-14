import { useNavigate } from 'react-router-dom'
import SearchBar from '@/components/SearchBar'
import AnimeCard from '@/components/AnimeCard'
import SkeletonCard from '@/components/SkeletonCard'
import ErrorState from '@/components/ErrorState'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { useSearchAnimeQuery } from '@/store/jikanApi'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setPage } from '@/store/uiSlice'
import useDebounce from '@/hooks/useDebounce'

export default function SearchOnlyPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { query, page } = useAppSelector((s) => s.search)
  const debounced = useDebounce(query, 300)
  const isBlank = debounced.trim().length === 0

  const { data, isFetching, error } = useSearchAnimeQuery(
    { q: debounced, page },
    { skip: isBlank }
  )

  const lastPage = data?.pagination?.last_visible_page ?? 1
  const perPage  = data?.pagination?.items?.per_page ?? 18

  return (
    <section className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-10">
      <div className="w-full max-w-3xl pb-6 mx-auto md:pb-8">
        {/* Back control */}
        {/* <div className="mb-3">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 text-sm rounded bg-white/10 text-white/80 ring-1 ring-white/10 hover:bg-white/15"
          >
            Back
          </button>
        </div> */}

        {/* Reuse your SearchBar */}
        <SearchBar />
      </div>

      {/* Empty until typing */}
      {isBlank ? (
        <div className="flex h-[40vh] items-center justify-center">
          {/* <p className="text-white/50">Start typing to search anime</p> */}
        </div>
      ) : error ? (
        <ErrorState message="Could not load anime. Please try again." />
      ) : isFetching ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 md:gap-6">
          {Array.from({ length: perPage }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 md:gap-6">
            {data.data.map((a) => <AnimeCard key={a.mal_id} anime={a} />)}
          </div>
          <div className="mt-6 md:mt-8">
            <Pagination page={page} lastPage={lastPage} onChange={(p) => dispatch(setPage(p))} />
          </div>
        </>
      ) : (
        <EmptyState query={debounced} />
      )}
    </section>
  )
}
