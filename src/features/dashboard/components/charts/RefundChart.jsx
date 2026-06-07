/**
 * @component RefundChart
 * @description Donut chart showing refund amount vs net revenue.
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22C55E", "#EF4444"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-elevated border border-border-primary rounded-lg px-3 py-2 shadow-[var(--shadow-elevated)]">
      <div className="flex items-center gap-2 text-sm">
        <span className="w-2 h-2 rounded-full" style={{ background: payload[0].payload.fill }} />
        <span className="text-text-secondary">{payload[0].name}:</span>
        <span className="font-semibold text-text-primary">
          {payload[0].value.toLocaleString()} EGP
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
        <div className="w-full h-[260px] rounded-xl animate-shimmer" />
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-[180px] h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-text-primary">{refundRate}%</span>
              <span className="text-xs text-text-muted">{t("charts.refundRate")}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm text-text-secondary">{t("charts.netRevenue")}</p>
                <p className="text-base font-semibold text-text-primary">{netRevenue.toLocaleString()} EGP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <div>
                <p className="text-sm text-text-secondary">{t("charts.refundAmount")}</p>
                <p className="text-base font-semibold text-text-primary">{totalRefundAmount.toLocaleString()} EGP</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
