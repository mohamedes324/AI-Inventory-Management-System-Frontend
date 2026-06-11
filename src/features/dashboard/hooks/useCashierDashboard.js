import { useState, useEffect, useCallback, useRef } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getOrders } from "@/features/orders/api/getOrders";
import { getUserIdFromToken } from "@/shared/utils/jwt";
import { ORDER_STATUS } from "@/features/orders/types/orderTypes";

/**
 * @hook useCashierDashboard
 * @description Fetches all data for the Cashier Dashboard:
 *  - Draft orders (first 5)
 *  - Pending deliveries (first 5)
 *  - Recent orders (first 5)
 *  - Monthly stats (completed, cancelled, pending deliveries, total this month)
 *
 * All queries are scoped to the currently logged-in cashier.
 */
export const useCashierDashboard = () => {
  const cashierId = getUserIdFromToken();

  // ── Data state ──
  const [draftOrders, setDraftOrders] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [pendingDeliveryCount, setPendingDeliveryCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);
  const [completedThisMonth, setCompletedThisMonth] = useState(0);
  const [cancelledThisMonth, setCancelledThisMonth] = useState(0);
  const [pendingThisMonth, setPendingThisMonth] = useState(0);

  // ── Loading / error state ──
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { execute } = useRequest(getOrders);
  const executeRef = useRef(execute);
  executeRef.current = execute;

  /** Date helpers */
  const getMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      DateFrom: start.toISOString(),
      DateTo: now.toISOString(),
    };
  };

  const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return {
      DateFrom: start.toISOString(),
      DateTo: now.toISOString(),
    };
  };

  const fetchAll = useCallback(async () => {
    if (!cashierId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const monthRange = getMonthRange();
    const todayRange = getTodayRange();

    try {
      // Fire all requests in parallel
      const [
        draftsRes,
        pendingRes,
        recentRes,
        completedTodayRes,
        ordersMonthRes,
        completedMonthRes,
        cancelledMonthRes,
        pendingMonthRes,
      ] = await Promise.all([
        // 1. Draft orders (top 5)
        executeRef.current({
          CashierId: cashierId,
          Status: ORDER_STATUS.DRAFT,
          Page: 1,
          PageSize: 5,
          SortDescending: true,
        }),
        // 2. Pending deliveries (top 5)
        executeRef.current({
          CashierId: cashierId,
          Status: ORDER_STATUS.OUT_FOR_DELIVERY,
          Page: 1,
          PageSize: 5,
          SortDescending: true,
        }),
        // 3. Recent orders (fetch 30 so we can filter out drafts on the client)
        executeRef.current({
          CashierId: cashierId,
          Page: 1,
          PageSize: 30,
          SortDescending: true,
        }),
        // 4. Completed today (just need totalCount)
        executeRef.current({
          CashierId: cashierId,
          Status: ORDER_STATUS.COMPLETED,
          ...todayRange,
          Page: 1,
          PageSize: 1,
        }),
        // 5. Orders this month (totalCount)
        executeRef.current({
          CashierId: cashierId,
          ...monthRange,
          Page: 1,
          PageSize: 1,
        }),
        // 6. Completed this month (totalCount)
        executeRef.current({
          CashierId: cashierId,
          Status: ORDER_STATUS.COMPLETED,
          ...monthRange,
          Page: 1,
          PageSize: 1,
        }),
        // 7. Cancelled this month (totalCount)
        executeRef.current({
          CashierId: cashierId,
          Status: ORDER_STATUS.CANCELLED,
          ...monthRange,
          Page: 1,
          PageSize: 1,
        }),
        // 8. Pending deliveries this month (totalCount)
        executeRef.current({
          CashierId: cashierId,
          Status: ORDER_STATUS.OUT_FOR_DELIVERY,
          ...monthRange,
          Page: 1,
          PageSize: 1,
        }),
      ]);

      // Helper to resolve status to integer key
      const getStatusKey = (status) => {
        if (typeof status === "number") return status;
        if (typeof status === "string") {
          const map = {
            Draft: 0,
            OutForDelivery: 1,
            Completed: 2,
            Cancelled: 3,
          };
          return map[status];
        }
        return undefined;
      };

      // ── Update state ──
      setDraftOrders(draftsRes.items || []);
      setDraftCount(draftsRes.totalCount || 0);

      setPendingDeliveries(pendingRes.items || []);
      setPendingDeliveryCount(pendingRes.totalCount || 0);

      // Filter out Drafts (status key 0) and slice to top 5
      const nonDraftRecent = (recentRes.items || [])
        .filter((order) => getStatusKey(order.status) !== ORDER_STATUS.DRAFT)
        .slice(0, 5);
      setRecentOrders(nonDraftRecent);

      setCompletedToday(completedTodayRes.totalCount || 0);
      setOrdersThisMonth(ordersMonthRes.totalCount || 0);
      setCompletedThisMonth(completedMonthRes.totalCount || 0);
      setCancelledThisMonth(cancelledMonthRes.totalCount || 0);
      setPendingThisMonth(pendingMonthRes.totalCount || 0);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [cashierId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    // Sections
    draftOrders,
    draftCount,
    pendingDeliveries,
    pendingDeliveryCount,
    recentOrders,
    // Stats
    completedToday,
    ordersThisMonth,
    completedThisMonth,
    cancelledThisMonth,
    pendingThisMonth,
    // Meta
    isLoading,
    isError,
    refetch: fetchAll,
    cashierId,
  };
};
