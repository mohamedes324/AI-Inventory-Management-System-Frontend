/**
 * @page StockBatchesPage
 * @description Full batch management page at /products/:id/stock-batches.
 * Multi-open accordion with full details, edit/delete modals.
 * This is where all batch CRUD operations happen.
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Boxes, Package } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getProduct } from "../api/getProduct";
import { getStockBatches } from "@/features/stock-batches/api/getStockBatches";
import { updateStockBatch } from "@/features/stock-batches/api/updateStockBatch";
import { deleteStockBatch } from "@/features/stock-batches/api/deleteStockBatch";

import BatchCard from "../components/BatchCard";
import EditBatchModal from "../components/EditBatchModal";
import DeleteBatchDialog from "../components/DeleteBatchDialog";

export default function StockBatchesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("stockBatches");
  const { isInventoryStaff } = usePermissions();
  const canManage = isInventoryStaff;

  const [product, setProduct] = useState(null);
  const [batches, setBatches] = useState([]);
  const [openIndices, setOpenIndices] = useState(new Set());
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { execute: fetchProduct, loading: loadingProduct } = useRequest(getProduct);
  const { execute: fetchBatches, loading: loadingBatches } = useRequest(getStockBatches);
  const { execute: execUpdate, loading: updating } = useRequest(updateStockBatch);
  const { execute: execDelete, loading: deleting } = useRequest(deleteStockBatch);

  const loadData = useCallback(async () => {
    try {
      const [productData, batchData] = await Promise.all([
        fetchProduct(id),
        fetchBatches(id),
      ]);
      setProduct(productData);
      setBatches(Array.isArray(batchData) ? batchData : []);
    } catch {
      toast.error(t("toasts.fetchError"));
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [id]);

  const handleToggle = (idx) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleUpdate = async (batchId, data ) => {
    try {
      await execUpdate(batchId, data);
      toast.success(t("toasts.updateSuccess"));
      setEditTarget(null);
      loadData();
    } catch (err) {
      const serverMessage = err?.message || t("toasts.updateError");
      toast.error(serverMessage);
    }
  };

  const handleDelete = async (batchId) => {
    try {
      await execDelete(batchId);
      toast.success(t("toasts.deleteSuccess"));
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      const serverMessage = err?.message || t("toasts.deleteError");
      toast.error(serverMessage);
    }
  };

  const loading = loadingProduct || loadingBatches;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6 animate-fadeIn">
        {/* ── Back ── */}
        <button
          onClick={() => navigate(`/products/${id}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary-500 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t("backToProduct")}
        </button>

        {/* ── Header ── */}
        <div className="bg-background-card rounded-2xl border border-border-primary shadow-sm p-6 animate-slideUp">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white shadow-lg shadow-secondary-500/25 shrink-0">
              <Boxes size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                {t("pageTitle")}
              </h1>
              {product && (
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Package size={14} className="text-text-muted" />
                  <span className="text-sm text-text-secondary">{product.name}</span>
                  <span className="text-xs font-mono text-text-muted bg-background-hover/60 px-2 py-0.5 rounded border border-border-primary/40">
                    {product.sku}
                  </span>
                  {batches.length > 0 && (
                    <span className="inline-flex items-center gap-1 bg-secondary-500/10 border border-secondary-500/20 text-secondary-500 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {t("count", { count: batches.length })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Batch Accordion ── */}
        <div className="space-y-2.5 animate-slideUp" style={{ animationDelay: "100ms" }}>
          {loading && batches.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-background-hover/50 animate-pulse border border-border-primary/20" />
              ))}
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-16 bg-background-card rounded-2xl border border-border-primary">
              <Boxes size={36} className="text-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-sm text-text-muted">{t("noBatches")}</p>
            </div>
          ) : (
            batches.map((batch, idx) => (
              <BatchCard
                key={batch.id || idx}
                batch={batch}
                index={idx}
                isOpen={openIndices.has(idx)}
                onToggle={() => handleToggle(idx)}
                canManage={canManage}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <EditBatchModal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        loading={updating}
        batch={editTarget}
      />
      <DeleteBatchDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        batch={deleteTarget}
      />
    </Layout>
  );
}
