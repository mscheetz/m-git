import { useQueries } from '@tanstack/react-query'

const LEVEL_COLORS = {
  NONE: '#ebedf0',
  FIRST_QUARTILE: '#9be9a8',
  SECOND_QUARTILE: '#40c463',
  THIRD_QUARTILE: '#30a14e',
  FOURTH_QUARTILE: '#216e39',
}

const DOW = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function level(count, max) {
  if (count === 0) return 'NONE'
  const r = max / 4
  if (count <= r) return 'FIRST_QUARTILE'
  if (count <= r * 2) return 'SECOND_QUARTILE'
  if (count <= r * 3) return 'THIRD_QUARTILE'
  return 'FOURTH_QUARTILE'
}

export default function ContributionHeatmap({ usernames, token }) {
  const results = useQueries({
    queries: usernames.map((u) => ({
      queryKey: ['contributions', u],
      queryFn: async () => {
        const q = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`
        const res = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, variables: { login: u } }),
        })
        if (!res.ok) throw new Error('Failed to fetch contributions')
        const json = await res.json()
        if (json.errors) throw new Error(json.errors[0].message)
        return json.data.user.contributionsCollection.contributionCalendar
      },
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!token && usernames.includes(u),
    })),
  })

  if (!token) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-400 text-center py-4">
          Add a GitHub token above to see contribution heatmaps
        </div>
      </div>
    )
  }

  const isLoading = results.some((r) => r.isLoading)
  const errors = results.map((r) => r.error).filter(Boolean)

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
      </div>
    )
  }

  const datasets = results.map((r, i) => r.data).filter(Boolean)

  if (datasets.length === 0 && !isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-400 text-center py-4">
          Select a profile to see its contribution heatmap
        </div>
      </div>
    )
  }

  const cs = 11
  const first = datasets[0]
  const totalContributions = datasets.reduce((s, d) => s + d.totalContributions, 0)

  const mergedWeeks = first.weeks.map((week, wi) => {
    const days = week.contributionDays.map((day, di) => {
      const count = datasets.reduce((s, d) => s + (d.weeks[wi]?.contributionDays[di]?.contributionCount || 0), 0)
      return { date: day.date, contributionCount: count }
    })
    return { contributionDays: days }
  })

  const allCounts = mergedWeeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount))
  const max = Math.max(...allCounts, 1)

  const dayCount = {}
  for (const w of first.weeks) {
    for (const d of w.contributionDays) {
      const m = d.date.slice(0, 7)
      dayCount[m] = (dayCount[m] || 0) + 1
    }
  }

  let prev = ''
  const monthCols = first.weeks.map((w, i) => {
    const d = new Date(w.contributionDays[0].date)
    const m = d.toLocaleString('en-US', { month: 'short' })
    const key = d.toISOString().slice(0, 7)
    if (m === prev || (dayCount[key] || 0) <= 3) return null
    prev = m
    return { month: m, col: i }
  }).filter(Boolean)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {errors.length > 0 && (
        <div className="mb-3 text-xs text-red-500">
          {errors.map((e, i) => <div key={i}>{usernames[i]}: {e.message}</div>)}
        </div>
      )}

      <div className="text-sm text-gray-600 mb-3">
        <span className="font-semibold text-gray-900">{totalContributions.toLocaleString()}</span> contributions in the last year
        {usernames.length > 1 && <span className="text-gray-400"> ({usernames.join(', ')})</span>}
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col" style={{ gap: 1 }}>
          <div style={{ position: 'relative', height: cs + 2, paddingLeft: 30 }}>
            {monthCols.map((m) => (
              <div key={m.col} className="text-[10px] text-gray-500 leading-none absolute"
                style={{ left: 30 + m.col * (cs + 1.5), lineHeight: `${cs + 2}px` }}>
                {m.month}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 1.5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1.5, paddingTop: 0.5 }}>
              {DOW.map((l, i) => (
                <div key={i} className="text-[10px] text-gray-400 leading-none pr-1 text-right"
                  style={{ width: 24, height: cs, lineHeight: `${cs}px` }}>
                  {l}
                </div>
              ))}
            </div>

            {mergedWeeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {week.contributionDays.map((day, di) => (
                  <div key={di} className="rounded-sm group relative cursor-default"
                    style={{ width: cs, height: cs, backgroundColor: LEVEL_COLORS[level(day.contributionCount, max)] }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
                      hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5
                      rounded whitespace-nowrap z-10 pointer-events-none">
                      {day.contributionCount} contributions on {day.date}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4, paddingLeft: 30 }}>
            <span className="text-[10px] text-gray-400">Less</span>
            {['NONE','FIRST_QUARTILE','SECOND_QUARTILE','THIRD_QUARTILE','FOURTH_QUARTILE'].map((l) => (
              <div key={l} className="rounded-sm" style={{ width: cs, height: cs, backgroundColor: LEVEL_COLORS[l] }} />
            ))}
            <span className="text-[10px] text-gray-400">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}