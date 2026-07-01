import { useState } from 'react'
import { validateUser } from '../api'

export default function AddProfile({ token, onAdd }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleAdd() {
    const name = value.trim()
    if (!name) return

    setStatus('validating')
    setError('')

    try {
      const user = await validateUser(name, token)
      if (!user) {
        setError(`"${name}" not found on GitHub`)
        setStatus('idle')
        return
      }
      onAdd(user.login)
      setValue('')
      setStatus('idle')
      setOpen(false)
    } catch {
      setError('Could not verify user')
      setStatus('idle')
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-500
          border border-dashed border-gray-300 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Add profile
      </button>

      {open && (
        <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <input
            type="text"
            value={value}
            onChange={(e) => setError('') & setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="GitHub username..."
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs
              focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={status === 'validating'}
              className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {status === 'validating' ? 'Checking...' : 'Add'}
            </button>
            <button
              onClick={() => { setOpen(false); setValue(''); setError('') }}
              className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}