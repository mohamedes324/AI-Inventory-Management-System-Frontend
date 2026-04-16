import { useEffect, useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { getPendingUsers } from "../api/getPendingUsers";
import { useTranslation } from "react-i18next";
import Button from "@/shared/components/ui/Button";
import UserCard from "../components/UserCard";
import SkeletonCard from "../components/SkeletonCard";

export default function PendingAccounts() {
  const { t } = useTranslation("admin");

  const { execute, loading, error } = useRequest(getPendingUsers);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await execute();
        setUsers(data);
      } catch (err) {
        console.log(err.message)
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="p-6 bg-gray-light min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-dark mb-1">
        {t("pendingAccounts.title")}
      </h1>

      <p className="text-gray-DEFAULT text-sm mb-6">
        {t("pendingAccounts.description")}
      </p>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-error text-center">
          {typeof error === "string" ? error : error.message}
        </div>
      )}

      {/* Empty */}
      {!loading && users.length === 0 && (
        <div className="text-center text-gray-DEFAULT mt-20">
          {t("pendingAccounts.noUsers")}
        </div>
      )}

      {/* Users */}
      {!loading && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}