
import { STATUS } from "@/shared/constants/status";
import { ROLES } from "@/shared/constants/roles";

// 🧩 status → redirect
export const statusRedirectMap = {
    [STATUS.PENDING_CHANGE_PASSWORD]: "/set-password",
    [STATUS.PENDING_IDENTITY_UPLOAD]: "/upload-documents",
    [STATUS.PENDING_ADMIN_REVIEW]: "/pending",
    [STATUS.REJECTED]: "/rejected",
};

// 🧩 role → home
export const roleHomeMap = {
    [ROLES.ADMIN]: "/admin/home",
    [ROLES.MANAGER]: "/manager/home",
    [ROLES.CASHIER]: "/cashier/home",
    [ROLES.INVENTORY_STAFF]: "/inventory/home",
};