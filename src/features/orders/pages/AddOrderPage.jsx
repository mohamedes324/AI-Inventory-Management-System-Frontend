/**
 * @page AddOrderPage
 * @description Cashier workflow for creating a new order.
 * Features:
 * - Auto-creates a draft order on mount
 * - Barcode scanner input with quantity*SKU parsing
 * - Add item via POST /api/Orders/{id}/items
 * - RowVersion tracking from every response
 * - Financial summary (subTotal, discountAmount, taxAmount, finalTotal)
 * - Item cards with allocation accordion
 * - Error modal for server errors
 * - Product search with real-time selection
 * - Last Added Product panel
 * - Confirm order modal integration
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ShoppingCart,
  ScanBarcode,
  Package,
  ChevronDown,
  Layers,
  DollarSign,
  Receipt,
  AlertCircle,
  Loader2,
  Search,
  Clock,
  X,
  CheckCircle2,
} from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { createDraftOrder } from "../api/createDraftOrder";
import { getOrderById } from "../api/getOrderById";
import { addOrderItem } from "../api/addOrderItem";
import { updateOrderItem } from "../api/updateOrderItem";
import { deleteOrderItem } from "../api/deleteOrderItem";
import { confirmOrder } from "../api/confirmOrder";
import { searchProducts } from "@/features/products/api/searchProducts";
import { toast } from "@/shared/store/toastStore";
import OrderItemCard from "../components/OrderItemCard";
import ConfirmOrderModal from "../components/ConfirmOrderModal";

/* ─────────── Helpers ─────────── */

