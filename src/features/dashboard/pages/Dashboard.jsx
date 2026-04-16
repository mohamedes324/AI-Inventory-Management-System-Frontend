    import { useNavigate } from "react-router-dom";
import { logout } from "@/shared/utils/auth";
import { useAuthStore } from "@/shared/store/authStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const store = useAuthStore.getState();

  const handleLogout = async () => {
    await logout();
    store.clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <ul className="space-y-3">
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Users
          </li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Settings
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Welcome 👋</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Users</h2>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">
              هنا هنعرض ال users بعد كدا 👌
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;