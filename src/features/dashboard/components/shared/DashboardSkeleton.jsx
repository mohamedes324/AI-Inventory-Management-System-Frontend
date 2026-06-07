/**
 * @component DashboardSkeleton
 * @description Full-page skeleton loader for the dashboard, shown while data is loading.
 */
export default function DashboardSkeleton() {
  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1440px] mx-auto animate-fadeIn">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="w-72 h-8 rounded-lg animate-shimmer mb-2" />
          <div className="w-56 h-5 rounded-lg animate-shimmer" />
        </div>
        <div className="flex gap-3">
          <div className="w-36 h-10 rounded-xl animate-shimmer" />
          <div className="w-28 h-10 rounded-xl animate-shimmer" />
        </div>
      </div>

      {/* KPI skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-primary bg-background-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl animate-shimmer" />
              <div className="w-16 h-4 rounded animate-shimmer" />
            </div>
            <div className="w-24 h-8 rounded-lg animate-shimmer mb-2" />
            <div className="w-32 h-4 rounded animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Alerts skeleton */}
      <div className="mb-10">
        <div className="w-48 h-5 rounded animate-shimmer mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border-primary bg-background-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg animate-shimmer" />
                <div className="flex-1">
                  <div className="w-20 h-3.5 rounded animate-shimmer mb-2" />
                  <div className="w-40 h-4 rounded animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-primary bg-background-card p-6">
            <div className="w-40 h-5 rounded animate-shimmer mb-6" />
            <div className="w-full h-[240px] rounded-xl animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
