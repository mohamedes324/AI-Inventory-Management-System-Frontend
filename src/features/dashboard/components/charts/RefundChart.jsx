/**
 * @component RefundChart
 * @description Donut chart showing refund amount vs net revenue.
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22C55E", "#EF4444"];

const CustomTooltip = ({ active, payload, t }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-elevated border border-border-primary rounded-lg px-3 py-2 shadow-[var(--shadow-elevated)]">
      <div className="flex items-center gap-2 text-sm">
        <span className="w-2 h-2 rounded-full" style={{ background: payload[0].payload.fill }} />
        <span className="text-text-secondary">{payload[0].name}:</span>
        <span className="font-semibold text-text-primary">
          {payload[0].value.toLocaleString()} {t("currency")}
        </span>
      </div>
    </div>
  );
};

export default function RefundChart({ totalRevenue = 0, totalRefundAmount = 0, loading = false }) {
  const { t } = useTranslation("dashboard");
  const netRevenue = totalRevenue - totalRefundAmount;
  const refundRate = totalRevenue > 0 ? ((totalRefundAmount / totalRevenue) * 100).toFixed(1) : 0;

  const data = [
    { name: t("charts.netRevenue"), value: Math.max(netRevenue, 0) },
    { name: t("charts.refundAmount"), value: totalRefundAmount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="text-base font-semibold text-text-primary mb-6">
        {t("charts.refundAnalytics")}
      </h3>

      {loading ? (
        <div className="w-full h-[180px] rounded-xl animate-shimmer" />
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left: Donut Chart */}
          <div className="w-[180px] h-[180px] shrink-0 relative mx-auto md:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip t={t} />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-text-primary">{refundRate}%</span>
              <span className="text-xs text-text-muted">{t("charts.refundRate")}</span>
            </div>
          </div>

          {/* Right: Detailed horizontal stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
            {/* Total Sales / Revenue */}
            <div className="bg-background-hover/40 border border-border-primary/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider">{t("kpi.totalRevenue")}</span>
              </div>
              <p className="text-lg font-bold text-text-primary mt-1">
                {totalRevenue.toLocaleString()} <span className="text-xs font-normal text-text-muted">{t("currency")}</span>
              </p>
            </div>

            {/* Net Revenue */}
            <div className="bg-background-hover/40 border border-border-primary/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider">{t("charts.netRevenue")}</span>
              </div>
              <p className="text-lg font-bold text-text-primary mt-1">
                {netRevenue.toLocaleString()} <span className="text-xs font-normal text-text-muted">{t("currency")}</span>
              </p>
            </div>

            {/* Refund Amount */}
            <div className="bg-background-hover/40 border border-border-primary/50 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider">{t("charts.refundAmount")}</span>
              </div>
              <p className="text-lg font-bold text-text-primary mt-1">
                {totalRefundAmount.toLocaleString()} <span className="text-xs font-normal text-text-muted">{t("currency")}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
