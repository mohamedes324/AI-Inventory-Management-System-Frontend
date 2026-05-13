import { useAuthStore } from "@/shared/store/authStore";
import { ROLES } from "@/shared/constants/roles";
import Layout from "@/shared/components/Layout";
import AdminView from "../components/AdminView";
import ManagerView from "../components/ManagerView";
import CashierView from "../components/CashierView";
import InventoryStaffView from "../components/InventoryStaffView";

const Dashboard = () => {
  const role = useAuthStore((state) => state.role);

  const renderView = () => {
    switch (role) {
      case ROLES.ADMIN:
        return <AdminView />;
      case ROLES.MANAGER:
        return <ManagerView />;
      case ROLES.CASHIER:
        return <CashierView />;
      case ROLES.INVENTORY_STAFF:
        return <InventoryStaffView />;
      default:
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <p className="text-lg text-text-muted">Access Denied: Unrecognized Role</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
};

export default Dashboard;
