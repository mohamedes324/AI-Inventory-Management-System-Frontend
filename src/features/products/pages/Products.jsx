/**
 * @page Products
 * @description Main products listing page with live search, table, and CRUD modals.
 * Role-based: InventoryStaff can manage, Manager/Cashier can only view.
 * Search updates the table dynamically via the API.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package, Plus, RefreshCw } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { Button, EmptyState } from "@/shared/components/ui";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getProducts } from "../api/getProducts";
import { createProduct } from "../api/createProduct";
import { updateProduct } from "../api/updateProduct";
import { updateProductPrice } from "../api/updateProductPrice";
import { updateReorderPoint } from "../api/updateReorderPoint";
import { deleteProduct } from "../api/deleteProduct";

import ProductSearchInput from "../components/ProductSearchInput";
import ProductTable from "../components/ProductTable";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import UpdatePriceModal from "../components/UpdatePriceModal";
import UpdateReorderPointModal from "../components/UpdateReorderPointModal";
import DeleteProductDialog from "../components/DeleteProductDialog";

export default function Products() {
  const { t } = useTranslation("products");
  const navigate = useNavigate();
  const { isInventoryStaff } = usePermissions();
  const canManage = isInventoryStaff;

  // ── State ──
  const [allProducts, setAllProducts] = useState([]);   // original full list
  const [displayProducts, setDisplayProducts] = useState([]); // what the table shows
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [priceTarget, setPriceTarget] = useState(null);
  const [reorderTarget, setReorderTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Requests ──
  const { execute: fetchProducts, loading: fetching } = useRequest(getProducts);
  const { execute: execCreate, loading: creating } = useRequest(createProduct);
  const { execute: execUpdate, loading: updating } = useRequest(updateProduct);
  const { execute: execUpdatePrice, loading: updatingPrice } = useRequest(updateProductPrice);
  const { execute: execUpdateReorder, loading: updatingReorder } = useRequest(updateReorderPoint);
  const { execute: execDelete, loading: deleting } = useRequest(deleteProduct);

  const fetchRef = useRef(fetchProducts);
  fetchRef.current = fetchProducts;

  const refreshProducts = useCallback(async () => {
    try {
      const data = await fetchRef.current();
      const list = Array.isArray(data) ? data : [];
      setAllProducts(list);
      setDisplayProducts(list);
      setIsSearchActive(false);
    } catch {
      toast.error(t("toasts.fetchError"));
    }
  }, [t]);

  useEffect(() => {
    refreshProducts();
  }, []);

  // ── Search Callbacks ──
  const handleSearchResults = useCallback((results) => {
    setDisplayProducts(results);
    setIsSearchActive(true);
  }, []);

  const handleSearchClear = useCallback(() => {
    setDisplayProducts(allProducts);
    setIsSearchActive(false);
  }, [allProducts]);

  // ── CRUD Handlers ──
  const handleCreate = async (data) => {
    try {
      await execCreate(data);
      toast.success(t("toasts.createSuccess"));
      setAddOpen(false);
      refreshProducts();
    } catch {
      toast.error(t("toasts.createError"));
    }
  };

  const handleUpdate = async (data) => {
    if (!editTarget) return;
    try {
      await execUpdate(editTarget.id, data);
      toast.success(t("toasts.updateSuccess"));
      setEditTarget(null);
      refreshProducts();
    } catch {
      toast.error(t("toasts.updateError"));
    }
  };

  const handleUpdatePrice = async (price) => {
    if (!priceTarget) return;
    try {
      await execUpdatePrice(priceTarget.id, price);
      toast.success(t("toasts.priceSuccess"));
      setPriceTarget(null);
      refreshProducts();
    } catch {
      toast.error(t("toasts.priceError"));
    }
  };

  const handleUpdateReorder = async (point) => {
    if (!reorderTarget) return;
    try {
      await execUpdateReorder(reorderTarget.id, point);
      toast.success(t("toasts.reorderSuccess"));
      setReorderTarget(null);
      refreshProducts();
    } catch {
      toast.error(t("toasts.reorderError"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await execDelete(id);
      toast.success(t("toasts.deleteSuccess"));
      setDeleteTarget(null);
      refreshProducts();
    } catch {
      toast.error(t("toasts.deleteError"));
    }
  };

  const handleSearchSelect = (product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Layout>
      {/* ── Header ── */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
            <Package size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              {t("page.title")}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">
              {t("page.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto gap-3">
          {/* Product count */}
          {displayProducts.length > 0 && !fetching && (
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold px-3 py-1.5 rounded-full">
              {isSearchActive
                ? t("page.searchCount", { count: displayProducts.length })
                : t("page.totalCount", { count: displayProducts.length })
              }
            </span>
          )}

          {/* Refresh */}
          <button
            onClick={refreshProducts}
            disabled={fetching}
            className="w-9 h-9 shrink-0 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-500 hover:border-primary-300 transition-all duration-200 disabled:opacity-50"
            title={t("page.refresh")}
          >
            <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* ── Actions Bar ── */}
      <div className="px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fadeIn" style={{ animationDelay: "100ms" }}>
        <ProductSearchInput
          onSelect={handleSearchSelect}
          onResults={handleSearchResults}
          onClear={handleSearchClear}
          className="flex-1 max-w-md"
        />

        {canManage && (
          <Button size="sm" onClick={() => setAddOpen(true)} className="shrink-0">
            <Plus size={16} />
            <span>{t("page.addProduct")}</span>
          </Button>
        )}
      </div>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 pb-6">
        {!fetching && displayProducts.length === 0 ? (
          <div className="h-full flex items-center justify-center py-24 animate-fadeIn">
            <EmptyState
              icon={<Package size={36} className="text-text-muted" />}
              message={isSearchActive ? t("page.noSearchResults") : t("page.noProducts")}
              description={isSearchActive ? t("page.noSearchResultsDesc") : t("page.noProductsDesc")}
              action={
                isSearchActive ? null : (
                  canManage ? (
                    <Button size="sm" onClick={() => setAddOpen(true)}>
                      <Plus size={14} className="me-1" />
                      {t("page.addProduct")}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={refreshProducts}>
                      <RefreshCw size={14} className="me-2" />
                      {t("page.refresh")}
                    </Button>
                  )
                )
              }
            />
          </div>
        ) : (
          <ProductTable
            products={displayProducts}
            loading={fetching}
            canManage={canManage}
            onEdit={setEditTarget}
            onUpdatePrice={setPriceTarget}
            onUpdateReorder={setReorderTarget}
            onDelete={setDeleteTarget}
          />
        )}
      </main>

      {/* ── Modals ── */}
      <AddProductModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      />
      <EditProductModal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        loading={updating}
        product={editTarget}
      />
      <UpdatePriceModal
        isOpen={Boolean(priceTarget)}
        onClose={() => setPriceTarget(null)}
        onSubmit={handleUpdatePrice}
        loading={updatingPrice}
        product={priceTarget}
      />
      <UpdateReorderPointModal
        isOpen={Boolean(reorderTarget)}
        onClose={() => setReorderTarget(null)}
        onSubmit={handleUpdateReorder}
        loading={updatingReorder}
        product={reorderTarget}
      />
      <DeleteProductDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        product={deleteTarget}
      />
    </Layout>
  );
}
