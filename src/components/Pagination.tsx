
type Props = {
  page: number
  lastPage: number
  onChange: (page: number) => void
}

export default function Pagination({ page, lastPage, onChange }: Props) {
  const canPrev = page > 1
  const canNext = page < lastPage

  const pages = []
  const maxButtons = 7
  const start = Math.max(1, page - 3)
  const end = Math.min(lastPage, start + maxButtons - 1)
  for (let p = start; p <= end; p++) pages.push(p)

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
      <button
        className="px-3 py-2 rounded bg-[#1a1a1a] disabled:opacity-50"
        onClick={() => onChange(page - 1)}
        disabled={!canPrev}
      >
        Prev
      </button>
      {pages[0] > 1 && <span className="px-2">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-2 rounded ${p === page ? 'bg-netflix-red' : 'bg-[#1a1a1a] hover:bg-[#222]'}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < lastPage && <span className="px-2">…</span>}
      <button
        className="px-3 py-2 rounded bg-[#1a1a1a] disabled:opacity-50"
        onClick={() => onChange(page + 1)}
        disabled={!canNext}
      >
        Next
      </button>
    </div>
  )
}
