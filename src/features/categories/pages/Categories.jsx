/**
 * @page Categories
 * @description Main categories page with modern card grid layout.
 * Role-based UI: Admin can CRUD, Manager can create + view, others view only.
 * Features scroll-reveal animations, search, and responsive grid.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, FolderOpen, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import { Button, Loader, EmptyState } from "@/shared/components/ui";
import RevealOnScroll from "@/shared/components/RevealOnScroll";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRequest } from "@/shared/hooks/useRequest";
import { toast } from "@/shared/store/toastStore";

import { getCategories } from "../api/getCategories";
import { createCategory } from "../api/createCategory";
import { updateCategory } from "../api/updateCategory";
import { deleteCategory } from "../api/deleteCategory";
import { updateCategoryImage } from "../api/updateCategoryImage";

import CategoryCard from "../components/CategoryCard";
import CategoryModal from "../components/CategoryModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function Categories() {
  const { t } = useTranslation("categories");
  const navigate = useNavigate();
  const { isAdmin, isManager } = usePermissions();

  const canCreate = isAdmin || isManager;
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  // ── State ──
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { execute: fetchCategories, loading: fetching } = useRequest(getCategories);
  const { execute: execCreate, loading: creating } = useRequest(createCategory);
  const { execute: execUpdate, loading: updating } = useRequest(updateCategory);
  const { execute: execDelete, loading: deleting } = useRequest(deleteCategory);
  const { execute: execUpdateImage } = useRequest(updateCategoryImage);

  // ── Stable ref for fetching (avoids infinite useEffect loop) ──
  const fetchRef = useRef(fetchCategories);
  fetchRef.current = fetchCategories;

  const refreshCategories = useCallback(async () => {
    try {
      const data = await fetchRef.current();
      setCategories(data || []);
    } catch {
      toast.error(t("fetchError"));
    }
  }, [t]);

  // ── Fetch ONCE on mount ──
  useEffect(() => {
    refreshCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──
  const handleCreate = async ({ name, image }) => {
    try {
      await execCreate({ name, image });
      toast.success(t("createSuccess"));
      setModalOpen(false);
      refreshCategories();
    } catch {
      toast.error(t("createError"));
    }
  };

  const handleEdit = async ({ name }) => {
    if (!editTarget) return;
    try {
      await execUpdate(editTarget.id, { name });
      toast.success(t("updateSuccess"));
      setEditTarget(null);
      refreshCategories();
    } catch {
      toast.error(t("updateError"));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await execDelete(deleteTarget.id);
      toast.success(t("deleteSuccess"));
      setDeleteTarget(null);
      refreshCategories();
    } catch {
      toast.error(t("deleteError"));
    }
  };

  const handleUpdateImage = async (id, file) => {
    try {
      await execUpdateImage(id, file);
      toast.success(t("imageUpdateSuccess"));
      refreshCategories();
    } catch {
      toast.error(t("imageUpdateError"));
    }
  };

  const handleCardClick = (category) => {
    navigate(`/categories/${category.id}`);
  };

  // ── Filtered categories ──
  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="categories-page">
        {/* ═══════════════════════════════════════════
            Page Header
            ═══════════════════════════════════════════ */}
        <div className="categories-header animate-fadeIn">
          <div className="categories-header__text">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {t("description")}
            </p>
          </div>

          <div className="categories-header__actions">
            {/* Search */}
            <div className="categories-search">
              <Search size={16} className="categories-search__icon" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="categories-search__input"
              />
            </div>

            {/* Add button — Admin & Manager only */}
            {canCreate && (
              <Button
                size="sm"
                onClick={() => setModalOpen(true)}
                className="shrink-0"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{t("addCategory")}</span>
              </Button>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            Content
            ═══════════════════════════════════════════ */}
        {fetching ? (
          <div className="categories-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 sm:h-64 w-full rounded-2xl bg-background-hover/60 animate-pulse border border-border-primary"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FolderOpen size={32} />}
            message={search ? t("noResults") : t("noCategories")}
            description={search ? t("noResultsDesc") : t("noCategoriesDesc")}
          />
        ) : (
          /* ── Category Grid ── */
          <div className="categories-grid">
            {filtered.map((cat, index) => (
              <RevealOnScroll
                key={cat.id}
                direction="up"
                delay={index * 60}
                className="w-full"
              >
                <CategoryCard
                  category={cat}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onEdit={(c) => setEditTarget(c)}
                  onDelete={(c) => setDeleteTarget(c)}
                  onUpdateImage={handleUpdateImage}
                  onClick={handleCardClick}
                />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          Modals
          ═══════════════════════════════════════════ */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      />

      <CategoryModal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        loading={updating}
        category={editTarget}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        categoryName={deleteTarget?.name}
      />
    </Layout>
  );
}
