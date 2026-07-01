import { useQuery, useQueries } from '@tanstack/react-query'

export const PROFILES = [
  { username: 'Matt-Scheetz', label: 'Matt-Scheetz' },
  { username: 'mscheetz', label: 'mscheetz' },
]

export async function validateUser(username, token) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Validation failed')
  return res.json()
}

const QC = {
  staleTime: 1000 * 60 * 60,
  gcTime: 1000 * 60 * 60 * 2,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
}

function headers(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useMultiProfileRepos(usernames, token) {
  const results = useQueries({
    queries: usernames.map((username) => ({
      queryKey: ['repos', username],
      queryFn: async () => {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?sort=pushed&per_page=50&type=all`,
          { headers: headers(token) }
        )
        if (!res.ok) throw new Error(`Failed to fetch ${username} repos`)
        const repos = await res.json()
        return repos.map((r) => ({ ...r, _owner: username }))
      },
      ...QC,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const repos = results.flatMap((r) => r.data || [])
  const error = results.find((r) => r.error)?.error || null

  return { repos, isLoading, error }
}

export function useProfileUsers(usernames, token) {
  const results = useQueries({
    queries: usernames.map((username) => ({
      queryKey: ['user', username],
      queryFn: async () => {
        const res = await fetch(
          `https://api.github.com/users/${username}`,
          { headers: headers(token) }
        )
        if (!res.ok) throw new Error(`Failed to fetch ${username}`)
const data = await res.json()
      return Array.isArray(data) ? data : []
      },
      ...QC,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const users = results.map((r) => r.data).filter(Boolean)
  return { users, isLoading }
}

export function useCommitActivity(repoFullName, pushedAt, token) {
  const recent = Date.now() - new Date(pushedAt).getTime() < 1000 * 60 * 60 * 24 * 90
  return useQuery({
    queryKey: ['commit-activity', repoFullName],
    queryFn: async () => {
      const res = await fetch(
        `https://api.github.com/repos/${repoFullName}/stats/commit_activity`,
        { headers: headers(token) }
      )
      if (res.status === 202) return []
      if (!res.ok) throw new Error('Failed to fetch commit activity')
      const data = await res.json()
      return Array.isArray(data) ? data : []
    },
    ...QC,
    enabled: !!repoFullName && recent,
  })
}

export function useContributionCalendar(username, token, enabled) {
  return useQuery({
    queryKey: ['contributions', username],
    queryFn: async () => {
      const query = `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }`
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables: { login: username } }),
      })
      if (!res.ok) throw new Error('Failed to fetch contributions')
      const json = await res.json()
      if (json.errors) throw new Error(json.errors[0].message)
      return json.data.user.contributionsCollection.contributionCalendar
    },
    ...QC,
    enabled: !!token && !!username && enabled,
  })
}

export function aggregateByMonth(weeklyData) {
  if (!Array.isArray(weeklyData)) return []
  const months = {}
  for (const week of weeklyData) {
    const date = new Date(week.week * 1000)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months[key] = (months[key] || 0) + week.total
  }
  return Object.entries(months).map(([month, count]) => ({ month, count }))
}

const LANGUAGE_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C#': '#178600',
  C: '#555555',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Lua: '#000080',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Haskell: '#5e5086',
  Elm: '#60B5CC',
  Clojure: '#db5855',
  Elixir: '#6e4a7e',
  Erlang: '#B83998',
  Scala: '#c22d40',
  R: '#198CE7',
  Dockerfile: '#384d54',
  Makefile: '#427819',
}

export function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || '#858585'
}

export function timeAgo(dateString) {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export function formatCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return count
}