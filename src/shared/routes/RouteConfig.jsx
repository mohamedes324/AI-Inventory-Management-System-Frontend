import { ROLES } from "@/shared/constants/roles";
import { STATUS } from "@/shared/constants/status";

import SetPassword from "@/features/onboarding/pages/SetPassword";
import UploadDocuments from "@/features/onboarding/pages/UploadDocuments";
import Pending from "@/features/onboarding/pages/Pending";
import Rejected from "@/features/onboarding/pages/Rejected";
import PendingAccounts from "@/features/admin/pages/PendingAccounts";
import DashboardPage from "@/features/dashboard/pages/Dashboard";
import Register from "@/features/auth/pages/Register";

export const routeConfig = [
  {
    path: "/register",
    element: <Register />,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/pending-accounts",
    element: <PendingAccounts />,
    roles: [ROLES.ADMIN],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },

  // Onboarding
  {
    path: "/set-password",
    element: <SetPassword />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF],
    status: [STATUS.PENDING_CHANGE_PASSWORD],
  },
  {
    path: "/upload-documents",
    element: <UploadDocuments />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF],
    status: [STATUS.PENDING_IDENTITY_UPLOAD],
  },
  {
    path: "/pending",
    element: <Pending />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF],
    status: [STATUS.PENDING_ADMIN_REVIEW],
  },
  {
    path: "/rejected",
    element: <Rejected />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF],
    status: [STATUS.REJECTED],
  },
];