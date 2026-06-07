/**
 * @component OrdersReturnsChart
 * @description Bar chart comparing orders vs returns over time.
 * Renders real API data only. Shows an empty state when no data is available.
 *
 * Future endpoint: GET /api/dashboard/orders-analytics
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-elevated border border-border-primary rounded-lg px-3 py-2 shadow-[var(--shadow-elevated)]">
      <p className="text-xs text-text-muted mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="font-semibold text-text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex items-center justify-center gap-5 mt-2">
    {payload?.map((entry) => (
      <div key={entry.value} className="flex items-center gap-1.5 text-xs text-text-muted">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.color }} />
        {entry.value}
      </div>
    ))}
  </div>
);

export default function OrdersReturnsChart({ data, loading = false }) {
  const { t } = useTranslation("dashboard");
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="text-base font-semibold text-text-primary mb-6">
        {t("charts.ordersVsReturns")}
      </h3>

      {loading ? (
        <div className="w-full h-[260px] rounded-xl animate-shimmer" />
      ) : hasData ? (
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.05)" }} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="orders" name={t("charts.orders")} fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="returns" name={t("charts.returns")} fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="w-full h-[260px] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400/60 mb-3">
            <BarChart3 size={24} />
          </div>
          <p className="text-sm text-text-muted text-center">
            {t("charts.noDataAvailable")}
          </p>
          <p className="text-xs text-text-muted/60 mt-1 text-center">
            {t("charts.noDataHint")}
          </p>
        </div>
      )}
    </motion.div>
  );
}
