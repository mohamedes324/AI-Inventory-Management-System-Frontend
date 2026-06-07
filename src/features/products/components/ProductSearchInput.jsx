/**
 * @component ProductSearchInput
 * @description Autocomplete search input with dropdown suggestions.
 * Debounced API calls update both the dropdown AND the parent table.
 * Each suggestion shows product name, SKU, and a status dot.
 *
 * When `showAddProduct` is true and no results are found,
 * shows a "+ Add Product" option that triggers `onAddProduct`.
 */
import { useState, useRef, useEffect } from "react";
import { Search, X, Package, Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProductSearch } from "../hooks/useProductSearch";
import { getProductStatus } from "../utils/getProductStatus";

export default function ProductSearchInput({
  onSelect,
  onResults,
  onClear,
  className = "",
  showAddProduct = false,
  onAddProduct,
}) {
  const { t } = useTranslation("products");
  const { query, setQuery, suggestions, searching, clearSearch } = useProductSearch({
    debounceMs: 300,
    onResults,
    onClear,
  });
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasQuery = query.trim().length > 0;
  const noResults = !searching && hasQuery && suggestions.length === 0;
  const showDropdown =
    isFocused &&
    hasQuery &&
    (suggestions.length > 0 || searching || (noResults && showAddProduct));

  const handleSelect = (product) => {
    setIsFocused(false);
    clearSearch();
    onSelect?.(product);
  };

  /** Status dot color map — uses direct palette tokens */
  const DOT_COLORS = {
    red: "bg-error",
    yellow: "bg-warning",
    green: "bg-primary-400",
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10">
        {searching ? (
          <Loader2 size={18} className="animate-spin text-primary-500" />
        ) : (
          <Search size={18} />
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={t("searchPlaceholder")}
        className="
          w-full rounded-xl border border-border-primary bg-background-input
          pl-11 pr-10 py-2.5 outline-none text-sm text-text-primary
          placeholder:text-text-muted
          transition-all duration-200
          focus:border-border-focus focus:ring-2 focus:ring-primary-500/20
        "
      />

      {/* Clear */}
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-text-muted hover:text-text-primary transition-colors
            p-0.5 rounded-full hover:bg-background-hover
          "
        >
          <X size={16} />
        </button>
      )}

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div className="
          absolute top-full left-0 right-0 mt-2 z-50
          bg-background-elevated/95 backdrop-blur-xl
          border border-border-secondary rounded-2xl
          shadow-[var(--shadow-elevated)] overflow-hidden
          animate-fadeIn
        ">
          <div className="max-h-[320px] overflow-y-auto py-2">
            {searching && suggestions.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-text-muted">
                <Loader2 size={16} className="animate-spin" />
                {t("searching")}
              </div>
            ) : (
              <>
                {suggestions.map((product) => {
                  const status = getProductStatus(product.stockQuantity, product.reorderPoint);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelect(product)}
                      className="
                        w-full flex items-center gap-3 px-4 py-3 text-left
                        transition-all duration-200
                        hover:bg-background-hover
                        focus:bg-background-hover focus:outline-none
                        group
                      "
                    >
                      {/* Product icon */}
                      <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Package size={16} className="text-primary-500" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate group-hover:text-primary-500 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-text-muted font-mono mt-0.5">
                          {product.sku}
                        </p>
                      </div>

                      {/* Status dot */}
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT_COLORS[status.color]}`} />
                    </button>
                  );
                })}

                {/* "+ Add Product" option when no results and showAddProduct is enabled */}
                {noResults && showAddProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsFocused(false);
                      onAddProduct?.();
                    }}
                    className="
                      w-full flex items-center gap-3 px-4 py-3 text-left
                      transition-all duration-200
                      hover:bg-primary-500/10
                      focus:bg-primary-500/10 focus:outline-none
                      group border-t border-border-primary/30
                    "
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary-500/15 border border-primary-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Plus size={16} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary-500 group-hover:text-primary-600 transition-colors">
                        {t("addProduct", "+ Add Product")}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {t("addProductHint", "Create a new product")}
                      </p>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
