import { useEffect, useState, useCallback } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getPendingUsers } from "@/features/user-management/api/getPendingUsers";
import { approveUser } from "@/features/user-management/api/approveUser";
import { rejectUser } from "@/features/user-management/api/rejectUser";
import {
  Avatar,
  EmptyState,
  Button,
  Loader,
  ImageModal,
} from "@/shared/components/ui";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "@/shared/store/toastStore";
import Layout from "@/shared/components/Layout";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Backend serves static uploads from the origin (no /api prefix).
 * identityImgUrl arrives as a relative path, e.g. "uploads/user-identities/…"
 */
const STATIC_BASE_URL = "https://localhost:5000";
const buildImgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path; // already absolute
  return `${STATIC_BASE_URL}/${path}`;
};


/** Map backend accountStatus string → i18n key + color token */
const STATUS_MAP = {
  PendingAdminReview:    { key: "statusPendingAdminReview",    color: "amber" },
  PendingIdentityUpload: { key: "statusPendingIdentityUpload", color: "blue" },
  Active:                { key: "statusActive",                 color: "green" },
  Rejected:              { key: "statusRejected",               color: "red" },
};

const STATUS_STYLES = {
  amber: "bg-warning-bg text-warning-text border-warning-border",
  blue:  "bg-info-bg text-info-text border-info-border",
  green: "bg-success-bg text-success-text border-success-border",
  red:   "bg-error-bg text-error-text border-error-border",
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

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, t }) {
  const mapped = STATUS_MAP[status] || { key: "statusPendingAdminReview", color: "amber" };
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
      border ${STATUS_STYLES[mapped.color]}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      {t(`pendingAccounts.${mapped.key}`)}
    </span>
  );
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-border-primary/30">
      {[40, 28, 24, 28, 20, 36].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-4 bg-background-hover rounded-lg w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

// ── ID Photo Thumbnail ────────────────────────────────────────────────────────
/**
 * Square thumbnail for identity documents.
 * Shows the actual photo when available, falls back to initials avatar.
 * Clicking it when a photo exists opens the lightbox.
 */
function IdPhotoThumbnail({ src, name, onClick, t }) {
  if (!src) {
    return (
      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0">
        <Avatar name={name} size="md" className="!rounded-lg w-full h-full" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={t("pendingAccounts.viewIdPhoto")}
      className="
        relative w-11 h-11 rounded-lg overflow-hidden shrink-0
        ring-2 ring-primary-100 hover:ring-primary-400
        transition-all duration-200
        hover:scale-110
        focus:outline-none focus:ring-primary-500
        group/thumb
        shadow-sm
      "
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        draggable="false"
      />
      {/* Subtle hover overlay with zoom icon */}
      <span className="
        absolute inset-0
        flex items-center justify-center
        bg-primary-900/40
        opacity-0 group-hover/thumb:opacity-100
        transition-opacity duration-200
      ">
        <IdCard size={16} className="text-white drop-shadow" />
      </span>
    </button>
  );
}

// ── User Row ──────────────────────────────────────────────────────────────────
function UserRow({ user, idx, t, onApprove, onReject, actionLoading, onPreview }) {
  const { userId, userName, identityImgUrl: rawImgUrl, createdAt, accountStatus, roles } = user;
  const identityImgUrl = buildImgUrl(rawImgUrl);
  const role = Array.isArray(roles) ? roles[0] : roles;
  const roleLabel = role ? t(`pendingAccounts.${ROLE_KEY_MAP[role] || "roleCashier"}`) : "—";

  return (
    <tr
      className="border-b border-border-primary/30 hover:bg-primary-500/5 transition-colors duration-200 group animate-fadeIn"
      style={{ animationDelay: `${(idx ?? 0) * 60}ms` }}
    >
      {/* User */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={userName} size="md" />
          <div>
            <p className="font-semibold text-text-primary text-[14px] leading-tight">{userName}</p>
            <p className="text-xs text-text-muted mt-0.5 font-mono">{userId?.slice(0, 8)}…</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-400 bg-primary-500/10 px-3 py-1 rounded-lg border border-primary-500/20">
          <ShieldCheck size={13} className="text-primary-500" />
          {roleLabel}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={accountStatus} t={t} />
      </td>

      {/* Joined */}
      <td className="px-5 py-4">
        <span className="flex items-center gap-1.5 text-[13px] text-text-secondary">
          <Clock size={13} className="text-text-muted" />
          {formatDate(createdAt)}
        </span>
      </td>

      {/* Document — inline lightbox trigger */}
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
            {t("pendingAccounts.viewDocument")}
            <IdCard size={12} />
          </button>
        ) : (
          <span className="text-xs text-text-muted italic">
            {t("pendingAccounts.noDocument")}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={() => onApprove(userId)}
            disabled={actionLoading === userId}
            className={`
              flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold
              border border-secondary-200 text-secondary-700 bg-secondary-50
              hover:bg-secondary-500 hover:text-white hover:border-secondary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-sm whitespace-nowrap
            `}
          >
            <CheckCircle2 size={13} />
            {actionLoading === userId
              ? t("pendingAccounts.approving")
              : t("pendingAccounts.approve")}
          </button>

          <button
            onClick={() => onReject(user)}
            disabled={actionLoading === userId}
            className={`
              flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold
              border border-error/20 text-error/80 bg-error/5
              hover:bg-error hover:text-white hover:border-error
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-sm whitespace-nowrap
            `}
          >
            <XCircle size={13} />
            {actionLoading === userId
              ? t("pendingAccounts.rejecting")
              : t("pendingAccounts.reject")}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PendingAccounts() {
  const { t } = useTranslation("admin");
  const [users, setUsers]                     = useState([]);
  const [actionLoading, setActionLoading]     = useState(null); // userId being actioned
  const [previewUser,   setPreviewUser]       = useState(null); // user whose photo to show
  
  const [rejectModalUser, setRejectModalUser] = useState(null); // user to reject
  const [rejectReason, setRejectReason]       = useState("");
  const [rejectError, setRejectError]         = useState("");

  const { execute: fetchUsers, loading } = useRequest(getPendingUsers);
  const { execute: runApprove }          = useRequest(approveUser);
  const { execute: runReject }           = useRequest(rejectUser);

  // ── Fetch on mount ──
  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      // Global interceptor already handled the error toast
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ── Approve ──
  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      await runApprove(userId);
      toast.success(t("pendingAccounts.approveSuccess"));
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch {
      toast.error(t("pendingAccounts.approveError"));
    } finally {
      setActionLoading(null);
    }
  };

  // ── Reject ──
  const openRejectModal = (user) => {
    setRejectModalUser(user);
    setRejectReason("");
    setRejectError("");
  };

  const closeRejectModal = () => {
    setRejectModalUser(null);
    setRejectReason("");
    setRejectError("");
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      setRejectError(t("pendingAccounts.rejectReasonRequired"));
      return;
    }
    const userId = rejectModalUser.userId;
    setActionLoading(userId);
    try {
      await runReject({ userId, reason: rejectReason.trim() });
      toast.success(t("pendingAccounts.rejectSuccess"));
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      closeRejectModal();
    } catch {
      toast.error(t("pendingAccounts.rejectError"));
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    "colUser", "colRole", "colStatus", "colJoined", "colDocument", "colActions",
  ];

  return (
    <Layout>
      {/* ── Top Bar ── */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 shrink-0">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              {t("pendingAccounts.title")}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">
              {t("pendingAccounts.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-4">
          {/* Count badge */}
          {users.length > 0 && !loading && (
            <span className="inline-flex items-center gap-1.5 bg-warning-bg border border-warning-border text-warning-text text-xs font-bold px-3 py-1.5 rounded-full animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-warning-text animate-pulse" />
              {t("pendingAccounts.pendingCount", { count: users.length })}
            </span>
          )}

          {/* Refresh */}
          <button
            onClick={loadUsers}
            disabled={loading}
            className="w-9 h-9 shrink-0 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-500 hover:border-primary-300 transition-all duration-200 disabled:opacity-50"
            title={t("pendingAccounts.refreshing")}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 py-6">
        {/* Loading skeletons */}
        {loading && (
          <div className="bg-background-card rounded-2xl shadow-sm border border-border-primary overflow-hidden animate-fadeIn overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-border-primary bg-background-app/60">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-5 py-3.5 text-start text-xs font-bold text-text-muted uppercase tracking-wider">
                      {t(`pendingAccounts.${col}`)}
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
        {!loading && users.length === 0 && (
          <div className="h-full flex items-center justify-center py-24 animate-fadeIn">
            <EmptyState
              icon={<Users size={36} className="text-text-muted" />}
              message={t("pendingAccounts.noUsers")}
              description={t("pendingAccounts.noUsersDesc")}
              action={
                <Button variant="ghost" size="sm" onClick={loadUsers}>
                  <RefreshCw size={14} className="me-2" />
                  {t("pendingAccounts.refreshing")}
                </Button>
              }
            />
          </div>
        )}

        {/* Table */}
        {!loading && users.length > 0 && (
          <div className="bg-background-card rounded-2xl shadow-sm border border-border-primary overflow-hidden animate-slideUp overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-border-primary bg-background-app/60">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-start text-xs font-bold text-text-muted uppercase tracking-wider"
                    >
                      {t(`pendingAccounts.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    idx={idx}
                    t={t}
                    onApprove={handleApprove}
                    onReject={openRejectModal}
                    actionLoading={actionLoading}
                    onPreview={setPreviewUser}
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
        closeLabel={t("pendingAccounts.closeModal")}
      />

      {/* ── Reject Modal ── */}
      {rejectModalUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/70 backdrop-blur-sm animate-fadeIn p-4" 
          onClick={closeRejectModal}
        >
          <div 
            className="bg-background-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-text-primary">{t("pendingAccounts.rejectModalTitle")}</h3>
                <button 
                  onClick={closeRejectModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-background-hover text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </div>
              <p className="text-sm text-text-secondary">{t("pendingAccounts.rejectModalDesc")}</p>
              
              <div className="mt-5">
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t("pendingAccounts.rejectReasonLabel")} <span className="text-error">*</span>
                </label>
                <textarea
                  className={`w-full rounded-xl border p-3 text-sm bg-background-input text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                    rejectError 
                      ? 'border-error focus:ring-error/20' 
                      : 'border-border-primary focus:border-border-focus focus:ring-primary-500/20'
                  }`}
                  rows="4"
                  placeholder={t("pendingAccounts.rejectReasonPlaceholder")}
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (rejectError) setRejectError("");
                  }}
                />
                {rejectError && <p className="text-xs text-error mt-1.5">{rejectError}</p>}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-background-hover/50 border-t border-border-primary flex items-center justify-end gap-3">
              <button
                onClick={closeRejectModal}
                disabled={actionLoading === rejectModalUser.userId}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                {t("pendingAccounts.cancel")}
              </button>
              <button
                onClick={confirmReject}
                disabled={actionLoading === rejectModalUser.userId}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-error text-text-inverse hover:bg-error/90 disabled:opacity-50 transition-all shadow-sm shadow-error/20"
              >
                {actionLoading === rejectModalUser.userId && <RefreshCw size={14} className="animate-spin" />}
                {t("pendingAccounts.confirmReject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}