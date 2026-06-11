/**
 * @component ClusterInsights
 * @description Machine Learning Insights section for the Manager dashboard.
 * Shows product cluster summary cards, a donut distribution chart,
 * and an interactive product list when a cluster is selected.
 *
 * Uses the existing dashboard shared components (DashboardSection, DashboardGrid)
 * and recharts for the distribution chart.
 */
import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, Trophy, Gem, TrendingUp, TrendingDown,
  ChevronDown, ExternalLink, PackageOpen,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

import { useClusters } from "../../hooks/useClusters";
import { DashboardSection, DashboardGrid } from "../shared";

/* ── Cluster visual configuration ── */
const CLUSTER_CONFIG = {
  "Top Performers": {
    icon: Trophy,
    emoji: "🏆",
    color: "amber",
    chartColor: "#F59E0B",
    gradient: "from-amber-500/15 to-amber-600/5",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    border: "border-amber-500/20",
    ring: "ring-amber-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    accent: "from-amber-500/10 to-transparent",
  },
  "Premium Products": {
    icon: Gem,
    emoji: "💎",
    color: "purple",
    chartColor: "#8B5CF6",
    gradient: "from-violet-500/15 to-violet-600/5",
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-400",
    border: "border-violet-500/20",
    ring: "ring-violet-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
    accent: "from-violet-500/10 to-transparent",
  },
  "Steady Sellers": {
    icon: TrendingUp,
    emoji: "📈",
    color: "emerald",
    chartColor: "#22C55E",
    gradient: "from-emerald-500/15 to-emerald-600/5",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    border: "border-emerald-500/20",
    ring: "ring-emerald-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]",
    accent: "from-emerald-500/10 to-transparent",
  },
  "Slow Movers": {
    icon: TrendingDown,
    emoji: "🐢",
    color: "blue",
    chartColor: "#3B82F6",
    gradient: "from-blue-500/15 to-blue-600/5",
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400",
    border: "border-blue-500/20",
    ring: "ring-blue-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
    accent: "from-blue-500/10 to-transparent",
  },
};

/* Fallback config for unknown cluster names */
const DEFAULT_CONFIG = {
  icon: BrainCircuit,
  emoji: "📊",
  color: "cyan",
  chartColor: "#06B6D4",
  gradient: "from-cyan-500/15 to-cyan-600/5",
  iconBg: "bg-cyan-500/10",
  iconText: "text-cyan-400",
  border: "border-cyan-500/20",
  ring: "ring-cyan-500/20",
  glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
  accent: "from-cyan-500/10 to-transparent",
};

function getConfig(clusterName) {
  return CLUSTER_CONFIG[clusterName] || DEFAULT_CONFIG;
}

/* ── Medal emojis for top-3 items in the product list ── */
const RANK_MEDALS = ["🥇", "🥈", "🥉"];

/* ── Custom Tooltip for the donut chart ── */
function ClusterTooltip({ active, payload, t }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-background-elevated border border-border-primary rounded-lg px-3 py-2 shadow-[var(--shadow-elevated)]">
      <div className="flex items-center gap-2 text-sm">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.payload.fill }} />
        <span className="text-text-secondary">
          {t(`mlClusters.names.${entry.name}`, { defaultValue: entry.name })}:
        </span>
        <span className="font-semibold text-text-primary">
          {entry.value} {t("mlClusters.products")}
        </span>
      </div>
    </div>
  );
}

/* ── Cluster Summary Card ── */
function ClusterCard({ cluster, isSelected, onClick, t }) {
  const config = getConfig(cluster.cluster_name);
  const Icon = config.icon;
  const count = cluster.items?.length || 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl text-start w-full
        bg-background-card border p-5 transition-all duration-300
        hover:border-border-secondary hover:-translate-y-0.5
        shadow-[var(--shadow-card)] cursor-pointer
        ${config.glow}
        ${isSelected ? `${config.border} ring-1 ${config.ring}` : "border-border-primary"}
      `}
    >
      {/* Subtle gradient accent at top */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${config.accent}`} />

      {/* Header: Icon + Title */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center
            ${config.iconBg} ${config.iconText}
            ring-1 ${config.ring}
            transition-transform duration-300 group-hover:scale-110
          `}
        >
          <Icon size={20} />
        </div>
        {isSelected && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.iconBg} ${config.iconText}`}>
            {t("mlClusters.selected")}
          </span>
        )}
      </div>

      {/* Cluster name */}
      <p className="text-[0.8125rem] font-medium text-text-muted mb-1">
        {config.emoji} {t(`mlClusters.names.${cluster.cluster_name}`, { defaultValue: cluster.cluster_name })}
      </p>

      {/* Count */}
      <p className="text-2xl font-bold text-text-primary tracking-tight">
        {count}
      </p>
      <p className="text-[0.8125rem] text-text-muted">
        {t("mlClusters.products")}
      </p>
    </motion.button>
  );
}

