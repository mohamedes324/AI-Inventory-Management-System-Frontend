/**
 * @page Suppliers
 * @description Suppliers management page with table, create modal, delete/restore.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Truck, Plus, RefreshCw } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, EmptyState } from "@/shared/components/ui";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getSuppliers } from "../api/getSuppliers";
import { createSupplier } from "../api/createSupplier";
import { deleteSupplier } from "../api/deleteSupplier";
import { restoreSupplier } from "../api/restoreSupplier";

import SupplierTable from "../components/SupplierTable";
import AddSupplierModal from "../components/AddSupplierModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Suppliers() {
  const { t } = useTranslation("suppliers");

  const [suppliers, setSuppliers] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const { execute: fetchSuppliers, loading: fetching } = useRequest(getSuppliers);
  const { execute: execCreate, loading: creating } = useRequest(createSupplier);

  const fetchRef = useRef(fetchSuppliers);
  fetchRef.current = fetchSuppliers;

  const refresh = useCallback(async () => {
    try {
      const data = await fetchRef.current();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch {
      toast.error(t("toasts.fetchError"));
    }
  }, [t]);

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (data) => {
    try {
      await execCreate(data);
      toast.success(t("toasts.createSuccess"));
      setAddOpen(false);
      refresh();
    } catch {
      toast.error(t("toasts.createError"));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      await deleteSupplier(deleteTarget.id);
      toast.success(t("toasts.deleteSuccess"));
      setDeleteTarget(null);
      refresh();
    } catch {
      toast.error(t("toasts.deleteError"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async () => {
    if (!restoreTarget) return;
    setActionLoading(restoreTarget.id);
    try {
      await restoreSupplier(restoreTarget.id);
      toast.success(t("toasts.restoreSuccess"));
      setRestoreTarget(null);
      refresh();
    } catch {
      toast.error(t("toasts.restoreError"));
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
          {suppliers.length > 0 && !fetching && (
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold px-3 py-1.5 rounded-full">
              {t("page.totalCount", { count: suppliers.length })}
            </span>
          )}
          <button
            onClick={refresh}
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
          <SupplierTable
            suppliers={suppliers}
            loading={fetching}
            actionLoading={actionLoading}
            onDelete={setDeleteTarget}
            onRestore={setRestoreTarget}
          />
        )}
      </main>

      {/* ── Modals ── */}
      <AddSupplierModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      />
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={actionLoading === deleteTarget?.id}
        title={t("deleteDialog.title")}
        description={t("deleteDialog.description", { name: deleteTarget?.name })}
        confirmLabel={t("deleteDialog.confirm")}
        variant="danger"
      />
      <ConfirmDialog
        isOpen={Boolean(restoreTarget)}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
        loading={actionLoading === restoreTarget?.id}
        title={t("restoreDialog.title")}
        description={t("restoreDialog.description", { name: restoreTarget?.name })}
        confirmLabel={t("restoreDialog.confirm")}
        variant="restore"
      />
    </Layout>
  );
}
