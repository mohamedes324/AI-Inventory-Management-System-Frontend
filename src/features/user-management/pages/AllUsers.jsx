import { useEffect, useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getAllUsers } from "@/features/user-management/api/getAllUsers";
import { deleteUser } from "@/features/user-management/api/deleteUser";
import { restoreUser } from "@/features/user-management/api/restoreUser";
import {
  Avatar,
  EmptyState,
  Button,
  ImageModal,
} from "@/shared/components/ui";
import {
  Users,
  Clock,
  RefreshCw,
  IdCard,
  ShieldCheck,
  Search,
  Trash2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "@/shared/store/toastStore";
import Layout from "@/shared/components/Layout";

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATIC_BASE_URL = "https://localhost:5000";
const buildImgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${STATIC_BASE_URL}/${path}`;
};

/** Map backend accountStatus string → i18n key + color token */
const STATUS_MAP = {
  PendingAdminReview:    { key: "statusPendingReview",    color: "amber" },
  PendingIdentityUpload: { key: "statusAwaitingDocuments", color: "blue" },
  Active:                { key: "statusActive",            color: "green" },
  Rejected:              { key: "statusRejected",          color: "red" },
  PendingChangePassword: { key: "statusPendingPassword",   color: "purple" },
  Deleted:               { key: "statusDeleted",           color: "slate" },
};

const STATUS_STYLES = {
  amber:  "bg-amber-50 text-amber-700 border-amber-200",
  blue:   "bg-blue-50  text-blue-700  border-blue-200",
  green:  "bg-secondary-50 text-secondary-700 border-secondary-200",
  red:    "bg-error/8  text-error     border-error/20",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  slate:  "bg-gray-100 text-gray-500 border-gray-200",
};

/** Map backend role string → i18n key */
const ROLE_KEY_MAP = {
  Admin:          "roleAdmin",
  Cashier:        "roleCashier",
  InventoryStaff: "roleInventoryStaff",
  Manager:        "roleManager",
};

/** Format ISO date to readable string */
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
};

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, t }) {
  const mapped = STATUS_MAP[status] || { key: "statusActive", color: "green" };
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
      border ${STATUS_STYLES[mapped.color]}
    `}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {t(`allUsers.${mapped.key}`)}
    </span>
  );
}

// ── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray/5">
      {[40, 24, 28, 28, 20, 24].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-4 bg-gray/10 rounded-lg w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

// ── User Row ─────────────────────────────────────────────────────────────────
function UserRow({ user, idx, t, onPreview, onAction, actionLoading }) {
  const { userId, userName, fullName, identityImgUrl: rawImgUrl, createdAt, accountStatus, roles, isDeleted } = user;
  const identityImgUrl = buildImgUrl(rawImgUrl);
  const role = Array.isArray(roles) ? roles[0] : roles;
  const roleLabel = role ? t(`allUsers.${ROLE_KEY_MAP[role] || "roleCashier"}`) : "—";
  const deleted = isDeleted || accountStatus === "Deleted";

  return (
    <tr
      className={`border-b border-gray/5 hover:bg-primary-50/30 transition-colors duration-200 group animate-fadeIn ${deleted ? "opacity-60" : ""}`}
      style={{ animationDelay: `${(idx ?? 0) * 60}ms` }}
    >
      {/* User */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={userName || fullName} size="md" />
          <div>
            <p className="font-semibold text-gray-dark text-[14px] leading-tight">{fullName || userName}</p>
            <p className="text-xs text-gray/50 mt-0.5">{userName}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-dark bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">
          <ShieldCheck size={13} className="text-primary-500" />
          {roleLabel}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={deleted ? "Deleted" : accountStatus} t={t} />
      </td>

      {/* Joined */}
      <td className="px-5 py-4">
        <span className="flex items-center gap-1.5 text-[13px] text-gray">
          <Clock size={13} className="text-gray/40" />
          {formatDate(createdAt)}
        </span>
      </td>

      {/* Document */}
      <td className="px-5 py-4">
        {identityImgUrl ? (
          <button
            type="button"
            onClick={() => onPreview(user)}
            className="
              inline-flex items-center gap-1.5 text-xs font-medium
              text-primary-600 hover:text-primary-700
              hover:underline
              transition-colors
            "
          >
            {t("allUsers.viewDocument")}
            <IdCard size={12} />
          </button>
        ) : (
          <span className="text-xs text-gray/40 italic">
            {t("allUsers.noDocument")}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        {deleted ? (
          <button
            onClick={() => onAction(user, "restore")}
            disabled={actionLoading === userId}
            className={`
              flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold
              border border-secondary-200 text-secondary-700 bg-secondary-50
              hover:bg-secondary-500 hover:text-white hover:border-secondary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-sm whitespace-nowrap
            `}
          >
            <RotateCcw size={13} />
            {actionLoading === userId
              ? t("allUsers.restoring")
              : t("allUsers.restore")}
          </button>
        ) : (
          <button
            onClick={() => onAction(user, "delete")}
            disabled={actionLoading === userId}
            className={`
              flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold
              border border-error/20 text-error/80 bg-error/5
              hover:bg-error hover:text-white hover:border-error
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-sm whitespace-nowrap
            `}
          >
            <Trash2 size={13} />
            {actionLoading === userId
              ? t("allUsers.deleting")
              : t("allUsers.delete")}
          </button>
        )}
      </td>
    </tr>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AllUsers() {
  const { t } = useTranslation("admin");
  const [users, setUsers]               = useState([]);
  const [previewUser, setPreviewUser]   = useState(null);
  const [searchQuery, setSearchQuery]   = useState("");
  const [refreshKey, setRefreshKey]     = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal state: { user, type: "delete"|"restore" } or null
  const [confirmModal, setConfirmModal] = useState(null);

  const { execute: fetchUsers, loading } = useRequest(getAllUsers);
  const { execute: runDelete }           = useRequest(deleteUser);
  const { execute: runRestore }          = useRequest(restoreUser);

  // ── Fetch users on mount & when refresh is triggered ──
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        // Global interceptor already handled the error toast
      }
    };

    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  // ── Open confirmation modal ──
  const openConfirmModal = (user, type) => {
    setConfirmModal({ user, type });
  };

  const closeConfirmModal = () => {
    setConfirmModal(null);
  };

  // ── Execute action after confirmation ──
  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { user, type } = confirmModal;
    const userId = user.userId;

    setActionLoading(userId);
    try {
      if (type === "delete") {
        await runDelete(userId);
        toast.success(t("allUsers.deleteSuccess"));
      } else {
        await runRestore(userId);
        toast.success(t("allUsers.restoreSuccess"));
      }
      closeConfirmModal();
      handleRefresh();
    } catch {
      toast.error(
        type === "delete"
          ? t("allUsers.deleteError")
          : t("allUsers.restoreError")
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filter by search ──
  const filteredUsers = users.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (user.userName || "").toLowerCase().includes(q) ||
      (user.fullName || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.accountStatus || "").toLowerCase().includes(q)
    );
  });

  const columns = [
    "colUser", "colRole", "colStatus", "colJoined", "colDocument", "colActions",
  ];

  return (
    <Layout>
      {/* ── Top Bar ── */}
      <header className="shrink-0 bg-white border-b border-gray/8 px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-dark tracking-tight">
              {t("allUsers.title")}
            </h1>
            <p className="text-gray/60 text-sm mt-0.5">
              {t("allUsers.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("allUsers.searchPlaceholder")}
              className="w-full sm:w-56 ps-9 pe-3 py-2 rounded-xl border border-gray/15 bg-white text-sm text-gray-dark placeholder:text-gray/40 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all duration-200"
            />
          </div>

          {/* Count badge */}
          {users.length > 0 && !loading && (
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full animate-fadeIn shrink-0">
              {t("allUsers.totalCount", { count: filteredUsers.length })}
            </span>
          )}

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-9 h-9 shrink-0 rounded-xl border border-gray/15 bg-white flex items-center justify-center text-gray hover:text-primary-500 hover:border-primary-300 transition-all duration-200 disabled:opacity-50"
            title={t("allUsers.refresh")}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 py-6">
        {/* Loading skeletons */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray/5 overflow-hidden animate-fadeIn overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-gray/8 bg-gray-light/60">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-5 py-3.5 text-start text-xs font-bold text-gray/50 uppercase tracking-wider">
                      {t(`allUsers.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredUsers.length === 0 && (
          <div className="h-full flex items-center justify-center py-24 animate-fadeIn">
            <EmptyState
              icon={<Users size={36} className="text-gray/40" />}
              message={searchQuery ? t("allUsers.noResults") : t("allUsers.noUsers")}
              description={searchQuery ? t("allUsers.noResultsDesc") : t("allUsers.noUsersDesc")}
              action={
                searchQuery ? (
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                    {t("allUsers.clearSearch")}
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={handleRefresh}>
                    <RefreshCw size={14} className="me-2" />
                    {t("allUsers.refresh")}
                  </Button>
                )
              }
            />
          </div>
        )}

        {/* Table */}
        {!loading && filteredUsers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray/5 overflow-hidden animate-slideUp overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-gray/8 bg-gray-light/60">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-start text-xs font-bold text-gray/60 uppercase tracking-wider"
                    >
                      {t(`allUsers.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    idx={idx}
                    t={t}
                    onPreview={setPreviewUser}
                    onAction={openConfirmModal}
                    actionLoading={actionLoading}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Identity Image Lightbox ── */}
      <ImageModal
        isOpen={!!previewUser}
        src={buildImgUrl(previewUser?.identityImgUrl)}
        alt={previewUser?.userName ?? ""}
        onClose={() => setPreviewUser(null)}
        closeLabel={t("allUsers.closeModal")}
      />

      {/* ── Confirmation Modal ── */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-dark/60 backdrop-blur-sm animate-fadeIn p-4"
          onClick={closeConfirmModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-dark">
                  {confirmModal.type === "delete"
                    ? t("allUsers.deleteModalTitle")
                    : t("allUsers.restoreModalTitle")}
                </h3>
                <button
                  onClick={closeConfirmModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-light text-gray hover:text-error hover:bg-error/10 transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </div>

              <p className="text-sm text-gray mt-1">
                {confirmModal.type === "delete"
                  ? t("allUsers.deleteModalDesc")
                  : t("allUsers.restoreModalDesc")}
              </p>

              {/* User info preview */}
              <div className="mt-4 p-3 bg-gray-light/60 rounded-xl flex items-center gap-3">
                <Avatar name={confirmModal.user.userName || confirmModal.user.fullName} size="md" />
                <div>
                  <p className="font-semibold text-gray-dark text-sm">
                    {confirmModal.user.fullName || confirmModal.user.userName}
                  </p>
                  <p className="text-xs text-gray/50">{confirmModal.user.userName}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-light/50 border-t border-gray/5 flex items-center justify-end gap-3">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading === confirmModal.user.userId}
                className="px-4 py-2 text-sm font-medium text-gray hover:text-gray-dark transition-colors"
              >
                {t("allUsers.cancel")}
              </button>

              {confirmModal.type === "delete" ? (
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading === confirmModal.user.userId}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-error text-white hover:bg-error/90 disabled:opacity-50 transition-all shadow-sm shadow-error/20"
                >
                  {actionLoading === confirmModal.user.userId && <RefreshCw size={14} className="animate-spin" />}
                  <Trash2 size={14} />
                  {t("allUsers.confirmDelete")}
                </button>
              ) : (
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading === confirmModal.user.userId}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-secondary-500 text-white hover:bg-secondary-600 disabled:opacity-50 transition-all shadow-sm shadow-secondary-500/20"
                >
                  {actionLoading === confirmModal.user.userId && <RefreshCw size={14} className="animate-spin" />}
                  <RotateCcw size={14} />
                  {t("allUsers.confirmRestore")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
