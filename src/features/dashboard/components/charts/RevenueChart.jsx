/**
 * @component RevenueChart
 * @description Area chart showing revenue trends over time.
 * Renders real API data only. Shows an empty state when no data is available.
 *
 * Future endpoint: GET /api/dashboard/revenue-trend
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-elevated border border-border-primary rounded-lg px-3 py-2 shadow-[var(--shadow-elevated)]">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold text-emerald-400">
        {payload[0].value.toLocaleString()} EGP
      </p>
    </div>
  );
};

export default function RevenueChart({ data, loading = false }) {
  const { t } = useTranslation("dashboard");
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="text-base font-semibold text-text-primary mb-6">
        {t("charts.revenueOverview")}
      </h3>

      {loading ? (
        <div className="w-full h-[260px] rounded-xl animate-shimmer" />
      ) : hasData ? (
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: "#22C55E", stroke: "#0F172A", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="w-full h-[260px] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400/60 mb-3">
            <TrendingUp size={24} />
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
