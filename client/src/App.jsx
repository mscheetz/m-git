import { useState, useMemo } from 'react'
import { PROFILES, useMultiProfileRepos, useProfileUsers } from './api'
import ProfileCard from './components/ProfileCard'
import ProfileFilter from './components/ProfileFilter'
import AddProfile from './components/AddProfile'
import SearchBar from './components/SearchBar'
import LanguageFilter from './components/LanguageFilter'
import ToggleBar from './components/ToggleBar'
import TokenInput from './components/TokenInput'
import RepoGrid from './components/RepoGrid'
import ContributionHeatmap from './components/ContributionHeatmap'

function App() {
  const [allProfiles, setAllProfiles] = useState(() => {
    const saved = localStorage.getItem('mGit-all-profiles')
    return saved ? JSON.parse(saved) : PROFILES
  })
  const [selectedProfiles, setSelectedProfiles] = useState(() => {
    return allProfiles.map((p) => p.username)
  })
  const [token, setToken] = useState(() => {
    return import.meta.env.VITE_GITHUB_TOKEN || localStorage.getItem('mGit-token') || ''
  })
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState(null)
  const [showForks, setShowForks] = useState(true)
  const [showArchived, setShowArchived] = useState(true)
  const [showActivity, setShowActivity] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(true)

  const { repos, isLoading: reposLoading, error } = useMultiProfileRepos(selectedProfiles, token)
  const { users, isLoading: usersLoading } = useProfileUsers(selectedProfiles, token)

  const isRateLimited = error?.message?.toLowerCase().includes('rate limit')

  function saveProfiles(next) {
    setAllProfiles(next)
    localStorage.setItem('mGit-all-profiles', JSON.stringify(next))
  }

  function toggleProfile(username) {
    setSelectedProfiles((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    )
  }

  function removeProfile(username) {
    const nextProfiles = allProfiles.filter((p) => p.username !== username)
    saveProfiles(nextProfiles)
    setSelectedProfiles((prev) => prev.filter((u) => u !== username))
  }

  function addProfile(username) {
    const exists = allProfiles.some((p) => p.username === username)
    if (exists) return
    const next = [...allProfiles, { username, label: username }]
    saveProfiles(next)
    setSelectedProfiles((prev) => [...prev, username])
  }

  function handleToken(next) {
    setToken(next || '')
    if (next) localStorage.setItem('mGit-token', next)
    else localStorage.removeItem('mGit-token')
  }

  const languages = useMemo(() => {
    const set = new Set()
    for (const repo of repos) {
      if (repo.language) set.add(repo.language)
    }
    return [...set].sort()
  }, [repos])

  const filtered = useMemo(() => {
    return repos
      .filter((repo) => {
        if (!showForks && repo.fork) return false
        if (!showArchived && repo.archived) return false
        if (language && repo.language !== language) return false
        if (search) {
          const q = search.toLowerCase()
          if (
            !repo.name.toLowerCase().includes(q) &&
            !(repo.description && repo.description.toLowerCase().includes(q))
          )
            return false
        }
        return true
      })
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
  }, [repos, search, language, showForks, showArchived])

  if (reposLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-2 flex-wrap items-start">
            <ProfileFilter
              profiles={allProfiles}
              selected={selectedProfiles}
              onToggle={toggleProfile}
              onRemove={removeProfile}
            />
            <AddProfile token={token} onAdd={addProfile} />
          </div>
          <TokenInput token={token} onSave={handleToken} />
        </div>

        {isRateLimited && !token && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">API rate limit reached</p>
            <p className="text-xs text-amber-700 mt-1">
              Unauthenticated requests limited to 60/hour. Paste a GitHub token above for 5000/hour. 
              Create at{' '}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer"
                className="underline hover:text-amber-900">github.com/settings/tokens</a>
              {' '}(no scopes needed).
            </p>
          </div>
        )}

        {error && !isRateLimited && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error.message}
          </div>
        )}

        <div className="flex gap-6 flex-wrap mb-8">
          {[...users].sort((a, b) => (a.login || '').localeCompare(b.login || '')).map((u) => (
            <ProfileCard key={u.login} user={u} />
          ))}
        </div>

        {showHeatmap && (
          <div className="mb-8">
            <ContributionHeatmap usernames={selectedProfiles} token={token} />
          </div>
        )}

        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} />

          <LanguageFilter
            languages={languages}
            selected={language}
            onSelect={setLanguage}
          />

          <div className="flex gap-4 flex-wrap">
            <ToggleBar
              label="Show forks"
              checked={showForks}
              onChange={setShowForks}
            />
            <ToggleBar
              label="Show archived"
              checked={showArchived}
              onChange={setShowArchived}
            />
            <ToggleBar
              label="Commit activity"
              checked={showActivity}
              onChange={setShowActivity}
            />
            <ToggleBar
              label="Heatmap"
              checked={showHeatmap}
              onChange={setShowHeatmap}
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">
            {filtered.length} {filtered.length === 1 ? 'repository' : 'repositories'}
          </p>
          <RepoGrid repos={filtered} showActivity={showActivity} token={token} />
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          {allProfiles.map((p, i) => (
            <span key={p.username}>
              {i > 0 && <span> · </span>}
              <a href={`https://github.com/${p.username}`} target="_blank" rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors">
                github.com/{p.username}
              </a>
            </span>
          ))}
        </footer>
      </div>
    </div>
  )
}

export default App