/* ── Donut Chart Card ── */
function ClusterDistributionChart({ clusters, selectedCluster, onSelect, t }) {
  const chartData = useMemo(() => {
    return clusters.map((c) => {
      const config = getConfig(c.cluster_name);
      return {
        name: c.cluster_name,
        value: c.items?.length || 0,
        fill: config.chartColor,
      };
    });
  }, [clusters]);

  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]"
    >
      <h3 className="text-base font-semibold text-text-primary mb-6">
        {t("mlClusters.distribution")}
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="w-[200px] h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                onClick={(_, idx) => onSelect(clusters[idx]?.cluster_name)}
                cursor="pointer"
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.fill}
                    opacity={
                      selectedCluster && selectedCluster !== clusters[i]?.cluster_name
                        ? 0.35
                        : 1
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<ClusterTooltip t={t} />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-text-primary">{total}</span>
            <span className="text-xs text-text-muted">{t("mlClusters.totalProducts")}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {clusters.map((cluster) => {
            const config = getConfig(cluster.cluster_name);
            const count = cluster.items?.length || 0;
            const isActive = selectedCluster === cluster.cluster_name;

            return (
              <button
                key={cluster.cluster_name}
                onClick={() => onSelect(cluster.cluster_name)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl text-start
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? `${config.iconBg} ${config.border} border`
                    : "hover:bg-background-hover border border-transparent"
                  }
                `}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: config.chartColor }}
                />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-secondary truncate">
                      {t(`mlClusters.names.${cluster.cluster_name}`, { defaultValue: cluster.cluster_name })}
                    </p>
                  </div>
                <span className="text-sm font-semibold text-text-primary">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Product List for selected cluster ── */
function ClusterProductList({ cluster, t }) {
  const navigate = useNavigate();
  const config = getConfig(cluster.cluster_name);
  const items = cluster.items || [];

  return (
    <motion.div
      key={cluster.cluster_name}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border-primary bg-background-card shadow-[var(--shadow-card)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-border-primary/50 flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.iconBg} ${config.iconText}`}
        >
          {(() => { const Icon = config.icon; return <Icon size={16} />; })()}
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">
            {config.emoji} {t(`mlClusters.names.${cluster.cluster_name}`, { defaultValue: cluster.cluster_name })}
          </h4>
          <p className="text-xs text-text-muted mt-0.5">
            {items.length} {t("mlClusters.products")}
          </p>
        </div>
      </div>

      {/* Product list */}
      <div className="divide-y divide-border-primary/40">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => navigate(`/products/${item.id}`)}
            className="
              w-full flex items-center gap-4 px-5 sm:px-6 py-3.5
              text-start transition-all duration-200
              hover:bg-background-hover/60 cursor-pointer group
            "
          >
            {/* Rank */}
            <span className="w-8 text-center text-base shrink-0">
              {idx < 3 ? RANK_MEDALS[idx] : (
                <span className="text-xs font-bold text-text-muted bg-background-hover px-2 py-1 rounded-lg">
                  {idx + 1}
                </span>
              )}
            </span>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary-400 transition-colors">
                {item.name}
              </p>
              <p className="text-xs font-mono text-text-muted mt-0.5 truncate">
                SKU: {item.sku}
              </p>
            </div>

            {/* Arrow */}
            <ExternalLink
              size={14}
              className="text-text-muted/40 group-hover:text-primary-400 transition-colors shrink-0"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Loading skeleton ── */
function ClustersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-primary bg-background-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl animate-shimmer" />
              <div className="w-16 h-4 rounded animate-shimmer" />
            </div>
            <div className="w-16 h-8 rounded-lg animate-shimmer mb-2" />
            <div className="w-24 h-4 rounded animate-shimmer" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border-primary bg-background-card p-6">
        <div className="w-40 h-5 rounded animate-shimmer mb-6" />
        <div className="w-full h-[220px] rounded-xl animate-shimmer" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
 * Main Export
 * ══════════════════════════════════════════════════ */
export default function ClusterInsights() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading, isError } = useClusters();
  const [selectedCluster, setSelectedCluster] = useState(null);

  const clusters = data?.clusters || [];
  const hasClusters = clusters.length > 0;

  // Find the currently selected cluster object
  const activeCluster = useMemo(
    () => clusters.find((c) => c.cluster_name === selectedCluster),
    [clusters, selectedCluster]
  );

  const handleSelect = (clusterName) => {
    setSelectedCluster((prev) => (prev === clusterName ? null : clusterName));
  };

  return (
    <DashboardSection delay={350}>
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/10 border border-blue-500/20 flex items-center justify-center">
          <BrainCircuit size={18} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary tracking-tight">
            {t("mlClusters.sectionTitle")}
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            {t("mlClusters.sectionSubtitle")}
          </p>
        </div>
      </div>

      {isLoading ? (
        <ClustersSkeleton />
      ) : isError || !hasClusters ? (
        /* ── Empty State ── */
        <div className="rounded-2xl border border-border-primary bg-background-card shadow-[var(--shadow-card)] flex flex-col items-center justify-center py-14 px-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400/60 mb-5 animate-float">
            <PackageOpen size={32} />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1.5">
            {t("mlClusters.emptyTitle")}
          </h3>
          <p className="text-sm text-text-muted max-w-xs text-center">
            {t("mlClusters.emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── 1. Cluster Summary Cards ── */}
          <DashboardGrid cols={4}>
            {clusters.map((cluster) => (
              <ClusterCard
                key={cluster.cluster_name}
                cluster={cluster}
                isSelected={selectedCluster === cluster.cluster_name}
                onClick={() => handleSelect(cluster.cluster_name)}
                t={t}
              />
            ))}
          </DashboardGrid>

          {/* ── 2. Distribution Chart ── */}
          <ClusterDistributionChart
            clusters={clusters}
            selectedCluster={selectedCluster}
            onSelect={handleSelect}
            t={t}
          />

          {/* ── 3. Interactive Cluster Details ── */}
          <AnimatePresence mode="wait">
            {activeCluster && activeCluster.items?.length > 0 && (
              <ClusterProductList cluster={activeCluster} t={t} />
            )}
          </AnimatePresence>
        </div>
      )}
    </DashboardSection>
  );
}
