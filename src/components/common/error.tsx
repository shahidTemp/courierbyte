// @ts-nocheck
import { Link, useLocation, useRouter } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }) {
  const router = useRouter()
  const isRoot = useLocation({
    select: (location) => location.pathname === '/',
  })

  console.error(error)

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">

      {/* ✅ Error Message নিজে দেখাও */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold text-red-500">
          Something went wrong!
        </h2>
        {/* error.message এখানে তোমার throw করা message দেখাবে */}
        {error.message && (
          <p className="text-sm text-gray-600 max-w-md">
            {error.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => router.invalidate()} className="px-2 py-1 bg-gray-600 rounded-sm text-white uppercase font-extrabold">
          Try Again
        </button>

        {isRoot
          ? <Link to="/" className="px-2 py-1 bg-gray-600 rounded-sm text-white uppercase font-extrabold">
            Home
          </Link>
          : <Link to="/" className="px-2 py-1 bg-gray-600 rounded-sm text-white uppercase font-extrabold"
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            Go Back
          </Link>
        }
      </div>
    </div>
  )
}
