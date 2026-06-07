import { useAuthStore } from "@/shared/store/authStore";
import { ROLES } from "@/shared/constants/roles";

export const usePermissions = () => {
  const role = useAuthStore((state) => state.role);

  const isAdmin = role === ROLES.ADMIN;
  const isManager = role === ROLES.MANAGER;
  const isCashier = role === ROLES.CASHIER;
  const isInventoryStaff = role === ROLES.INVENTORY_STAFF;

  const canManageUsers = isAdmin || isManager;
  const canAccessInventory = isAdmin || isManager || isInventoryStaff;
  const canProcessSales = isAdmin || isCashier;
  const canManageCategories = isAdmin || isManager;  // create categories
  const canEditCategories = isAdmin;                 // edit + delete categories
  const canManageProducts = isInventoryStaff;         // create/edit/delete products
  const canCreatePurchaseOrders = isInventoryStaff;   // create purchase orders

  return {
    role,
    isAdmin,
    isManager,
    isCashier,
    isInventoryStaff,
    canManageUsers,
    canAccessInventory,
    canProcessSales,
    canManageCategories,
    canEditCategories,
    canManageProducts,
    canCreatePurchaseOrders,
  };
};
