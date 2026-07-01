export default function ToggleBar({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600
          focus:ring-blue-500 focus:ring-offset-0"
      />
      {label}
    </label>
  )
}