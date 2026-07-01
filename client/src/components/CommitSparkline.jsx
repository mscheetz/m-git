import { useCommitActivity, aggregateByMonth } from '../api'

export default function CommitSparkline({ repoFullName, pushedAt, token }) {
  const { data, isLoading } = useCommitActivity(repoFullName, pushedAt, token)

  if (isLoading) {
    return (
      <div className="flex items-end gap-0.5 h-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-100 rounded-sm animate-pulse"
            style={{ height: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) return null

  const months = aggregateByMonth(data)
  const max = Math.max(...months.map((m) => m.count), 1)

  const barHeight = (count) => Math.max((count / max) * 28, 2)

  function shortLabel(monthStr) {
    const [y, m] = monthStr.split('-')
    return `${m}/${y.slice(2)}`
  }

  return (
    <div className="mt-2">
      <div className="flex items-end gap-0.5 h-8">
        {months.map((m) => (
          <div
            key={m.month}
            className="flex-1 relative group"
          >
            <div
              className="w-full bg-blue-400 rounded-sm transition-all hover:bg-blue-500"
              style={{ height: `${barHeight(m.count)}px` }}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
              hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5
              rounded whitespace-nowrap z-10">
              {shortLabel(m.month)}: {m.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}