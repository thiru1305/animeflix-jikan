// Navbar.tsx
import { Link, useNavigate } from 'react-router-dom'
import { FcSearch, FcBookmark } from 'react-icons/fc'
import { useAppDispatch } from '@/hooks/useStore'
import { setPage, setQuery } from '@/store/uiSlice'
import AnimeflixLogo from '@/components/AnimeflixLogo'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const goHome = () => {
    dispatch(setQuery(''))
    dispatch(setPage(1))
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50">
    <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:h-20">
      <button
        onClick={goHome}
        aria-label="Go to Home"
        className="flex items-center -ml-2 sm:-ml-3 lg:-ml-4" // ← nudge left
      >
        <AnimeflixLogo
          className="block h-10 md:h-12 lg:h-14"
          curve="flat"
          arcStrength={0}
          rightBias={0}
          leftBias={0}
          tracking={-0.5}
          strokeWidth={18}
        />
      </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/search" aria-label="Search" className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white">
            <FcSearch size={22} />
          </Link>
          <Link to="/mylists" aria-label="My Lists" className="p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white">
            <FcBookmark size={22} />
          </Link>
        </div>
      </div>
    </header>
  )
}
