/**
 * @page Suppliers
 * @description Suppliers management page with table, pagination, and create modal.
 * Uses paginated GET /api/Suppliers endpoint with fixed pageSize of 10.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Truck, Plus, RefreshCw, XCircle, Trash2, RotateCcw } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, EmptyState } from "@/shared/components/ui";
import Pagination from "@/shared/components/ui/Pagination";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getSuppliers } from "../api/getSuppliers";
import { createSupplier } from "../api/createSupplier";
import { deleteSupplier } from "../api/deleteSupplier";
import { restoreSupplier } from "../api/restoreSupplier";

import SupplierTable from "../components/SupplierTable";
import AddSupplierModal from "../components/AddSupplierModal";

const PAGE_SIZE = 10;

export default function Suppliers() {
  const { t } = useTranslation("suppliers");

  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const { execute: fetchSuppliers, loading: fetching } = useRequest(getSuppliers);
  const { execute: execCreate, loading: creating } = useRequest(createSupplier);
  const { execute: runDelete } = useRequest(deleteSupplier);
  const { execute: runRestore } = useRequest(restoreSupplier);

  const fetchRef = useRef(fetchSuppliers);
  fetchRef.current = fetchSuppliers;

  const refresh = useCallback(async (page = currentPage) => {
    try {
      const data = await fetchRef.current(page, PAGE_SIZE);
      setSuppliers(data.items || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setHasNextPage(data.hasNextPage || false);
      setHasPreviousPage(data.hasPreviousPage || false);
    } catch {
      toast.error(t("toasts.fetchError"));
    }
  }, [t, currentPage]);

  useEffect(() => {
    refresh(1);
  }, []);

  const handlePageChange = (page) => {
    refresh(page);
  };

  const handleCreate = async (data) => {
    try {
      await execCreate(data);
      toast.success(t("toasts.createSuccess"));
      setAddOpen(false);
      refresh(1);
    } catch {
      toast.error(t("toasts.createError"));
    }
  };

  const openConfirmModal = (supplier, type) => {
    setConfirmModal({ supplier, type });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  const handleConfirmAction = async () => {
    const { supplier, type } = confirmModal;
    const supplierId = supplier.supplierId;

    setActionLoading(supplierId);
    try {
      if (type === "delete") {
        await runDelete(supplierId);
        toast.success(t("toasts.deleteSuccess"));
      } else {
        await runRestore(supplierId);
        toast.success(t("toasts.restoreSuccess"));
      }
      closeConfirmModal();
      refresh(currentPage);
    } catch {
      toast.error(
        type === "delete"
          ? t("toasts.deleteError")
          : t("toasts.restoreError")
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout>
      {/* ── Header ── */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
            <Truck size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">{t("page.title")}</h1>
            <p className="text-text-muted text-sm mt-0.5">{t("page.description")}</p>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto gap-3">
          {totalCount > 0 && !fetching && (
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold px-3 py-1.5 rounded-full">
              {t("page.totalCount", { count: totalCount })}
            </span>
          )}
          <button
            onClick={() => refresh(currentPage)}
            disabled={fetching}
            className="w-9 h-9 shrink-0 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-500 hover:border-primary-300 transition-all duration-200 disabled:opacity-50"
            title={t("page.refresh")}
          >
            <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* ── Actions Bar ── */}
      <div className="px-4 sm:px-8 py-4 flex items-center justify-end animate-fadeIn" style={{ animationDelay: "100ms" }}>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus size={16} />
          <span>{t("page.addSupplier")}</span>
        </Button>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 pb-6">
        {!fetching && suppliers.length === 0 ? (
          <div className="h-full flex items-center justify-center py-24 animate-fadeIn">
            <EmptyState
              icon={<Truck size={36} className="text-text-muted" />}
              message={t("page.noSuppliers")}
              description={t("page.noSuppliersDesc")}
              action={
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  <Plus size={14} className="me-1" />
                  {t("page.addSupplier")}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <SupplierTable
              suppliers={suppliers}
              loading={fetching}
              onAction={openConfirmModal}
              actionLoading={actionLoading}
            />

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      <AddSupplierModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      />

      {/* ── Confirmation Modal ── */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn p-4"
          onClick={closeConfirmModal}
        >
          <div
            className="bg-background-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-text-primary">
                  {confirmModal.type === "delete"
                    ? t("deleteDialog.title")
                    : t("restoreDialog.title")}
                </h3>
                <button
                  onClick={closeConfirmModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-background-hover text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </div>

              <p className="text-sm text-text-secondary mt-1">
                {confirmModal.type === "delete"
                  ? t("deleteDialog.description", { name: confirmModal.supplier.supplierName || confirmModal.supplier.name })
                  : t("restoreDialog.description", { name: confirmModal.supplier.supplierName || confirmModal.supplier.name })}
              </p>

              {/* Supplier info preview */}
              <div className="mt-4 p-3 bg-background-hover/60 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-sm shrink-0 border border-primary-500/25">
                  {(confirmModal.supplier.supplierName || confirmModal.supplier.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">
                    {confirmModal.supplier.supplierName || confirmModal.supplier.name}
                  </p>
                  <p className="text-xs text-text-muted">{confirmModal.supplier.phoneNumber || "—"}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-background-hover/50 border-t border-border-primary flex items-center justify-end gap-3">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading === confirmModal.supplier.supplierId}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                {t("common.cancel")}
              </button>

              {confirmModal.type === "delete" ? (
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading === confirmModal.supplier.supplierId}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-error text-text-inverse hover:bg-error/90 disabled:opacity-50 transition-all shadow-sm shadow-error/20"
                >
                  {actionLoading === confirmModal.supplier.supplierId && <RefreshCw size={14} className="animate-spin" />}
                  <Trash2 size={14} />
                  {t("actions.delete")}
                </button>
              ) : (
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading === confirmModal.supplier.supplierId}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-secondary-500 text-text-inverse hover:bg-secondary-600 disabled:opacity-50 transition-all shadow-sm shadow-secondary-500/20"
                >
                  {actionLoading === confirmModal.supplier.supplierId && <RefreshCw size={14} className="animate-spin" />}
                  <RotateCcw size={14} />
                  {t("actions.restore")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
