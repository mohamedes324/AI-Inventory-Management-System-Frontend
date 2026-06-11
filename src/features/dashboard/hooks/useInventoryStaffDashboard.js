import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboardSummary } from "./useDashboardSummary";
import { useLowStock } from "@/features/reports/hooks/useLowStock";
import { useOutOfStock } from "@/features/reports/hooks/useOutOfStock";
import { getPurchaseOrders } from "@/features/purchase-orders/api/getPurchaseOrders";

/**
 * Compute a stable "Last 30 Days" range using date-only strings (YYYY-MM-DD).
 * Using date-only format ensures the queryKey stays the same for the entire day,
 * preventing React Query from treating each render as a new query.
 */
function getStableDateRange() {
  const now = new Date();
  const end = now.toISOString().split("T")[0]; // "2026-06-08"
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end,
  };
}

/**
 * Compute a stable date range for the current calendar month (date-only).
 */
function getStableMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    DateFrom: start.toISOString().split("T")[0],
    DateTo: now.toISOString().split("T")[0],
  };
}

/**
 * @hook useInventoryStaffDashboard
 * @description Fetches all dashboard stats, low stock list, out of stock list,
 * recent purchases, and purchases count this month.
 *
 * Date ranges are memoized so the queryKey remains stable across re-renders,
 * preventing repeated API calls and 429 errors.
 */
export const useInventoryStaffDashboard = () => {
  // Memoize date ranges so they only change when the component mounts
  const { startDate, endDate } = useMemo(() => getStableDateRange(), []);
  const monthRange = useMemo(() => getStableMonthRange(), []);

  // 1. Dashboard summary (KPIs)
  const summaryQuery = useDashboardSummary({ startDate, endDate });

  // 2. Low Stock Products
  const lowStockQuery = useLowStock();

  // 3. Out of Stock Products
  const outOfStockQuery = useOutOfStock();

  // 4. Recent Purchases (latest 5)
  const recentPurchasesQuery = useQuery({
    queryKey: ["purchases", "recent", 5],
    queryFn: () => getPurchaseOrders({ Page: 1, PageSize: 5, SortDescending: true }),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  // 5. Purchases This Month (totalCount)
  const purchasesMonthQuery = useQuery({
    queryKey: ["purchases", "count", monthRange.DateFrom],
    queryFn: () => getPurchaseOrders({ ...monthRange, Page: 1, PageSize: 1 }),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  const isLoading =
    summaryQuery.isLoading ||
    lowStockQuery.isLoading ||
    outOfStockQuery.isLoading ||
    recentPurchasesQuery.isLoading ||
    purchasesMonthQuery.isLoading;

  const isError =
    summaryQuery.isError ||
    lowStockQuery.isError ||
    outOfStockQuery.isError ||
    recentPurchasesQuery.isError ||
    purchasesMonthQuery.isError;

  const refetch = () => {
    summaryQuery.refetch();
    lowStockQuery.refetch();
    outOfStockQuery.refetch();
    recentPurchasesQuery.refetch();
    purchasesMonthQuery.refetch();
  };

  return {
    summary: summaryQuery.data || {},
    lowStockProducts: (lowStockQuery.data || []).slice(0, 5),
    outOfStockProducts: (outOfStockQuery.data || []).slice(0, 5),
    recentPurchases: recentPurchasesQuery.data?.items || [],
    purchasesThisMonth: purchasesMonthQuery.data?.totalCount || 0,
    isLoading,
    isError,
    refetch,
  };
};
