import { ROLES } from "@/shared/constants/roles";
import { STATUS } from "@/shared/constants/status";
import SetPassword from "@/features/onboarding/pages/SetPassword";
import UploadDocuments from "@/features/onboarding/pages/UploadDocuments";
import Pending from "@/features/onboarding/pages/Pending";
import Rejected from "@/features/onboarding/pages/Rejected";
import PendingAccounts from "@/features/user-management/pages/PendingAccounts";
import AllUsers from "@/features/user-management/pages/AllUsers";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import CreateUser from "@/features/user-management/pages/CreateUser";
import Categories from "@/features/categories/pages/Categories";
import Products from "@/features/products/pages/Products";
import ProductDetails from "@/features/products/pages/ProductDetails";
import StockBatchesPage from "@/features/products/pages/StockBatchesPage";
import Suppliers from "@/features/suppliers/pages/Suppliers";

export const routeConfig = [
  {
    path: "/create-user",
    element: <CreateUser />,
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
    path: "/users-management",
    element: <AllUsers />,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/categories",
    element: <Categories />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },

  // Products
  {
    path: "/products",
    element: <Products />,
    roles: [
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/products/:id",
    element: <ProductDetails />,
    roles: [
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/products/:id/stock-batches",
    element: <StockBatchesPage />,
    roles: [
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },

  // Suppliers
  {
    path: "/suppliers",
    element: <Suppliers />,
    roles: [
      ROLES.MANAGER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },

  // Onboarding
  {
    path: "/set-password",
    element: <SetPassword />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF , ROLES.MANAGER],
    status: [STATUS.PENDING_CHANGE_PASSWORD],
  },
  {
    path: "/upload-documents",
    element: <UploadDocuments />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF , ROLES.MANAGER],
    status: [STATUS.REJECTED , STATUS.PENDING_IDENTITY_UPLOAD],
  },
  {
    path: "/pending",
    element: <Pending />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF , ROLES.MANAGER],
    status: [STATUS.PENDING_ADMIN_REVIEW],
  },
  {
    path: "/rejected",
    element: <Rejected />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF , ROLES.MANAGER],
    status: [STATUS.REJECTED],
  },
];