function formatCurrency(val) {
  if (val == null) return "$0.00";
  return `$${Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parse scanner input.
 * Format #1: "10*SKU-031" → { sku: "SKU-031", quantity: 10 }
 * Format #2: "SKU-031"    → { sku: "SKU-031", quantity: 1 }
 */
function parseScannerInput(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.includes("*")) {
    const [qtyStr, ...skuParts] = trimmed.split("*");
    const sku = skuParts.join("*").trim();
    const quantity = parseInt(qtyStr, 10);
    if (!sku || isNaN(quantity) || quantity < 1) return null;
    return { sku, quantity };
  }

  return { sku: trimmed, quantity: 1 };
}

/* ─────────── Error Modal ─────────── */

function ErrorModal({ message, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-background-card rounded-2xl border border-border-primary shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ animationDelay: "50ms" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center shrink-0">
            <AlertCircle size={22} className="text-error" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">
            Error
          </h3>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-6 whitespace-pre-wrap">
          {message}
        </p>

        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AddOrderPage() {
  const { t } = useTranslation("orders");
  const navigate = useNavigate();
  const location = useLocation();
  const draftOrderIdFromState = location.state?.draftOrderId;
  const scannerRef = useRef(null);

  // ── Draft state ──
  const [orderId, setOrderId] = useState(null);
  const [rowVersion, setRowVersion] = useState(null);
  const [order, setOrder] = useState(null);
  const [initError, setInitError] = useState(null);

  // ── Scanner state ──
  const [scannerValue, setScannerValue] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  // ── Search & UI state ──
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [errorModal, setErrorModal] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [lastAddedLocalQty, setLastAddedLocalQty] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchingProducts, setSearchingProducts] = useState(false);

  // ── Hooks ──
  const { execute: execCreateDraft, loading: creatingDraft } = useRequest(createDraftOrder);
  const { execute: execGetOrder, loading: loadingOrder } = useRequest(getOrderById);
  const { execute: execAddItem } = useRequest(addOrderItem);
  const { execute: execUpdateItem } = useRequest(updateOrderItem);
  const { execute: execDeleteItem } = useRequest(deleteOrderItem);
  const { execute: execConfirmOrder } = useRequest(confirmOrder);

  // ── Create or load draft on mount ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (draftOrderIdFromState) {
          // Flow B: Load existing draft order
          const draft = await execGetOrder(draftOrderIdFromState);
          if (cancelled) return;
          setOrderId(draft.orderId ?? draft.id);
          setRowVersion(draft.rowVersion);
          setOrder(draft);
          // Set lastAddedItem if items exist
          if (draft.items && draft.items.length > 0) {
            setLastAddedItem(draft.items[draft.items.length - 1]);
          }
          // Focus scanner after order loaded
          setTimeout(() => scannerRef.current?.focus(), 100);
        } else {
          // Flow A: Create brand new draft order
          const draft = await execCreateDraft();
          if (cancelled) return;
          setOrderId(draft.orderId ?? draft.id);
          setRowVersion(draft.rowVersion);
          setOrder(draft);
          // Focus scanner after draft created
          setTimeout(() => scannerRef.current?.focus(), 100);
        }
      } catch (err) {
        if (!cancelled) {
          setInitError(err?.message || (draftOrderIdFromState ? "Failed to load draft order" : t("addOrder.draftError")));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftOrderIdFromState]);

  // ── Sync lastAddedLocalQty ──
  useEffect(() => {
    if (lastAddedItem) {
      setLastAddedLocalQty(lastAddedItem.quantity ?? 1);
    }
  }, [lastAddedItem]);

  // ── Debounced product search ──
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchingProducts(true);
      try {
        const res = await searchProducts(searchTerm.trim());
        setSearchResults(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchingProducts(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Toggle allocation accordion ──
  const toggleItem = useCallback((itemKey) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  }, []);

  // ── Handle scanner submit ──
  const handleScannerSubmit = async (e) => {
    e.preventDefault();
    if (!orderId || addingItem) return;

    const parsed = parseScannerInput(scannerValue);
    if (!parsed) {
      setErrorModal(t("addOrder.invalidFormat"));
      setScannerValue("");
      scannerRef.current?.focus();
      return;
    }

    setAddingItem(true);
    try {
      const updatedOrder = await execAddItem(orderId, {
        sku: parsed.sku,
        quantity: parsed.quantity,
      });

      // Update rowVersion from response
      if (updatedOrder.rowVersion) {
        setRowVersion(updatedOrder.rowVersion);
      }

      // Track last added item
      const oldItems = order?.items || [];
      const newItems = updatedOrder.items || [];
      let lastItem = null;
      for (const item of newItems) {
        const oldItem = oldItems.find((o) => o.productId === item.productId);
        if (!oldItem || oldItem.quantity !== item.quantity) {
          lastItem = item;
          break;
        }
      }
      if (!lastItem && newItems.length > 0) {
        lastItem = newItems[newItems.length - 1];
      }
      if (lastItem) setLastAddedItem(lastItem);

      // Update order state
      setOrder(updatedOrder);
      setScannerValue("");
    } catch (err) {
      setErrorModal(err?.message || t("addOrder.addItemError"));
      setScannerValue("");
    } finally {
      setAddingItem(false);
      setTimeout(() => scannerRef.current?.focus(), 50);
    }
  };

  // ── Handle manual quantity change from card ──
  const handleQuantityChange = async (productId, newQty) => {
    if (!orderId) return;
    try {
      const updatedOrder = await execUpdateItem(orderId, productId, { quantity: newQty });
      if (updatedOrder.rowVersion) {
        setRowVersion(updatedOrder.rowVersion);
      }

      // Track last added item
      const oldItems = order?.items || [];
      const newItems = updatedOrder.items || [];
      let lastItem = null;
      for (const item of newItems) {
        const oldItem = oldItems.find((o) => o.productId === item.productId);
        if (!oldItem || oldItem.quantity !== item.quantity) {
          lastItem = item;
          break;
        }
      }
      if (lastItem) setLastAddedItem(lastItem);

      setOrder(updatedOrder);
      toast.success(t("toasts.quantityUpdated") || "Quantity updated successfully");
    } catch (err) {
      setErrorModal(err?.message || t("addOrder.addItemError"));
    } finally {
      setTimeout(() => scannerRef.current?.focus(), 50);
    }
  };

  // ── Delete item from draft ──
  const handleDeleteItem = async (productId) => {
    if (!orderId) return;
    try {
      const updatedOrder = await execDeleteItem(orderId, productId);
      if (updatedOrder.rowVersion) {
        setRowVersion(updatedOrder.rowVersion);
      }

      // If the last added item was deleted, clear lastAddedItem
      if (lastAddedItem && lastAddedItem.productId === productId) {
        setLastAddedItem(null);
      }

      setOrder(updatedOrder);
      toast.success(t("toasts.itemDeleted") || "Item deleted successfully");
    } catch (err) {
      setErrorModal(err?.message || t("addOrder.addItemError"));
    } finally {
      setTimeout(() => scannerRef.current?.focus(), 50);
    }
  };

  // ── Select product from search ──
  const handleSelectProduct = async (product) => {
    if (!orderId || addingItem) return;
    setAddingItem(true);
    try {
      const updatedOrder = await execAddItem(orderId, {
        sku: product.sku,
        quantity: 1,
      });
      if (updatedOrder.rowVersion) {
        setRowVersion(updatedOrder.rowVersion);
      }

      // Track last added item
      const oldItems = order?.items || [];
      const newItems = updatedOrder.items || [];
      let lastItem = null;
      for (const item of newItems) {
        const oldItem = oldItems.find((o) => o.productId === item.productId);
        if (!oldItem || oldItem.quantity !== item.quantity) {
          lastItem = item;
          break;
        }
      }
      if (!lastItem && newItems.length > 0) {
        lastItem = newItems[newItems.length - 1];
      }
      if (lastItem) setLastAddedItem(lastItem);

      setOrder(updatedOrder);
      setSearchTerm("");
      setSearchResults([]);
      toast.success(t("toasts.productAdded") || "Product added to order");
    } catch (err) {
      setErrorModal(err?.message || t("addOrder.addItemError"));
    } finally {
      setAddingItem(false);
      setTimeout(() => scannerRef.current?.focus(), 50);
    }
  };

  // ── Confirm order ──
  const handleConfirmOrder = async ({ paymentMethod, orderType }) => {
    if (!orderId) return;
    setConfirmingOrder(true);
    try {
      await execConfirmOrder(orderId, {
        paymentMethod,
        orderType,
        rowVersion,
      });
      toast.success(t("addOrder.confirmSuccess") || "Order confirmed successfully!");
      setShowConfirmModal(false);
      navigate("/orders");
    } catch (err) {
      setErrorModal(err?.message || t("addOrder.confirmError") || "Failed to confirm order");
    } finally {
      setConfirmingOrder(false);
    }
  };

  // ── Computed values ──
  const items = order?.items || [];
  const subTotal = order?.subTotal ?? 0;
  const discountAmount = order?.discountAmount ?? 0;
  const taxAmount = order?.taxAmount ?? 0;
  const finalTotal = order?.finalTotal ?? 0;
  const isOrderValid = orderId && items.length > 0;

  // ── Loading (creating draft / loading order) ──
  if ((creatingDraft || loadingOrder) && !orderId) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-primary-500" />
            </div>
            <p className="text-sm text-text-muted font-medium">
              {draftOrderIdFromState ? "Loading draft order..." : t("addOrder.creatingDraft")}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Init error ──
  if (initError) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-error" />
          </div>
          <p className="text-sm text-text-muted">{initError}</p>
          <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>
            <ArrowLeft size={16} />
            {t("addOrder.backToOrders")}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full min-h-0">
        {/* ── Header ── */}
        <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-hover border border-border-primary hover:border-border-secondary transition-all duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
                <ShoppingCart size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary tracking-tight">
                  {t("addOrder.title")}
                </h1>
                <p className="text-text-muted text-sm mt-0.5">
                  {t("addOrder.subtitle")}
                  {orderId && (
                    <span className="ml-2 text-xs font-mono text-primary-500">
                      #{orderId}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 sm:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">

              {/* ═══ LEFT SIDE ═══ */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* ── Financial Summary ── */}
                <div
                  className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm animate-fadeIn"
                  style={{ animationDelay: "80ms" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Receipt size={16} className="text-primary-500" />
                    <span className="text-sm font-semibold text-text-secondary">
                      {t("addOrder.financialSummary")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-text-muted font-medium">
                        {t("details.subTotal")}
                      </span>
                      <p className="text-sm font-bold text-text-primary tabular-nums">
                        {formatCurrency(subTotal)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-text-muted font-medium">
                        {t("details.discountAmount")}
                      </span>
                      <p className="text-sm font-bold text-text-primary tabular-nums">
                        {formatCurrency(discountAmount)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-text-muted font-medium">
                        {t("details.taxAmount")}
                      </span>
                      <p className="text-sm font-bold text-text-primary tabular-nums">
                        {formatCurrency(taxAmount)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                        <DollarSign size={12} className="text-primary-500" />
                        {t("details.finalTotal")}
                      </span>
                      <p className="text-lg font-bold text-primary-500 tabular-nums">
                        {formatCurrency(finalTotal)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Scanner Input ── */}
                <div
                  className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm animate-fadeIn"
                  style={{ animationDelay: "150ms" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ScanBarcode size={16} className="text-primary-500" />
                    <span className="text-sm font-semibold text-text-secondary">
                      {t("addOrder.scannerTitle")}
                    </span>
                  </div>

                  <form onSubmit={handleScannerSubmit} className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        ref={scannerRef}
                        type="text"
                        value={scannerValue}
                        onChange={(e) => setScannerValue(e.target.value)}
                        placeholder={t("addOrder.scannerPlaceholder")}
                        disabled={addingItem}
                        autoFocus
                        className="
                          w-full rounded-xl border border-border-primary bg-background-input
                          px-4 py-3 outline-none text-sm text-text-primary font-mono
                          placeholder:text-text-muted/60
                          transition-all duration-200
                          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                          shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      />
                      {addingItem && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 size={16} className="animate-spin text-primary-500" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!scannerValue.trim() || addingItem}
                      className="shrink-0 px-5"
                    >
                      {t("addOrder.addBtn")}
                    </Button>
                  </form>

                  <p className="text-xs text-text-muted mt-2.5">
                    {t("addOrder.scannerHint")}
                  </p>
                </div>

                {/* ── Order Items ── */}
                {items.length > 0 ? (
                  <div className="space-y-3 animate-fadeIn" style={{ animationDelay: "200ms" }}>
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-primary-500" />
                      <span className="text-sm font-semibold text-text-secondary">
                        {t("details.items")} ({items.length})
                      </span>
                    </div>

                    {items.map((item, idx) => (
                      <OrderItemCard
                        key={item.productId ?? item.id ?? idx}
                        item={item}
                        index={idx}
                        expandedItems={expandedItems}
                        onToggle={toggleItem}
                        onQuantityChange={handleQuantityChange}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-16 animate-fadeIn"
                    style={{ animationDelay: "200ms" }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-background-hover/50 border border-border-primary flex items-center justify-center mb-4">
                      <Package size={28} className="text-text-muted" />
                    </div>
                    <p className="text-sm font-medium text-text-muted">
                      {t("addOrder.noItems")}
                    </p>
                    <p className="text-xs text-text-muted/70 mt-1">
                      {t("addOrder.noItemsHint")}
                    </p>
                  </div>
                )}
              </div>

              {/* ═══ RIGHT SIDE ═══ */}
              <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-5">

                {/* ── Search Products Section ── */}
                <div
                  className="bg-background-card rounded-2xl border border-border-primary p-5 shadow-sm animate-fadeIn"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Search size={16} className="text-primary-500" />
                    <span className="text-sm font-semibold text-text-secondary">
                      {t("addOrder.searchProducts")}
                    </span>
                  </div>

                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t("addOrder.searchPlaceholder") || "Search by product name or SKU..."}
                      className="
                        w-full rounded-xl border border-border-primary bg-background-input
                        pl-10 pr-8 py-2.5 outline-none text-xs text-text-primary
                        placeholder:text-text-muted/60
                        transition-all duration-200
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                      "
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                      {searchingProducts ? (
                        <Loader2 size={14} className="animate-spin text-primary-500" />
                      ) : (
                        <Search size={14} />
                      )}
                    </div>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setSearchResults([]);
                          scannerRef.current?.focus();
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-0.5 rounded-full hover:bg-background-hover"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Search Results */}
                  {searchTerm.trim() ? (
                    <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                      {searchingProducts && searchResults.length === 0 ? (
                        <p className="text-xs text-text-muted text-center py-4">
                          {t("addOrder.searching") || "Searching..."}
                        </p>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => handleSelectProduct(prod)}
                            className="w-full text-left p-2.5 rounded-xl border border-border-primary hover:border-primary-500/30 hover:bg-primary-500/[0.02] flex items-center justify-between gap-2 group transition-all duration-200"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-text-primary truncate group-hover:text-primary-500 transition-colors">
                                {prod.name}
                              </p>
                              <p className="text-[10px] text-text-muted font-mono mt-0.5">
                                {prod.sku}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-text-primary">
                                {formatCurrency(prod.sellingPrice)}
                              </p>
                              <p className="text-[9px] text-text-muted mt-0.5">
                                Stock: {prod.stockQuantity}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-text-muted text-center py-4">
                          {t("addOrder.noProductsFound") || "No products found"}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-border-primary/60 rounded-xl">
                      <Search size={20} className="text-text-muted/40 mb-1.5" />
                      <p className="text-[11px] text-text-muted/60 text-center px-4">
                        {t("addOrder.searchHint") || "Search and click a product to add it"}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Last Added Product Panel ── */}
                <div
                  className="bg-background-card rounded-2xl border border-border-primary p-5 shadow-sm animate-fadeIn sticky top-6"
                  style={{ animationDelay: "160ms" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-primary-500" />
                    <span className="text-sm font-semibold text-text-secondary">
                      {t("addOrder.lastAdded")}
                    </span>
                  </div>

                  {lastAddedItem ? (
                    <div className="bg-primary-500/[0.03] border border-primary-500/20 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden animate-fadeIn">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-primary-500/10 rounded-bl-xl flex items-center justify-center text-primary-500">
                        <CheckCircle2 size={14} />
                      </div>

                      <div className="min-w-0 pr-6">
                        <h4 className="text-xs font-bold text-text-primary truncate">
                          {lastAddedItem.productName || `Product #${lastAddedItem.productId}`}
                        </h4>
                        <span className="text-[10px] text-text-muted font-mono bg-background-hover px-1.5 py-0.5 rounded border border-border-primary/50 mt-1 inline-block">
                          ID #{lastAddedItem.productId}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-primary/60">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-text-muted uppercase tracking-wider block">
                            {t("addOrder.qty") || "Qty"}
                          </span>
                          <input
                            type="number"
                            min="1"
                            value={lastAddedLocalQty}
                            onChange={(e) => setLastAddedLocalQty(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const val = parseInt(lastAddedLocalQty, 10);
                                if (!isNaN(val) && val >= 1) {
                                  handleQuantityChange(lastAddedItem.productId, val);
                                  e.target.blur();
                                }
                              }
                            }}
                            className="w-16 h-7 text-center text-xs font-bold text-text-primary bg-background-input border border-border-primary rounded-lg outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-text-muted uppercase tracking-wider block">
                            {t("addOrder.unitPriceLabel") || "Unit Price"}
                          </span>
                          <span className="text-xs font-bold text-text-primary tabular-nums">
                            {formatCurrency(lastAddedItem.unitPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border-primary/60 flex items-center justify-between">
                        <span className="text-[10px] text-text-muted font-medium">
                          {t("details.totalPrice") || "Total"}
                        </span>
                        <span className="text-sm font-extrabold text-primary-500 tabular-nums">
                          {formatCurrency(lastAddedItem.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border-primary/40 rounded-xl">
                      <Package size={24} className="text-text-muted/40 mb-2" />
                      <p className="text-xs text-text-muted/60 text-center">
                        {t("addOrder.lastAddedPlaceholder")}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Confirm Button ── */}
                <div className="animate-fadeIn" style={{ animationDelay: "220ms" }}>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!isOrderValid}
                    onClick={() => setShowConfirmModal(true)}
                    className={`w-full justify-center ${!isOrderValid ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {t("addOrder.confirmOrder")}
                  </Button>
                  <p className="text-[10px] text-text-muted/60 text-center mt-1.5">
                    {t("addOrder.confirmHint")}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Error Modal ── */}
      {errorModal && (
        <ErrorModal
          message={errorModal}
          onClose={() => {
            setErrorModal(null);
            scannerRef.current?.focus();
          }}
        />
      )}

      {/* ── Confirm Order Modal ── */}
      {showConfirmModal && (
        <ConfirmOrderModal
          loading={confirmingOrder}
          onClose={() => {
            setShowConfirmModal(false);
            scannerRef.current?.focus();
          }}
          onConfirm={handleConfirmOrder}
        />
      )}
    </Layout>
  );
}
