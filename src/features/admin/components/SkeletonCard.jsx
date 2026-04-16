export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 animate-pulse flex flex-col gap-4">

      {/* Image */}
      <div className="w-full h-[160px] bg-gray-200 rounded-xl"></div>

      {/* Name */}
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>

      {/* Status */}
      <div className="h-5 bg-gray-200 rounded w-24"></div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>

    </div>
  );
}