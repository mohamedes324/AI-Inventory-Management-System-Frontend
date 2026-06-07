/**
 * @page PaymentMethodAnalytics
 * @description Full payment & sales analytics page.
 * Fetches from /api/reports/sales/analytics with date filtering.
 * Shows: payment method breakdown, peak hours, order types.
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Wallet, ArrowLeft, RefreshCw, CreditCard,
  Banknote, Building2, Clock, ShoppingBag, Store,
  BarChart3, AlertTriangle,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

import Layout from "@/shared/components/Layout";
import { Button } from "@/shared/components/ui";
import DateRangePicker from "@/features/dashboard/components/shared/DateRangePicker";
import { useSalesAnalytics } from "../hooks/useSalesAnalytics";

const PIE_COLORS = ["#22C55E", "#3B82F6", "#A855F7", "#F59E0B", "#EF4444"];

const METHOD_ICONS = { Cash: Banknote, Visa: CreditCard, BankTransfer: Building2 };
const ORDER_ICONS = { Delivery: ShoppingBag, InStore: Store };

function getInitialRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - 29);
  return { key: "last30Days", startDate: start.toISOString(), endDate: now.toISOString() };
}

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-elevated border border-border-primary rounded-lg px-3 py-2 shadow-[var(--shadow-elevated)]">
      <p className="text-xs text-text-muted mb-0.5">{payload[0].name}</p>
      <p className="text-sm font-semibold text-text-primary">{payload[0].value?.toLocaleString()}</p>
    </div>
  );
};

export default function PaymentMethodAnalytics() {
  const { t } = useTranslation("reports");
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(getInitialRange);

  const { data, isLoading, isError, refetch } = useSalesAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const methods = data?.salesByPaymentMethod || [];
  const peakHours = data?.peakHours || [];
  const orderTypes = data?.salesByOrderType || [];
  const totalRevenue = methods.reduce((sum, m) => sum + (m.totalRevenue || 0), 0);

  const handleDateRangeChange = useCallback(({ key, startDate, endDate }) => {
    setDateRange({ key, startDate, endDate });
  }, []);

  const pieData = methods.map((m) => ({
    name: t(`paymentMethods.${m.paymentMethod}`),
    value: m.totalRevenue || 0,
  }));

  const peakData = peakHours
    .sort((a, b) => a.hour - b.hour)
    .map((h) => ({
      hour: `${h.hour.toString().padStart(2, "0")}:00`,
      orders: h.totalOrders,
    }));

  return (
    <Layout>
      {/* Header */}
      <header className="shrink-0 bg-background-card border-b border-border-primary px-5 sm:px-8 py-5 animate-fadeIn">
        <div className="max-w-[1440px] mx-auto">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary-400 transition-colors mb-3">
            <ArrowLeft size={14} className="rtl:rotate-180" />
            {t("common.backToDashboard")}
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
                <Wallet size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary tracking-tight">{t("paymentMethods.pageTitle")}</h1>
                <p className="text-text-muted text-sm mt-0.5">{t("paymentMethods.pageSubtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DateRangePicker value={dateRange.key} onChange={handleDateRangeChange} />
              <button onClick={() => refetch()} disabled={isLoading} className="w-9 h-9 shrink-0 rounded-xl border border-border-primary bg-background-card flex items-center justify-center text-text-muted hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200 disabled:opacity-50">
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-5 sm:px-8 py-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border-primary bg-background-card p-6 h-[300px] animate-shimmer" />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-5"><AlertTriangle size={32} /></div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{t("common.loadError")}</h3>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="mt-3"><RefreshCw size={16} />{t("common.refresh")}</Button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && methods.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400/60 mb-5 animate-float"><BarChart3 size={32} /></div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">{t("paymentMethods.empty")}</h3>
              <p className="text-sm text-text-muted max-w-xs text-center">{t("paymentMethods.emptyDesc")}</p>
            </div>
          )}

          {/* Analytics Grid */}
          {!isLoading && !isError && methods.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Payment Method Pie Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
                  <h3 className="text-base font-semibold text-text-primary mb-5">{t("paymentMethods.byPaymentMethod")}</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-[180px] h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                            {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      {methods.map((m, i) => {
                        const Icon = METHOD_ICONS[m.paymentMethod] || CreditCard;
                        const pct = totalRevenue > 0 ? ((m.totalRevenue / totalRevenue) * 100).toFixed(1) : 0;
                        return (
                          <div key={m.paymentMethod} className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <Icon size={15} className="text-text-muted shrink-0" />
                            <span className="text-sm text-text-secondary flex-1">{t(`paymentMethods.${m.paymentMethod}`)}</span>
                            <span className="text-xs text-text-muted">{pct}%</span>
                            <span className="text-sm font-semibold text-text-primary">{m.totalRevenue?.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method Cards */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
                  <h3 className="text-base font-semibold text-text-primary mb-5">{t("paymentMethods.byPaymentMethod")}</h3>
                  <div className="space-y-3">
                    {methods.map((m, i) => {
                      const Icon = METHOD_ICONS[m.paymentMethod] || CreditCard;
                      const pct = totalRevenue > 0 ? ((m.totalRevenue / totalRevenue) * 100).toFixed(0) : 0;
                      return (
                        <div key={m.paymentMethod} className="p-3 rounded-xl bg-background-hover/50 border border-border-primary">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon size={16} className="text-text-muted" />
                              <span className="text-sm font-medium text-text-primary">{t(`paymentMethods.${m.paymentMethod}`)}</span>
                            </div>
                            <span className="text-sm font-bold text-text-primary">{m.totalRevenue?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                            <span>{m.totalOrders} {t("paymentMethods.orders")}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-background-hover overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                              className="h-full rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Peak Hours */}
                {peakData.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
                    <h3 className="text-base font-semibold text-text-primary mb-1">{t("paymentMethods.peakHours")}</h3>
                    <p className="text-xs text-text-muted mb-5">{t("paymentMethods.peakHoursDesc")}</p>
                    <div className="w-full h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={peakData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                          <XAxis dataKey="hour" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.05)" }} />
                          <Bar dataKey="orders" name={t("paymentMethods.totalOrders")} fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {/* Order Types */}
                {orderTypes.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="rounded-2xl border border-border-primary bg-background-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
                    <h3 className="text-base font-semibold text-text-primary mb-5">{t("paymentMethods.byOrderType")}</h3>
                    <div className="space-y-4">
                      {orderTypes.map((ot) => {
                        const Icon = ORDER_ICONS[ot.orderType] || ShoppingBag;
                        const otTotal = orderTypes.reduce((s, o) => s + (o.totalRevenue || 0), 0);
                        const pct = otTotal > 0 ? ((ot.totalRevenue / otTotal) * 100).toFixed(0) : 0;
                        return (
                          <div key={ot.orderType} className="p-4 rounded-xl bg-background-hover/50 border border-border-primary">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                  <Icon size={18} className="text-primary-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-text-primary">{t(`paymentMethods.${ot.orderType}`)}</p>
                                  <p className="text-xs text-text-muted">{ot.totalOrders} {t("paymentMethods.orders")}</p>
                                </div>
                              </div>
                              <div className="text-end">
                                <p className="text-sm font-bold text-text-primary">{ot.totalRevenue?.toLocaleString()}</p>
                                <p className="text-xs text-text-muted">{pct}%</p>
                              </div>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-background-hover overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                className="h-full rounded-full bg-primary-500" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
