import { useState, useEffect, useCallback, useRef } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getDeliveryOrders } from "../api/getDeliveryOrders";

/**
 * @hook useDeliveryOrders
 * @description Manages delivery order fetching with pagination.
 * @param {number} initialPageSize - Default page size (20)
 * @returns {Object} state & actions
 */
export const useDeliveryOrders = (initialPageSize = 20) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const { execute, loading } = useRequest(getDeliveryOrders);
  const executeRef = useRef(execute);
  executeRef.current = execute;

  /**
   * Fetch orders with given params.
   */
  const fetchOrders = useCallback(async (params) => {
    try {
      const data = await executeRef.current(params);
      setOrders(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setHasNextPage(data.hasNextPage || false);
      setHasPreviousPage(data.hasPreviousPage || false);
    } catch {
      // Error is handled by useRequest
    }
  }, []);

  /**
   * Initial load — page 1.
   */
  useEffect(() => {
    fetchOrders({
      page: 1,
      pageSize: initialPageSize,
      sortDescending: true,
    });
  }, [fetchOrders, initialPageSize]);

  /**
   * Page change handler.
   */
  const changePage = useCallback(
    (newPage) => {
      fetchOrders({
        page: newPage,
        pageSize: initialPageSize,
        sortDescending: true,
      });
    },
    [fetchOrders, initialPageSize]
  );

  /**
   * Refresh the current page.
   */
  const refresh = useCallback(() => {
    fetchOrders({
      page: page,
      pageSize: initialPageSize,
      sortDescending: true,
    });
  }, [fetchOrders, page, initialPageSize]);

  return {
    orders,
    loading,
    page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    changePage,
    refresh,
  };
};
