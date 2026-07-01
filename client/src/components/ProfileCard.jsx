export default function ProfileCard({ user }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user.name || user.login}
        </h1>
        {user.bio && <p className="text-gray-600 mt-0.5">{user.bio}</p>}
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-700 mt-0.5 inline-block"
        >
          @{user.login}
        </a>
      </div>
    </div>
  )
}