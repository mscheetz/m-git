import { useState } from 'react'

export default function TokenInput({ token, tokenValid, onSave }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(token || '')

  function handleSave() {
    onSave(value || null)
    setOpen(false)
  }

  function handleClear() {
    setValue('')
    onSave(null)
    setOpen(false)
  }

  return (
    <div>
      {token && tokenValid ? null : token ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-600">Token invalid</span>
            <button
              onClick={() => setOpen(!open)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {open ? 'close' : 'fix'}
            </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ghp_... (GitHub token)"
            className="px-3 py-1.5 border border-gray-300 rounded text-xs
              focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      )}

      {open && token && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ghp_..."
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs
              focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}