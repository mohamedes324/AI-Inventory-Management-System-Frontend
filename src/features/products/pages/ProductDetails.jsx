/**
 * @page ProductDetails
 * @description Full-page product details view with info card and stock batches preview.
 * Uses BatchesPreview from stock-batches feature for the batches section.
 * "Manage Inventory" link navigates to /products/:id/stock-batches.
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Package, Pencil, DollarSign, RotateCcw, Trash2 } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, Loader } from "@/shared/components/ui";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getProduct } from "../api/getProduct";
import { updateProduct } from "../api/updateProduct";
import { updateProductPrice } from "../api/updateProductPrice";
import { updateReorderPoint } from "../api/updateReorderPoint";
import { deleteProduct } from "../api/deleteProduct";

import { getStockBatches } from "@/features/stock-batches/api/getStockBatches";
import BatchesPreview from "../components/BatchesPreview";

import ProductStatusBadge from "../components/ProductStatusBadge";
import ProductInfoCard from "../components/ProductInfoCard";
import EditProductModal from "../components/EditProductModal";
import UpdatePriceModal from "../components/UpdatePriceModal";
import UpdateReorderPointModal from "../components/UpdateReorderPointModal";
import DeleteProductDialog from "../components/DeleteProductDialog";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("products");
  const { isInventoryStaff } = usePermissions();
  const canManage = isInventoryStaff;

  // ── State ──
  const [product, setProduct] = useState(null);
  const [batches, setBatches] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ── Requests ──
  const { execute: fetchProduct, loading: loadingProduct } = useRequest(getProduct);
  const { execute: fetchBatches, loading: loadingBatches } = useRequest(getStockBatches);
  const { execute: execUpdate, loading: updating } = useRequest(updateProduct);
  const { execute: execUpdatePrice, loading: updatingPrice } = useRequest(updateProductPrice);
  const { execute: execUpdateReorder, loading: updatingReorder } = useRequest(updateReorderPoint);
  const { execute: execDelete, loading: deleting } = useRequest(deleteProduct);

  const loadProduct = useCallback(async () => {
    try {
      const data = await fetchProduct(id);
      setProduct(data);
    } catch {
      toast.error(t("toasts.fetchError"));
    }
  }, [id]);

  const loadBatches = useCallback(async () => {
    try {
      const data = await fetchBatches(id);
      setBatches(Array.isArray(data) ? data : []);
    } catch {
      setBatches([]);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
    loadBatches();
  }, [id]);

  // ── Handlers ──
  const handleUpdate = async (data) => {
    try {
      await execUpdate(id, data);
      toast.success(t("toasts.updateSuccess"));
      setEditOpen(false);
      loadProduct();
    } catch {
      toast.error(t("toasts.updateError"));
    }
  };

  const handleUpdatePrice = async (price) => {
    try {
      await execUpdatePrice(id, price);
      toast.success(t("toasts.priceSuccess"));
      setPriceOpen(false);
      loadProduct();
    } catch {
      toast.error(t("toasts.priceError"));
    }
  };

  const handleUpdateReorder = async (point) => {
    try {
      await execUpdateReorder(id, point);
      toast.success(t("toasts.reorderSuccess"));
      setReorderOpen(false);
      loadProduct();
    } catch {
      toast.error(t("toasts.reorderError"));
    }
  };

  const handleDelete = async () => {
    try {
      await execDelete(id);
      toast.success(t("toasts.deleteSuccess"));
      navigate("/products");
    } catch {
      toast.error(t("toasts.deleteError"));
    }
  };

  // ── Loading ──
  if (loadingProduct && !product) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full py-32">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full py-32 animate-fadeIn">
          <Package size={48} className="text-text-muted mb-4 opacity-40" />
          <p className="text-text-muted text-lg">{t("details.notFound")}</p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => navigate("/products")}>
            <ArrowLeft size={16} className="me-2" />
            {t("details.backToProducts")}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6 animate-fadeIn">
        {/* ── Back Button ── */}
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary-500 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t("details.backToProducts")}
        </button>

        {/* ── Product Header ── */}
        <div className="bg-background-card rounded-2xl border border-border-primary shadow-sm p-6 animate-slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
                <Package size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-xs font-mono text-text-muted bg-background-hover/60 px-2.5 py-1 rounded-lg border border-border-primary/40">
                    {product.sku}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {product.category?.name}
                  </span>
                  <span className="text-sm font-bold text-primary-500">
                    ${product.sellingPrice?.toFixed(2)}
                  </span>
                  <ProductStatusBadge
                    stockQuantity={product.stockQuantity}
                    reorderPoint={product.reorderPoint}
                  />
                </div>
              </div>
            </div>

            {/* Management actions — InventoryStaff only */}
            {canManage && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditOpen(true)}
                  title={t("actions.edit")}
                  className="w-9 h-9 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-500 hover:border-primary-300 transition-all"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setPriceOpen(true)}
                  title={t("actions.updatePrice")}
                  className="w-9 h-9 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-secondary-500 hover:border-secondary-300 transition-all"
                >
                  <DollarSign size={15} />
                </button>
                <button
                  onClick={() => setReorderOpen(true)}
                  title={t("actions.updateReorder")}
                  className="w-9 h-9 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-warning hover:border-warning/40 transition-all"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => setDeleteOpen(true)}
                  title={t("actions.delete")}
                  className="w-9 h-9 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-error hover:border-error/40 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Info */}
          <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
            <ProductInfoCard product={product} />
          </div>

          {/* Stock Batches Preview — uses new stock-batches feature */}
          <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
            <BatchesPreview
              batches={batches}
              loading={loadingBatches}
              productId={id}
              canManage={canManage}
              onRefresh={loadBatches}
            />
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <EditProductModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        loading={updating}
        product={product}
      />
      <UpdatePriceModal
        isOpen={priceOpen}
        onClose={() => setPriceOpen(false)}
        onSubmit={handleUpdatePrice}
        loading={updatingPrice}
        product={product}
      />
      <UpdateReorderPointModal
        isOpen={reorderOpen}
        onClose={() => setReorderOpen(false)}
        onSubmit={handleUpdateReorder}
        loading={updatingReorder}
        product={product}
      />
      <DeleteProductDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        product={product}
      />
    </Layout>
  );
}
