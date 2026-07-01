import { useState, useMemo } from 'react'
import { useRepos, useUser } from './api'
import ProfileCard from './components/ProfileCard'
import SearchBar from './components/SearchBar'
import LanguageFilter from './components/LanguageFilter'
import ToggleBar from './components/ToggleBar'
import RepoGrid from './components/RepoGrid'

function App() {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState(null)
  const [showForks, setShowForks] = useState(true)
  const [showArchived, setShowArchived] = useState(true)

  const { data: user, isLoading: userLoading } = useUser()
  const { data: repos, isLoading: reposLoading } = useRepos()

  const languages = useMemo(() => {
    if (!repos) return []
    const set = new Set()
    for (const repo of repos) {
      if (repo.language) set.add(repo.language)
    }
    return [...set].sort()
  }, [repos])

  const filtered = useMemo(() => {
    if (!repos) return []
    return repos.filter((repo) => {
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
  }, [repos, search, language, showForks, showArchived])

  if (reposLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {user && <ProfileCard user={user} />}

        <div className="mt-8 space-y-4">
          <SearchBar value={search} onChange={setSearch} />

          <LanguageFilter
            languages={languages}
            selected={language}
            onSelect={setLanguage}
          />

          <div className="flex gap-4">
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
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">
            {filtered.length} {filtered.length === 1 ? 'repository' : 'repositories'}
          </p>
          <RepoGrid repos={filtered} />
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          <a
            href="https://github.com/mscheetz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            github.com/mscheetz
          </a>
        </footer>
      </div>
    </div>
  )
}

export default App
