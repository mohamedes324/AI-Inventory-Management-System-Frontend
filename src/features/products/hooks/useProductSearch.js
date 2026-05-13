import { useState, useEffect, useRef, useCallback } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { searchProducts } from "../api/searchProducts";

/**
 * @hook useProductSearch
 * @description Debounced search hook for products.
 * - Provides dropdown `suggestions` (capped list for autocomplete)
 * - Provides `results` (full search response for table display)
 * - Fires API call on every debounced keystroke
 * - `onResults` callback lets the parent update its table data
 *
 * @param {Object} opts
 * @param {number} opts.debounceMs - Debounce delay (default 300)
 * @param {Function} opts.onResults - Called with search results array
 * @param {Function} opts.onClear - Called when search is cleared
 */
export const useProductSearch = ({
  debounceMs = 300,
  onResults,
  onClear,
} = {}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { execute, loading: searching } = useRequest(searchProducts);
  const timerRef = useRef(null);
  const onResultsRef = useRef(onResults);
  const onClearRef = useRef(onClear);
  onResultsRef.current = onResults;
  onClearRef.current = onClear;

  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    if (timerRef.current) clearTimeout(timerRef.current);
    onClearRef.current?.();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      // When query is emptied, tell parent to restore original list
      onClearRef.current?.();
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const results = await execute(query.trim());
        const data = Array.isArray(results) ? results : [];
        // Suggestions for dropdown (max 6 items)
        setSuggestions(data.slice(0, 6));
        // Full results for table
        onResultsRef.current?.(data);
      } catch {
        setSuggestions([]);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs]);

  return { query, setQuery, suggestions, searching, clearSearch };
};
