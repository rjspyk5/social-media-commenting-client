export default function CommentSkeleton() {
  return (
    <div className="border p-4 rounded-xl space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>

      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />

      <div className="flex gap-4">
        <div className="h-4 w-10 bg-gray-200 rounded" />
        <div className="h-4 w-10 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
