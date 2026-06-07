import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/shared/routes/ProtectedRoute";
import { routeConfig } from "@/shared/routes/RouteConfig";

import Login from "@/features/auth/pages/Login";
import RedirectPage from "@/features/auth/pages/RedirectPage";
import PublicRoute from "../../shared/components/PublicRoute";
import SupplierDetails from "@/features/suppliers/pages/SupplierDetails";
import ReturnOrdersPage from "@/features/return-orders/pages/ReturnOrdersPage";
import ReturnOrderDetails from "@/features/return-orders/pages/ReturnOrderDetails";
import DeliveryOrdersPage from "@/features/delivery-orders/pages/DeliveryOrdersPage";
import DeliveryOrderDetails from "@/features/delivery-orders/pages/DeliveryOrderDetails";
import { ROLES } from "@/shared/constants/roles";
import { STATUS } from "@/shared/constants/status";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {routeConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute roles={route.roles} pageStatus={route.status}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* ── Supplier Details (explicit route) ── */}
        <Route
          path="/suppliers/:id"
          element={
            <ProtectedRoute
              roles={[ROLES.MANAGER, ROLES.INVENTORY_STAFF]}
              pageStatus={[STATUS.ACTIVE]}
            >
              <SupplierDetails />
            </ProtectedRoute>
          }
        />

        {/* ── Return Orders (explicit route) ── */}
        <Route
          path="/return-orders"
          element={
            <ProtectedRoute
              roles={[ROLES.MANAGER, ROLES.INVENTORY_STAFF]}
              pageStatus={[STATUS.ACTIVE]}
            >
              <ReturnOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/return-orders/:id"
          element={
            <ProtectedRoute
              roles={[ROLES.MANAGER, ROLES.INVENTORY_STAFF]}
              pageStatus={[STATUS.ACTIVE]}
            >
              <ReturnOrderDetails />
            </ProtectedRoute>
          }
        />

        {/* ── Delivery Orders (Cashier + Manager) ── */}
        <Route
          path="/delivery-orders"
          element={
            <ProtectedRoute
              roles={[ROLES.CASHIER, ROLES.MANAGER]}
              pageStatus={[STATUS.ACTIVE]}
            >
              <DeliveryOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-orders/:id"
          element={
            <ProtectedRoute
              roles={[ROLES.CASHIER, ROLES.MANAGER]}
              pageStatus={[STATUS.ACTIVE]}
            >
              <DeliveryOrderDetails />
            </ProtectedRoute>
          }
        />

        {/* 🔁 redirect */}
        <Route path="/redirect" element={<RedirectPage />} />
        {/* 🔁 Default */}
        <Route path="/" element={<Navigate to="/redirect" />} />
      </Routes>
    </BrowserRouter>
  );
}
