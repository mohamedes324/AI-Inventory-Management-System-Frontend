/**
 * @component DashboardGrid
 * @description Responsive grid layout for dashboard cards.
 * Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col.
 */
export default function DashboardGrid({ cols = 4, children, className = "" }) {
  const colsMap = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  };
  return (
    <div className={`grid ${colsMap[cols] || colsMap[4]} gap-4 ${className}`}>
      {children}
    </div>
  );
}
