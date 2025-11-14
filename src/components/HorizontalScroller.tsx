import React, { useRef } from 'react'

type Props<T = any> = {
  items: T[]
  render: (item: T, index: number) => React.ReactNode
  itemKey: (item: T, index: number) => React.Key
  className?: string
}

export default function HorizontalScroller<T = any>({
  items,
  render,
  itemKey,
  className = '',
}: Props<T>) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.9)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!trackRef.current) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      trackRef.current.scrollLeft += e.deltaY
    }
  }

  return (
    // overflow-hidden keeps anything inside from creating a page-wide bar
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left arrow pinned to far left */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        className="absolute inset-y-0 left-0 z-10 items-center hidden pl-1 pr-2 sm:flex"
      >
        <span className="flex items-center justify-center text-white rounded-full h-9 w-9 bg-black/70 hover:bg-black/90">‹</span>
      </button>

      {/* Scroll track — invisible scrollbar */}
      <div
        ref={trackRef}
        onWheel={onWheel}
        className="max-w-full min-w-0 overflow-x-auto overflow-y-hidden scrollbar-none"
      >
        <div className="flex gap-4 py-1">
          {items.map((it, i) => (
            <div key={itemKey(it, i)} className="snap-start shrink-0">
              {render(it, i)}
            </div>
          ))}
        </div>
      </div>

      {/* Right arrow pinned to far right */}
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        className="absolute inset-y-0 right-0 z-10 items-center hidden pl-2 pr-1 sm:flex"
      >
        <span className="flex items-center justify-center text-white rounded-full h-9 w-9 bg-black/70 hover:bg-black/90">›</span>
      </button>
    </div>
  )
}
