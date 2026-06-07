/**
 * @page AddPurchaseOrder
 * @description Full-page form for creating a new purchase order.
 * Features:
 * - Split layout: main area (search + products) | side panel (supplier + rating + note)
 * - Single supplier for the entire order
 * - Inline supplier rating (name + stars + note) — once for the whole order
 * - Validation: qty >= 1, unitCost > 0, no negatives
 * - Full-width, proper scroll handling
 * - "+ Add Product" option in search (InventoryStaff only)
 * - Optional Selling Price field that auto-calls updateProductPrice API
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Send,
  Package,
  CheckCircle2,
  AlertCircle,
  Star,
  MessageSquare,
  Truck,
  Download,
} from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import Select from "@/shared/components/ui/Select";
import { useRequest } from "@/shared/hooks/useRequest";
import { usePermissions } from "@/shared/hooks/usePermissions";

import ProductSearchInput from "@/features/products/components/ProductSearchInput";
import AddProductModal from "@/features/products/components/AddProductModal";
import { createProduct } from "@/features/products/api/createProduct";
import { updateProductPrice } from "@/features/products/api/updateProductPrice";

import PurchaseOrderItemCard from "../components/PurchaseOrderItemCard";
import { useSupplierOptions } from "../hooks/useSupplierOptions";
import { submitPurchaseOrder } from "../api/submitPurchaseOrder";
import { rateSupplier } from "../api/rateSupplier";
import { downloadInvoice } from "../api/downloadInvoice";

export default function AddPurchaseOrder() {
  const { t } = useTranslation("purchaseOrders");
  const navigate = useNavigate();
  const { isInventoryStaff } = usePermissions();

  // ── State ──
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [supplierError, setSupplierError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [downloading, setDownloading] = useState(false);

  // ── Rating state (inline, single for whole order) ──
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingNote, setRatingNote] = useState("");
  const [ratingError, setRatingError] = useState("");

  // ── Add Product Modal state ──
  const [addProductOpen, setAddProductOpen] = useState(false);

  // ── Hooks ──
  const { suppliers, loading: suppliersLoading } = useSupplierOptions();
  const { execute: execSubmit, loading: submitting } = useRequest(submitPurchaseOrder);
  const { execute: execRate, loading: ratingLoading } = useRequest(rateSupplier);
  const { execute: execCreateProduct, loading: creatingProduct } = useRequest(createProduct);
  const { execute: execUpdatePrice } = useRequest(updateProductPrice);

  // ── Computed ──
  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const supplierName = selectedSupplier?.name || "";

  // ── Add product from search ──
  const handleProductSelect = useCallback(
    (product) => {
      if (items.some((item) => item.productId === product.id)) return;
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: "",
          unitCost: "",
          sellingPrice: product.sellingPrice,
          expiryDate: "",
          discountPercentage: "",
        },
      ]);
      setSubmitError("");
    },
    [items]
  );

  // ── Handle new product creation from modal ──
  const handleCreateProduct = async (formData) => {
    try {
      const created = await execCreateProduct(formData);
      setAddProductOpen(false);
      // Immediately add the new product to the order items
      if (created && created.id) {
        handleProductSelect({
          id: created.id,
          name: created.name || formData.name,
          sku: created.sku || formData.sku,
        });
      }
    } catch {
      // Error handled by useRequest
    }
  };

  // ── Update item ──
  const handleItemChange = useCallback((index, updatedItem) => {
    setItems((prev) => prev.map((item, i) => (i === index ? updatedItem : item)));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }, []);

  // ── Remove item ──
  const handleItemRemove = useCallback((index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }, []);

  // ── Validate ──
  const validate = useCallback(() => {
    const newErrors = {};
    let valid = true;

    if (!supplierId) {
      setSupplierError(t("addOrder.supplierRequired"));
      valid = false;
    } else {
      setSupplierError("");
    }

    if (items.length === 0) {
      setSubmitError(t("addOrder.noItemsError"));
      return false;
    }

    items.forEach((item, index) => {
      const itemErrors = {};
      if (!item.quantity || Number(item.quantity) < 1) {
        itemErrors.quantity = t("addOrder.quantityRequired");
        valid = false;
      }
      if (!item.unitCost || Number(item.unitCost) <= 0) {
        itemErrors.unitCost = t("addOrder.unitCostRequired");
        valid = false;
      }
      if (!item.expiryDate) {
        itemErrors.expiryDate = t("addOrder.expiryDateRequired");
        valid = false;
      }
      if (Object.keys(itemErrors).length > 0) {
        newErrors[index] = itemErrors;
      }
    });

    if (rating === 0) {
      setRatingError(t("addOrder.ratingRequired"));
      valid = false;
    } else {
      setRatingError("");
    }

    setErrors(newErrors);
    setSubmitError(valid ? "" : t("addOrder.validationError"));
    return valid;
  }, [items, supplierId, rating, t]);

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      // Rate supplier first
      await execRate(supplierId, { rating, note: ratingNote.trim() || null });

      // Update selling prices for items that have one
      const priceUpdatePromises = items
        .filter((item) => item.sellingPrice && Number(item.sellingPrice) > 0)
        .map((item) => execUpdatePrice(item.productId, Number(item.sellingPrice)));

      if (priceUpdatePromises.length > 0) {
        await Promise.allSettled(priceUpdatePromises);
      }

      // Submit the purchase order
      const payload = {
        supplierId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost),
          expiryDate: item.expiryDate,
          discountPercentage: item.discountPercentage !== "" && item.discountPercentage != null
            ? Number(item.discountPercentage)
            : 0,
        })),
      };
      const result = await execSubmit(payload);
      setCreatedOrderId(result?.id || result?.purchaseOrderId || null);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err?.message || t("addOrder.submitFailed"));
    }
  };

  // ── Computed values ──
  const grandTotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const cost = Number(item.unitCost) || 0;
    return sum + qty * cost;
  }, 0);

  const isFormValid =
    supplierId &&
    rating > 0 &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.quantity &&
        Number(item.quantity) >= 1 &&
        item.unitCost &&
        Number(item.unitCost) > 0 &&
        item.expiryDate
    );

  const ratingLabels = [
    t("addOrder.ratingPoor"),
    t("addOrder.ratingFair"),
    t("addOrder.ratingGood"),
    t("addOrder.ratingVeryGood"),
    t("addOrder.ratingExcellent"),
  ];

  // ── Countdown timer for success page ──
  useEffect(() => {
    if (!submitSuccess) return;
    if (countdown <= 0) {
      navigate("/purchases");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [submitSuccess, countdown, navigate]);

  // ── Download Invoice handler ──
  const handleDownloadInvoice = async () => {
    if (!createdOrderId) return;
    setDownloading(true);
    try {
      const blob = await downloadInvoice(createdOrderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${createdOrderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Silently fail — user can try again
    } finally {
      setDownloading(false);
    }
  };

  // ── Success state ──
  if (submitSuccess) {
    const progress = (countdown / 10) * 100;
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8 animate-fadeIn">
          <div className="text-center space-y-6 max-w-md">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-primary-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text-primary">
                {t("addOrder.successTitle")}
              </h2>
              <p className="text-text-muted text-sm max-w-sm mx-auto">
                {t("addOrder.successDesc")}
              </p>
            </div>

            {/* Download Invoice Button */}
            {createdOrderId && (
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-gradient-to-r from-primary-500 to-primary-600
                  text-white text-sm font-semibold
                  shadow-lg shadow-primary-500/25
                  hover:shadow-xl hover:shadow-primary-500/30 hover:scale-[1.02]
                  active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                "
              >
                <Download size={16} className={downloading ? "animate-bounce" : ""} />
                {downloading ? t("addOrder.downloading") : t("addOrder.downloadInvoice")}
              </button>
            )}

            {/* Countdown */}
            <div className="space-y-2">
              <p className="text-xs text-text-muted">
                {t("addOrder.redirectIn", { seconds: countdown })}
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-xs mx-auto h-1.5 bg-background-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
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
              onClick={() => navigate("/purchases")}
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
                  {t("addOrder.description")}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 sm:px-8 py-6">
            {/* ── Split Layout: Main + Side ── */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* ═══ MAIN AREA (search + products) ═══ */}
              <div className="flex-1 min-w-0 space-y-5">
                {/* ── Product Search ── */}
                <div
                  className="bg-background-card rounded-2xl border border-border-primary p-5 sm:p-6 shadow-sm animate-fadeIn"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Plus size={16} className="text-primary-500" />
                    <span className="text-sm font-semibold text-text-secondary">
                      {t("addOrder.searchProducts")}
                    </span>
                  </div>
                  <ProductSearchInput
                    onSelect={handleProductSelect}
                    showAddProduct={isInventoryStaff}
                    onAddProduct={() => setAddProductOpen(true)}
                  />
                  <p className="text-xs text-text-muted mt-2.5">
                    {t("addOrder.searchHint")}
                  </p>
                </div>

                {/* ── Items List ── */}
                {items.length > 0 && (
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between animate-fadeIn"
                      style={{ animationDelay: "150ms" }}
                    >
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-primary-500" />
                        <span className="text-sm font-semibold text-text-secondary">
                          {t("addOrder.orderItems")} ({items.length})
                        </span>
                      </div>
                      {grandTotal > 0 && (
                        <div className="flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-xl">
                          <span className="text-xs font-medium text-text-muted">
                            {t("addOrder.grandTotal")}
                          </span>
                          <span className="text-sm font-bold text-primary-500 tabular-nums">
                            $
                            {grandTotal.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {items.map((item, idx) => (
                      <PurchaseOrderItemCard
                        key={item.productId}
                        item={item}
                        index={idx}
                        onChange={handleItemChange}
                        onRemove={handleItemRemove}
                        errors={errors[idx] || {}}
                      />
                    ))}
                  </div>
                )}

                {/* ── Empty state ── */}
                {items.length === 0 && (
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

                {/* ── Error Banner ── */}
                {submitError && (
                  <div className="flex items-center gap-3 bg-error/10 border border-error/20 rounded-xl px-4 py-3 animate-fadeIn">
                    <AlertCircle size={18} className="text-error shrink-0" />
                    <span className="text-sm font-medium text-error">{submitError}</span>
                  </div>
                )}

                {/* ── Submit Bar ── */}
                {items.length > 0 && (
                  <div
                    className="flex items-center justify-end gap-3 pt-2 pb-4 animate-fadeIn"
                    style={{ animationDelay: "300ms" }}
                  >
                    <Button variant="ghost" size="sm" onClick={() => navigate("/purchases")}>
                      {t("addOrder.cancel")}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!isFormValid}
                      loading={submitting || ratingLoading}
                    >
                      <Send size={16} />
                      {t("addOrder.confirm")}
                    </Button>
                  </div>
                )}
              </div>

              {/* ═══ SIDE PANEL (supplier + rating + note) ═══ */}
              <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-5">
                {/* ── Supplier Selection ── */}
                <div
                  className="bg-background-card rounded-2xl border border-border-primary p-5 shadow-sm animate-fadeIn sticky top-6"
                  style={{ animationDelay: "80ms" }}
                >
                  {/* Supplier Dropdown */}
                  <div className="flex items-center gap-2 mb-4">
                    <Truck size={16} className="text-primary-500" />
                    <span className="text-sm font-semibold text-text-secondary">
                      {t("addOrder.supplier")}
                    </span>
                  </div>

                  <Select
                    placeholder={
                      suppliersLoading
                        ? t("addOrder.loadingSuppliers")
                        : t("addOrder.selectSupplier")
                    }
                    options={suppliers.map((s) => s.id)}
                    value={supplierId}
                    onChange={(val) => {
                      setSupplierId(val);
                      setSupplierError("");
                    }}
                    getLabel={(id) => {
                      const s = suppliers.find((sup) => sup.id === id);
                      return s?.name || id;
                    }}
                    error={supplierError}
                    status={supplierError ? "error" : "default"}
                  />

                  {/* ── Rating Section ── */}
                  {supplierId && (
                    <div className="mt-4 pt-4 border-t border-border-primary/40 animate-fadeIn">
                      {/* Supplier name badge */}
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-primary-600/5 border border-primary-500/20 rounded-xl px-3 py-2 mb-4">
                        <Truck size={14} className="text-primary-500" />
                        <span className="text-xs font-bold text-text-primary truncate max-w-[180px]">
                          {supplierName}
                        </span>
                      </div>

                      {/* Rating label */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <Star size={14} className="text-warning" />
                        <span className="text-xs font-semibold text-text-secondary">
                          {t("addOrder.ratingLabel")}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starIndex = i + 1;
                          const isActive = starIndex <= (hoveredStar || rating);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setRating(starIndex);
                                setRatingError("");
                              }}
                              onMouseEnter={() => setHoveredStar(starIndex)}
                              onMouseLeave={() => setHoveredStar(0)}
                              className={`
                                w-9 h-9 rounded-lg flex items-center justify-center
                                transition-all duration-200 transform
                                ${
                                  isActive
                                    ? "bg-warning/15 border border-warning/30 scale-110"
                                    : "bg-background-hover border border-border-primary hover:border-warning/20 hover:scale-105"
                                }
                              `}
                            >
                              <Star
                                size={18}
                                className={`transition-colors duration-200 ${
                                  isActive
                                    ? "fill-warning text-warning"
                                    : "fill-none text-text-muted"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Rating label text */}
                      <div className="h-5 mb-1">
                        {(hoveredStar || rating) > 0 && (
                          <span className="text-xs font-semibold text-warning animate-fadeIn">
                            {ratingLabels[(hoveredStar || rating) - 1]}
                          </span>
                        )}
                      </div>

                      {/* Rating error */}
                      {ratingError && (
                        <p className="text-[11px] text-error font-medium mb-2 animate-fadeIn">
                          {ratingError}
                        </p>
                      )}

                      {/* Note */}
                      <div className="mt-3">
                        <label className="text-xs font-semibold text-text-secondary tracking-tight flex items-center gap-1.5 mb-1.5">
                          <MessageSquare size={12} />
                          {t("addOrder.ratingNote")}
                        </label>
                        <textarea
                          value={ratingNote}
                          onChange={(e) => setRatingNote(e.target.value)}
                          placeholder={t("addOrder.ratingNotePlaceholder")}
                          rows={3}
                          className="
                            w-full rounded-xl border border-border-primary bg-background-input
                            px-3 py-2.5 outline-none text-sm text-text-primary
                            placeholder:text-text-muted/60 resize-none
                            transition-all duration-200
                            focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
                            shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]
                          "
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Product Modal (reused from Products page) ── */}
      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onSubmit={handleCreateProduct}
        loading={creatingProduct}
      />
    </Layout>
  );
}
