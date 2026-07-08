import { getLanguageColor, timeAgo, formatCount } from '../api'
import CommitSparkline from './CommitSparkline'

export default function RepoCard({ repo, showActivity, token }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate block"
          >
            {repo.name}
          </a>
          <span className="text-[11px] text-gray-400">{repo._owner}</span>
          {repo.has_pages && (
            <a
              href={`https://${repo._owner}.github.io/${repo.name}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex ml-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="GitHub Pages"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </a>
          )}
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1 text-xs font-medium text-gray-700 border
            border-gray-300 rounded-lg hover:bg-gray-50 transition-colors no-underline"
        >
          View
        </a>
      </div>

      {repo.description && (
        <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">
          {repo.description}
        </p>
      )}

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 rounded-full"
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="px-2 py-0.5 text-[11px] text-gray-500">
              +{repo.topics.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          {formatCount(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {formatCount(repo.forks_count)}
        </span>
        <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>
      </div>

      <div className="flex gap-2 mt-2">
        {repo.fork && (
          <span className="text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
            Fork
          </span>
        )}
        {repo.archived && (
          <span className="text-[11px] text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
            Archived
          </span>
        )}
      </div>

      {showActivity && (
        <CommitSparkline repoFullName={repo.full_name} pushedAt={repo.pushed_at} token={token} />
      )}
    </div>
  )
}