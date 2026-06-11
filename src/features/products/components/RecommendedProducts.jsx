/**
 * @component RecommendedProducts
 * @description Displays the top 3 products frequently purchased together
 * with the currently viewed product. Each recommendation card shows rank,
 * name, SKU, and a match score. Cards are clickable and navigate to the
 * recommended product's detail page.
 *
 * Rendered inside the Machine Learning Insights section, directly below
 * the Demand Forecast chart.
 *
 * @prop {Object} data - Raw API response from GET /api/ML/recommendations/{sku}
 * @prop {boolean} loading - Whether the recommendations are still loading
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShoppingBag, Award, PackageOpen } from "lucide-react";

/* ── Rank badge colours & icons ── */
const RANK_CONFIG = {
  1: {
    gradient: "from-amber-400 to-yellow-500",
    glow: "shadow-amber-500/30",
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
  },
  2: {
    gradient: "from-slate-300 to-slate-400",
    glow: "shadow-slate-400/20",
    border: "border-slate-400/25",
    bg: "bg-slate-400/10",
    text: "text-slate-300",
  },
  3: {
    gradient: "from-amber-600 to-amber-700",
    glow: "shadow-amber-700/20",
    border: "border-amber-600/25",
    bg: "bg-amber-600/10",
    text: "text-amber-500",
  },
};

function RankBadge({ rank }) {
  const config = RANK_CONFIG[rank] || RANK_CONFIG[3];

  return (
    <div
      className={`
        relative w-10 h-10 rounded-xl flex items-center justify-center
        bg-gradient-to-br ${config.gradient} shadow-lg ${config.glow}
        text-white font-bold text-sm shrink-0
        ring-1 ring-inset ring-white/20
      `}
    >
      <span className="relative z-10">#{rank}</span>
    </div>
  );
}

function RecommendationCard({ item, rank }) {
  const navigate = useNavigate();
  const { t } = useTranslation("products");
  const config = RANK_CONFIG[rank] || RANK_CONFIG[3];

  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.1 }}
      onClick={() => navigate(`/products/${item.id}`)}
      className={`
        group w-full flex items-center gap-4 p-4 rounded-xl
        bg-background-elevated/50 border ${config.border}
        hover:bg-background-hover/60 hover:border-primary-400/30
        hover:shadow-[var(--shadow-elevated)]
        transition-all duration-300 cursor-pointer text-start
      `}
    >
      {/* Rank badge */}
      <RankBadge rank={rank} />

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate group-hover:text-primary-400 transition-colors">
          {item.name}
        </p>
        <p className="text-xs font-mono text-text-muted mt-0.5 truncate">
          {t("ml.recommendations.skuLabel")}: {item.sku}
        </p>
      </div>

      {/* Score */}
      <div
        className={`
          shrink-0 flex flex-col items-center justify-center
          px-3 py-1.5 rounded-lg ${config.bg} border ${config.border}
        `}
      >
        <span className={`text-base font-bold ${config.text}`}>
          {item.score.toFixed(1)}
        </span>
        <span className="text-[10px] text-text-muted font-medium">
          {t("ml.recommendations.score")}
        </span>
      </div>
    </motion.button>
  );
}

export default function RecommendedProducts({ data, loading = false }) {
  const { t } = useTranslation("products");

  // Take only top 3 recommendations
  const recommendations = (data?.recommendations || []).slice(0, 3);
  const hasData = recommendations.length > 0;

  return (
    <div className="p-5 sm:p-6 border-t border-border-primary/50">
      {/* ── Sub-header ── */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <ShoppingBag size={15} className="text-purple-400" />
          {t("ml.recommendations.title")}
        </h4>
        <p className="text-xs text-text-muted mt-1 ms-[23px]">
          {t("ml.recommendations.subtitle")}
        </p>
      </div>

      {loading ? (
        /* ── Loading Skeleton ── */
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[72px] rounded-xl animate-shimmer"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      ) : hasData ? (
        /* ── Recommendation cards ── */
        <div className="space-y-3">
          {recommendations.map((item, idx) => (
            <RecommendationCard key={item.id} item={item} rank={idx + 1} />
          ))}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400/60 mb-4">
            <PackageOpen size={28} />
          </div>
          <p className="text-sm font-medium text-text-muted text-center">
            {t("ml.recommendations.noData")}
          </p>
        </div>
      )}
    </div>
  );
}
