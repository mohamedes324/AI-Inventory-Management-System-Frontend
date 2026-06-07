/**
 * @page SupplierDetails
 * @description Supplier details page with compact info card and purchase orders accordion.
 * Route: /suppliers/:id
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Truck } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Loader } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getSupplierById } from "../api/getSupplierById";
import SupplierInfoCard from "../components/SupplierInfoCard";
import PurchaseOrdersSection from "../components/PurchaseOrdersSection";

export default function SupplierDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("suppliers");

  const [supplier, setSupplier] = useState(null);

  const { execute: fetchSupplier, loading: loadingSupplier } = useRequest(getSupplierById);

  const loadSupplier = useCallback(async () => {
    try {
      const data = await fetchSupplier(id);
      setSupplier(data);
    } catch {
      toast.error(t("toasts.fetchError"));
    }
  }, [id]);

  useEffect(() => {
    loadSupplier();
  }, [id]);

  // Loading
  if (loadingSupplier && !supplier) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full py-32">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  // Not found
  if (!supplier) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full py-32 animate-fadeIn">
          <Truck size={48} className="text-text-muted mb-4 opacity-40" />
          <p className="text-text-muted text-lg">{t("details.notFound")}</p>
          <button
            onClick={() => navigate("/suppliers")}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors"
          >
            <ArrowLeft size={16} />
            {t("details.backToSuppliers")}
          </button>
        </div>
      </Layout>
    );
  }

  const supplierName = supplier.supplierName || supplier.name || "—";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6 animate-fadeIn">
        {/* ── Back Button ── */}
        <button
          onClick={() => navigate("/suppliers")}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary-500 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t("details.backToSuppliers")}
        </button>

        {/* ── Supplier Header ── */}
        <div className="bg-background-card rounded-2xl border border-border-primary shadow-sm p-6 animate-slideUp">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
              <Truck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                {supplierName}
              </h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {supplier.phoneNumber && (
                  <span className="text-xs font-mono text-text-muted bg-background-hover/60 px-2.5 py-1 rounded-lg border border-border-primary/40">
                    {supplier.phoneNumber}
                  </span>
                )}
                {supplier.address && (
                  <span className="text-xs text-text-secondary">
                    {supplier.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Supplier Information ── */}
        <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
          <SupplierInfoCard supplier={supplier} />
        </div>

        {/* ── Purchase Orders ── */}
        <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
          <PurchaseOrdersSection supplierId={id} />
        </div>
      </div>
    </Layout>
  );
}
