/**
 * @module products
 * @description Barrel export for the products feature.
 * Includes product pages, batch components, and utilities.
 */

// Pages
export { default as Products } from "./pages/Products";
export { default as ProductDetails } from "./pages/ProductDetails";
export { default as StockBatchesPage } from "./pages/StockBatchesPage";

// Product Components
export { default as ProductTable } from "./components/ProductTable";
export { default as ProductSearchInput } from "./components/ProductSearchInput";
export { default as ProductStatusBadge } from "./components/ProductStatusBadge";
export { default as ProductInfoCard } from "./components/ProductInfoCard";

// Batch Components
export { default as BatchCard } from "./components/BatchCard";
export { default as BatchStatusBadge } from "./components/BatchStatusBadge";
export { default as BatchesAccordion } from "./components/BatchesAccordion";
export { default as BatchesPreview } from "./components/BatchesPreview";

// Utilities
export { formatDate } from "./utils/formatDate";
export { getProductStatus } from "./utils/getProductStatus";
export { getBatchStatus } from "./utils/getBatchStatus";
