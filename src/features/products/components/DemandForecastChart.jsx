/**
 * @component DemandForecastChart
 * @description Line chart showing ML-powered demand forecast for the next 30 days.
 * Displays three lines: Forecast Demand, Lower Bound, and Upper Bound.
 * Uses recharts with the project's existing chart styling patterns.
 *
 * @prop {Object} data - Raw API response from GET /api/ML/forecast/{sku}
 * @prop {boolean} loading - Whether the forecast data is still loading
 */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BrainCircuit, TrendingUp } from "lucide-react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from "recharts";

/* ── Custom Tooltip ── */
function ForecastTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null;

  // Extract values from payload
  const forecast = payload.find((p) => p.dataKey === "forecast");
  const lower = payload.find((p) => p.dataKey === "lower");
  const upper = payload.find((p) => p.dataKey === "upper");

  return (
    <div className="bg-background-elevated border border-border-primary rounded-xl px-4 py-3 shadow-[var(--shadow-elevated)] min-w-[200px]">
      <p className="text-xs font-semibold text-text-muted mb-2.5 border-b border-border-primary/40 pb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        {forecast && (
          <div className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#3B82F6" }}
            />
            <span className="text-text-secondary">{t("ml.forecast")}:</span>
            <span className="font-bold text-text-primary ms-auto">
              {Math.round(forecast.value)} {t("ml.units")}
            </span>
          </div>
        )}
        {lower && (
          <div className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#22C55E" }}
            />
            <span className="text-text-secondary">{t("ml.minimum")}:</span>
            <span className="font-bold text-text-primary ms-auto">
              {Math.round(lower.value)} {t("ml.units")}
            </span>
          </div>
        )}
        {upper && (
          <div className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#F59E0B" }}
            />
            <span className="text-text-secondary">{t("ml.maximum")}:</span>
            <span className="font-bold text-text-primary ms-auto">
              {Math.round(upper.value)} {t("ml.units")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Custom Legend ── */
function ForecastLegend({ payload }) {
  return (
    <div className="flex items-center justify-center gap-5 mt-3">
      {payload?.map((entry) => (
        <div
          key={entry.value}
          className="flex items-center gap-1.5 text-xs text-text-muted"
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
}

export default function DemandForecastChart({ data, loading = false, children }) {
  const { t } = useTranslation("products");

  // Transform API response into recharts-friendly array
  const chartData = useMemo(() => {
    if (!data?.forecast_dates?.length) return [];

    return data.forecast_dates.map((date, i) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      forecast: data.forecast_values[i],
      lower: data.lower_bounds[i],
      upper: data.upper_bounds[i],
    }));
  }, [data]);

  const hasData = chartData.length > 0;

  // Calculate summary stats for the header
  const stats = useMemo(() => {
    if (!hasData) return null;
    const avgForecast =
      data.forecast_values.reduce((a, b) => a + b, 0) /
      data.forecast_values.length;
    const maxUpper = Math.max(...data.upper_bounds);
    const minLower = Math.min(...data.lower_bounds);
    return {
      avgForecast: Math.round(avgForecast),
      maxUpper: Math.round(maxUpper),
      minLower: Math.round(minLower),
    };
  }, [data, hasData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-border-primary bg-background-card shadow-[var(--shadow-card)] overflow-hidden"
    >
      {/* ── Section Header ── */}
      <div className="px-5 sm:px-6 py-4 border-b border-border-primary/50">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/10 border border-blue-500/20 flex items-center justify-center">
            <BrainCircuit size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              {t("ml.sectionTitle")}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {t("ml.sectionSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Card: Demand Forecast ── */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <TrendingUp size={15} className="text-blue-400" />
            {t("ml.chartTitle")}
          </h4>

          {/* Summary stats pills */}
          {hasData && stats && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15">
                {t("ml.avgDemand")}: {stats.avgForecast}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/15">
                {t("ml.peakLabel")}: {stats.maxUpper}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          /* ── Loading Skeleton ── */
          <div className="w-full h-[320px] rounded-xl animate-shimmer" />
        ) : hasData ? (
          /* ── Chart ── */
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="forecastGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3B82F6"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor="#3B82F6"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  tickCount={7}
                />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => Math.round(v)}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ForecastTooltip t={t} />}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullDate || ""
                  }
                />
                <Legend content={<ForecastLegend />} />

                {/* Confidence band area (between lower and upper) */}
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill="url(#forecastGrad)"
                  fillOpacity={1}
                  name={t("ml.upperBound")}
                  dot={false}
                  activeDot={false}
                  legendType="none"
                />

                {/* Upper Bound */}
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#F59E0B"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#F59E0B",
                    stroke: "#0F172A",
                    strokeWidth: 2,
                  }}
                  name={t("ml.upperBound")}
                />

                {/* Forecast Demand (main line) */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#3B82F6",
                    stroke: "#0F172A",
                    strokeWidth: 2,
                  }}
                  name={t("ml.forecastDemand")}
                />

                {/* Lower Bound */}
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#22C55E"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#22C55E",
                    stroke: "#0F172A",
                    strokeWidth: 2,
                  }}
                  name={t("ml.lowerBound")}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="w-full h-[320px] flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400/60 mb-4">
              <BrainCircuit size={28} />
            </div>
            <p className="text-sm font-medium text-text-muted text-center">
              {t("ml.noData")}
            </p>
            <p className="text-xs text-text-muted/60 mt-1.5 text-center max-w-xs">
              {t("ml.noDataHint")}
            </p>
          </div>
        )}
      </div>

      {/* ── Additional ML content (e.g. Recommendations) ── */}
      {children}
    </motion.div>
  );
}
