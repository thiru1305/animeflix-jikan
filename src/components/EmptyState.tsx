
export default function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <h3 className="text-xl font-semibold">No results</h3>
      <p className="text-white/60 mt-2">
        {query ? <>We couldn't find results for <span className="text-white">"{query}"</span>.</>
               : <>Start typing above to search for your favorite anime.</>}
      </p>
    </div>
  )
}
