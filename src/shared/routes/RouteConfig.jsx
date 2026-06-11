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
import SupplierDetails from "@/features/suppliers/pages/SupplierDetails";
import PurchasesPage from "@/features/purchase-orders/pages/PurchasesPage";
import AddPurchaseOrder from "@/features/purchase-orders/pages/AddPurchaseOrder";
import PurchaseOrderDetails from "@/features/purchase-orders/pages/PurchaseOrderDetails";
import ReturnOrdersPage from "@/features/return-orders/pages/ReturnOrdersPage";
import ReturnOrderDetails from "@/features/return-orders/pages/ReturnOrderDetails";
import LowStock from "@/features/reports/pages/LowStock";
import OutOfStock from "@/features/reports/pages/OutOfStock";
import TopReturnedProducts from "@/features/reports/pages/TopReturnedProducts";
import PaymentMethodAnalytics from "@/features/reports/pages/PaymentMethodAnalytics";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import OrderDetailsPage from "@/features/orders/pages/OrderDetailsPage";
import AddOrderPage from "@/features/orders/pages/AddOrderPage";
import CashierDraftOrdersPage from "@/features/dashboard/pages/CashierDraftOrdersPage";
import CashierPendingDeliveriesPage from "@/features/dashboard/pages/CashierPendingDeliveriesPage";


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
  {
    path: "/suppliers/:id",
    element: <SupplierDetails />,
    roles: [
      ROLES.MANAGER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },

  // Purchase Orders
  {
    path: "/purchases",
    element: <PurchasesPage />,
    roles: [
      ROLES.MANAGER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/purchases/new",
    element: <AddPurchaseOrder />,
    roles: [
      ROLES.MANAGER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/purchases/:id",
    element: <PurchaseOrderDetails />,
    roles: [
      ROLES.MANAGER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },

  // Return Orders
  {
    path: "/return-orders",
    element: <ReturnOrdersPage />,
    roles: [
      ROLES.ADMIN,
      ROLES.CASHIER
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/return-orders/:id",
    element: <ReturnOrderDetails />,
    roles: [
      ROLES.MANAGER,
      ROLES.INVENTORY_STAFF,
      ROLES.ADMIN,
      ROLES.CASHIER
    ],
    status: [STATUS.ACTIVE],
  },

  // Orders
  {
    path: "/orders",
    element: <OrdersPage />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/orders/new",
    element: <AddOrderPage />,
    roles: [
      ROLES.CASHIER,
      ROLES.MANAGER,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/orders/:id",
    element: <OrderDetailsPage />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.CASHIER,
      ROLES.INVENTORY_STAFF,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/cashier/draft-orders",
    element: <CashierDraftOrdersPage />,
    roles: [
      ROLES.CASHIER,
      ROLES.MANAGER,
    ],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/cashier/pending-deliveries",
    element: <CashierPendingDeliveriesPage />,
    roles: [
      ROLES.CASHIER,
      ROLES.MANAGER,
    ],
    status: [STATUS.ACTIVE],
  },


  // Reports
  {
    path: "/reports/inventory/low-stock",
    element: <LowStock />,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.INVENTORY_STAFF],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/reports/inventory/out-of-stock",
    element: <OutOfStock />,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.INVENTORY_STAFF],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/reports/returns/top-products",
    element: <TopReturnedProducts />,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    status: [STATUS.ACTIVE],
  },
  {
    path: "/reports/payment-methods",
    element: <PaymentMethodAnalytics />,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    status: [STATUS.ACTIVE],
  },

  // Onboarding
  {
    path: "/set-password",
    element: <SetPassword />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF, ROLES.MANAGER],
    status: [STATUS.PENDING_CHANGE_PASSWORD],
  },
  {
    path: "/upload-documents",
    element: <UploadDocuments />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF, ROLES.MANAGER],
    status: [STATUS.REJECTED, STATUS.PENDING_IDENTITY_UPLOAD],
  },
  {
    path: "/pending",
    element: <Pending />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF, ROLES.MANAGER],
    status: [STATUS.PENDING_ADMIN_REVIEW],
  },
  {
    path: "/rejected",
    element: <Rejected />,
    roles: [ROLES.ADMIN, ROLES.CASHIER, ROLES.INVENTORY_STAFF, ROLES.MANAGER],
    status: [STATUS.REJECTED],
  },
];