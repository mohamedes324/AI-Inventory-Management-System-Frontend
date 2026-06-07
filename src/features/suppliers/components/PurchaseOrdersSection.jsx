/**
 * @component PurchaseOrdersSection
 * @description Purchase orders accordion list with pagination for a supplier.
 * Multi-open accordion with paginated API data.
 */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import { Loader, Pagination } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { getSupplierPurchaseOrders } from "../api/getSupplierPurchaseOrders";
import PurchaseOrderCard from "./PurchaseOrderCard";

const PAGE_SIZE = 5;

export default function PurchaseOrdersSection({ supplierId }) {
  const { t } = useTranslation("suppliers");

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, hasNextPage: false, hasPreviousPage: false });
  const [openIndices, setOpenIndices] = useState(new Set());

  const { execute: fetchOrders, loading } = useRequest(getSupplierPurchaseOrders);

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchOrders(supplierId, page, PAGE_SIZE);

      // Handle both array and paginated response shapes
      if (Array.isArray(data)) {
        setOrders(data);
        setPagination({ totalPages: 1, hasNextPage: false, hasPreviousPage: false });
      } else {
        setOrders(data.items || data.data || []);
        setPagination({
          totalPages: data.totalPages ?? 1,
          hasNextPage: data.hasNextPage ?? false,
          hasPreviousPage: data.hasPreviousPage ?? false,
        });
      }
    } catch {
      setOrders([]);
    }
  }, [supplierId, page]);

  useEffect(() => {
    if (supplierId) loadOrders();
  }, [supplierId, page]);

  const handleToggle = (idx) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setOpenIndices(new Set());
  };

  /* ── Loading skeleton ── */
  if (loading && orders.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-background-hover/60 animate-pulse border border-border-primary/30" />
        ))}
      </div>
    );
  }

  /* ── Empty state ── */
  if (!loading && orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={36} className="text-text-muted mx-auto mb-3 opacity-40" />
        <p className="text-sm text-text-muted">{t("purchaseOrders.noOrders")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-500/10 text-secondary-500 flex items-center justify-center shrink-0">
            <ShoppingCart size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{t("purchaseOrders.title")}</h3>
            <p className="text-xs text-text-muted mt-0.5">
              {t("purchaseOrders.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Orders list ── */}
      <div className="space-y-2">
        {orders.map((order, idx) => (
          <PurchaseOrderCard
            key={order.id || idx}
            order={order}
            index={idx}
            isOpen={openIndices.has(idx)}
            onToggle={() => handleToggle(idx)}
          />
        ))}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        onPageChange={handlePageChange}
        className="pt-2"
      />
    </div>
  );
}
