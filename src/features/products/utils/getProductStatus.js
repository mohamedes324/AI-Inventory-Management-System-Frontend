/**
 * @function getProductStatus
 * @description Determines product stock status based on quantity and reorder point.
 * Returns a status key and semantic color for consistent UI rendering.
 *
 * @param {number} stockQuantity - Current stock count
 * @param {number} reorderPoint - Threshold for low stock warning
 * @returns {{ key: string, color: string }}
 */
export const getProductStatus = (stockQuantity, reorderPoint) => {
  if (stockQuantity === 0) {
    return { key: "outOfStock", color: "red" };
  }
  if (stockQuantity <= reorderPoint) {
    return { key: "lowStock", color: "yellow" };
  }
  return { key: "inStock", color: "green" };
};

/**
 * Product status color mappings for Tailwind classes.
 * Uses direct color tokens instead of compound tokens (bg-error/10 etc.)
 * to ensure proper rendering on the dark theme.
 */
export const PRODUCT_STATUS_STYLES = {
  red:    "bg-error/15 text-error border-error/30",
  yellow: "bg-warning/15 text-warning border-warning/30",
  green:  "bg-primary-500/15 text-primary-400 border-primary-500/30",
};
