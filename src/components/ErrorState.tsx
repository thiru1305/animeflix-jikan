
export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-red-500/40 text-red-300 rounded-lg p-4">
      <p className="font-semibold">Something went wrong</p>
      <p className="text-sm opacity-80 mt-1">{message}</p>
    </div>
  )
}
