import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "@/shared/utils/jwt";
import { getUserStatus } from "@/features/onboarding/api/getUserStatus";

export default function StatusGuard({ children, allowedStatuses }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const userId = getUserIdFromToken();
      const res = await getUserStatus();
      setStatus(res.data);
      setLoading(false);
    };

    fetchStatus();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!allowedStatuses.includes(status)) {
    return <Navigate to="/redirect" />;
  }

  return children;
}
