import { useState, useEffect, useCallback, useRef } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getReturnOrders } from "../api/getReturnOrders";

/**
 * @hook useReturnOrders
 * @description Manages return order fetching with pagination and date filters.
 * @param {number} initialPageSize - Default page size (10)
 * @returns {Object} state & actions
 */
export const useReturnOrders = (initialPageSize = 10) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const { execute, loading } = useRequest(getReturnOrders);
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
      Page: 1,
      PageSize: initialPageSize,
    });
  }, [fetchOrders, initialPageSize]);

  /**
   * Build API params from filter object.
   */
  const buildParams = useCallback(
    (filters, pageNum = 1) => {
      const params = {
        Page: pageNum,
        PageSize: initialPageSize,
      };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      return params;
    },
    [initialPageSize]
  );

  /**
   * Apply date filters.
   */
  const applyFilters = useCallback(
    (filters) => {
      setActiveFilters(filters);
      setIsFiltered(true);
      fetchOrders(buildParams(filters, 1));
    },
    [fetchOrders, buildParams]
  );

  /**
   * Reset to default view.
   */
  const resetFilters = useCallback(() => {
    setActiveFilters(null);
    setIsFiltered(false);
    fetchOrders({
      Page: 1,
      PageSize: initialPageSize,
    });
  }, [fetchOrders, initialPageSize]);

  /**
   * Page change handler.
   */
  const changePage = useCallback(
    (newPage) => {
      if (activeFilters) {
        fetchOrders(buildParams(activeFilters, newPage));
      } else {
        fetchOrders({
          Page: newPage,
          PageSize: initialPageSize,
        });
      }
    },
    [fetchOrders, buildParams, activeFilters, initialPageSize]
  );

  /**
   * Refresh the current page.
   */
  const refresh = useCallback(() => {
    if (activeFilters) {
      fetchOrders(buildParams(activeFilters, page));
    } else {
      fetchOrders({
        Page: page,
        PageSize: initialPageSize,
      });
    }
  }, [fetchOrders, buildParams, activeFilters, page, initialPageSize]);

  return {
    orders,
    loading,
    page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    isFiltered,
    activeFilters,
    applyFilters,
    resetFilters,
    changePage,
    refresh,
  };
};
