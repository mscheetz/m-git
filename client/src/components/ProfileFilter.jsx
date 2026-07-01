export default function ProfileFilter({ profiles, selected, onToggle }) {
  return (
    <div className="flex gap-2">
      {profiles.sort(p => p.username).map((p) => {
        const active = selected.includes(p.username)
        return (
          <button
            key={p.username}
            onClick={() => onToggle(p.username)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}