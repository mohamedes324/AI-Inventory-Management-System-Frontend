import { useState, useEffect, useCallback, useRef } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getOrders } from "../api/getOrders";
import { getSortByParam } from "../types/orderTypes";

/**
 * @hook useOrders
 * @description Manages order fetching with pagination and filters.
 * Always uses real API pagination (10 per page).
 * Supports optional filters via the search modal.
 *
 * @param {number} initialPageSize - Default page size (10)
 * @returns {Object} state & actions
 */
export const useOrders = (initialPageSize = 10) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const { execute, loading } = useRequest(getOrders);
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
   * Initial load — page 1 with real pagination.
   */
  useEffect(() => {
    fetchOrders({
      Page: 1,
      PageSize: initialPageSize,
      SortDescending: true,
    });
  }, [fetchOrders, initialPageSize]);

  /**
   * Build API params from filter object.
   */
  const buildParams = useCallback((filters, pageNum = 1) => {
    const params = {
      Page: pageNum,
      PageSize: initialPageSize,
      SortDescending: filters.SortDescending,
    };

    // SortBy: only send if price (sortBy=1), date is backend default
    const sortByParam = getSortByParam(filters.SortBy);
    if (sortByParam !== undefined) params.SortBy = sortByParam;

    if (filters.CashierId) params.CashierId = filters.CashierId;
    if (filters.DateFrom) params.DateFrom = filters.DateFrom;
    if (filters.DateTo) params.DateTo = filters.DateTo;
    // MinTotal/MaxTotal — only send if changed from defaults
    if (filters.MinTotal > 0) params.MinTotal = filters.MinTotal;
    if (filters.MaxTotal < 100000) params.MaxTotal = filters.MaxTotal;
    // Enum filters — only send if explicitly selected
    if (filters.Status !== null && filters.Status !== undefined) params.Status = filters.Status;
    if (filters.PaymentMethod !== null && filters.PaymentMethod !== undefined) params.PaymentMethod = filters.PaymentMethod;
    if (filters.Type !== null && filters.Type !== undefined) params.Type = filters.Type;

    return params;
  }, [initialPageSize]);

  /**
   * Apply filters from the search modal.
   */
  const applyFilters = useCallback((filters) => {
    setActiveFilters(filters);
    setIsFiltered(true);
    fetchOrders(buildParams(filters, 1));
  }, [fetchOrders, buildParams]);

  /**
   * Reset to initial default view (page 1, no filters).
   */
  const resetFilters = useCallback(() => {
    setActiveFilters(null);
    setIsFiltered(false);
    fetchOrders({
      Page: 1,
      PageSize: initialPageSize,
      SortDescending: true,
    });
  }, [fetchOrders, initialPageSize]);

  /**
   * Page change handler — re-fetches with current filters or defaults.
   */
  const changePage = useCallback((newPage) => {
    if (activeFilters) {
      fetchOrders(buildParams(activeFilters, newPage));
    } else {
      fetchOrders({
        Page: newPage,
        PageSize: initialPageSize,
        SortDescending: true,
      });
    }
  }, [fetchOrders, buildParams, activeFilters, initialPageSize]);

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
  };
};
