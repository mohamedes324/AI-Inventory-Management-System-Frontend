
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
    [ROLES.ADMIN]: "/dashboard",
    [ROLES.MANAGER]: "/dashboard",
    [ROLES.CASHIER]: "/dashboard",
    [ROLES.INVENTORY_STAFF]: "/dashboard",
};