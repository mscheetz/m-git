export default function ProfileFilter({ profiles, selected, onToggle, onRemove }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {profiles.map((p) => {
        const active = selected.includes(p.username)
        return (
          <div key={p.username} className="relative group">
            <button
              onClick={() => onToggle(p.username)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {p.label}
            </button>
            <button
              onClick={() => onRemove(p.username)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-400 hover:bg-red-500
                text-white rounded-full text-[10px] leading-none flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity"
              title={`Remove ${p.label}`}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}