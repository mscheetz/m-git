export default function LanguageFilter({ languages, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
          ${!selected
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        All
      </button>
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
            ${selected === lang
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}