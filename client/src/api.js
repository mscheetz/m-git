import { useQuery } from '@tanstack/react-query'

const USERNAME = 'mscheetz'

async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=100&type=all`
  )
  if (!res.ok) throw new Error('Failed to fetch repos')
  return res.json()
}

async function fetchUser() {
  const res = await fetch(`https://api.github.com/users/${USERNAME}`)
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

export function useRepos() {
  return useQuery({
    queryKey: ['repos', USERNAME],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUser() {
  return useQuery({
    queryKey: ['user', USERNAME],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  })
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
