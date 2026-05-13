/**
 * @page StockBatchesPage
 * @description Full-page stock batches view for a product.
 * Multi-open accordion with all batch details and real API data.
 * Route: /products/:id/stock-batches
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Boxes, Package } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, Loader } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getStockBatches } from "../api/getStockBatches";
import { getProduct } from "@/features/products/api/getProduct";
import BatchesAccordion from "../components/BatchesAccordion";

export default function StockBatchesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("stockBatches");

  const [product, setProduct] = useState(null);
  const [batches, setBatches] = useState([]);

  const { execute: fetchProduct, loading: loadingProduct } = useRequest(getProduct);
  const { execute: fetchBatches, loading: loadingBatches } = useRequest(getStockBatches);

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

        {/* ── Page Header ── */}
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
                <div className="flex items-center gap-2 mt-1">
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

        {/* ── Batches ── */}
        <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
          <BatchesAccordion batches={batches} loading={loading && batches.length === 0} />
        </div>
      </div>
    </Layout>
  );
}
