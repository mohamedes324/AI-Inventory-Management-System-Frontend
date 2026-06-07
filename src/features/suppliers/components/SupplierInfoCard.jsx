/**
 * @component SupplierInfoCard
 * @description Compact card displaying supplier information on the details page.
 * Shows Name, Phone, Address, Contact Info, Total Rating, Rating Count, Average Rating.
 */
import { useTranslation } from "react-i18next";
import { Truck, Phone, MapPin, Mail, Star, Users } from "lucide-react";
import StarRating from "./StarRating";

function InfoRow({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-border-primary/20 last:border-b-0">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium leading-none">{label}</p>
        <p className="text-[13px] font-semibold text-text-primary mt-0.5 leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function SupplierInfoCard({ supplier }) {
  const { t } = useTranslation("suppliers");
  if (!supplier) return null;

  const name = supplier.supplierName || supplier.name || "—";

  return (
    <div className="bg-background-card rounded-2xl border border-border-primary shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-border-primary/50">
        <h3 className="text-sm font-bold text-text-primary">{t("details.infoTitle")}</h3>
        <p className="text-[11px] text-text-muted mt-0.5">{t("details.infoSubtitle")}</p>
      </div>

      <div className="px-5 py-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <InfoRow
          icon={Truck}
          iconColor="bg-primary-500/10 text-primary-500"
          label={t("fields.name")}
          value={name}
        />
        <InfoRow
          icon={Phone}
          iconColor="bg-secondary-500/10 text-secondary-500"
          label={t("fields.phone")}
          value={supplier.phoneNumber || "—"}
        />
        <InfoRow
          icon={MapPin}
          iconColor="bg-warning/10 text-warning"
          label={t("fields.address")}
          value={supplier.address || "—"}
        />
        <InfoRow
          icon={Mail}
          iconColor="bg-info/10 text-info"
          label={t("fields.contact")}
          value={supplier.contactInfo || "—"}
        />
        <InfoRow
          icon={Star}
          iconColor="bg-warning/10 text-warning"
          label={t("details.totalRating")}
          value={supplier.totalRating ?? "—"}
        />
        <InfoRow
          icon={Users}
          iconColor="bg-primary-500/10 text-primary-500"
          label={t("details.ratingCount")}
          value={supplier.ratingCount ?? "—"}
        />

        {/* Average Rating with Stars */}
        <div className="flex items-center gap-2.5 py-2 sm:col-span-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-warning/10 text-warning">
            <Star size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium leading-none">
              {t("details.avgRating")}
            </p>
            <div className="mt-0.5">
              <StarRating rating={supplier.avgRating || 0} showValue />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
