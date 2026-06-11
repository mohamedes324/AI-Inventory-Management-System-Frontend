import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/features/user-management/api/getAllUsers";
import { fetchUserStatusBreakdown } from "@/features/reports/api/reportsApi";
import { STATUS } from "@/shared/constants/status";

const PENDING_STATUSES = [
  STATUS.PENDING_CHANGE_PASSWORD,
  STATUS.PENDING_IDENTITY_UPLOAD,
  STATUS.PENDING_ADMIN_REVIEW,
];

/**
 * @hook useAdminDashboard
 * @description Fetches all users and status breakdown for the Admin Dashboard.
 * Computes total users, pending accounts, active accounts, and role distribution
 * entirely on the frontend using existing endpoints.
 */
export const useAdminDashboard = () => {
  // 1. All users (GET /api/admin/users)
  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  // 2. User status breakdown (GET /api/reports/users/status-breakdown)
  const statusQuery = useQuery({
    queryKey: ["reports", "users", "status-breakdown"],
    queryFn: fetchUserStatusBreakdown,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  // Derived computations
  const users = usersQuery.data || [];

  const totalUsers = users.length;

  const pendingAccounts = useMemo(
    () => users.filter((u) => PENDING_STATUSES.includes(u.status)).length,
    [users],
  );

  const activeAccounts = useMemo(() => {
    const statusData = statusQuery.data || [];
    const activeEntry = statusData.find(
      (s) => s.status?.toLowerCase() === "active",
    );
    return activeEntry?.count || 0;
  }, [statusQuery.data]);

  const roleDistribution = useMemo(() => {
    const dist = {};
    users.forEach((u) => {
      const role = Array.isArray(u.roles) ? u.roles[0] : u.roles;
      const roleName = role || "Unknown";
      dist[roleName] = (dist[roleName] || 0) + 1;
    });
    return dist;
  }, [users]);

  const isLoading = usersQuery.isLoading || statusQuery.isLoading;
  const isError = usersQuery.isError || statusQuery.isError;

  const refetch = () => {
    usersQuery.refetch();
    statusQuery.refetch();
  };

  return {
    totalUsers,
    pendingAccounts,
    activeAccounts,
    roleDistribution,
    isLoading,
    isError,
    refetch,
  };
};
