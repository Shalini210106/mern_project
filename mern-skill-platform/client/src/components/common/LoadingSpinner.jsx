export default function LoadingSpinner({ fullScreen = true, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' }
  const spinner = <div className={`${sizes[size]} border-4 border-indigo-600 border-t-transparent rounded-full animate-spin`} />
  if (!fullScreen) return <div className="flex justify-center py-8">{spinner}</div>
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {spinner}
      <p className="text-gray-500 mt-4 text-sm">Loading...</p>
    </div>
  )
}
