/**
 * @component BatchesAccordion
 * @description Multi-open accordion for stock batches.
 * All batches collapsed by default. Users can open multiple batches
 * simultaneously for comparison.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Boxes } from "lucide-react";
import BatchCard from "./BatchCard";

export default function BatchesAccordion({ batches = [], loading = false }) {
  const { t } = useTranslation("stockBatches");
  // Multi-open: store a Set of open indices
  const [openIndices, setOpenIndices] = useState(new Set());

  const handleToggle = (idx) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-background-hover/60 animate-pulse border border-border-primary/30"
          />
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="text-center py-12">
        <Boxes size={36} className="text-text-muted mx-auto mb-3 opacity-40" />
        <p className="text-sm text-text-muted">{t("noBatches")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {batches.map((batch, idx) => (
        <BatchCard
          key={batch.id || idx}
          batch={batch}
          index={idx}
          isOpen={openIndices.has(idx)}
          onToggle={() => handleToggle(idx)}
        />
      ))}
    </div>
  );
}
