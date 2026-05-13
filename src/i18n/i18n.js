import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAuth from "@/i18n/en/auth.json";
import arAuth from "@/i18n/ar/auth.json";
import enIsAuthLoading from "@/i18n/en/auth.json";
import arIsAuthLoading from "@/i18n/ar/auth.json";
import enOnboarding from "@/i18n/en/onboarding.json";
import arOnboarding from "@/i18n/ar/onboarding.json";
import enAdmin from "@/i18n/en/user-management.json";
import arAdmin from "@/i18n/ar/user-management.json";
import enCategories from "@/i18n/en/categories.json";
import arCategories from "@/i18n/ar/categories.json";
import enProducts from "@/i18n/en/products.json";
import arProducts from "@/i18n/ar/products.json";
import enStockBatches from "@/i18n/en/stock-batches.json";
import arStockBatches from "@/i18n/ar/stock-batches.json";
import enSuppliers from "@/i18n/en/suppliers.json";
import arSuppliers from "@/i18n/ar/suppliers.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth: enAuth,
        onboarding: enOnboarding,
        admin: enAdmin,
        isAuthLoading: enIsAuthLoading,
        categories: enCategories,
        products: enProducts,
        stockBatches: enStockBatches,
        suppliers: enSuppliers,
      },
      ar: {
        auth: arAuth,
        onboarding: arOnboarding,
        admin: arAdmin,
        isAuthLoading: arIsAuthLoading,
        categories: arCategories,
        products: arProducts,
        stockBatches: arStockBatches,
        suppliers: arSuppliers,
      },
    },
    lng: localStorage.getItem("lang") || "ar",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// 👇 خليهم بعد الـ init
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";

  // 👇 نخزن اللغة
  localStorage.setItem("lang", lng);
});

// 👇 default direction
document.documentElement.dir =
  i18n.language === "ar" ? "rtl" : "ltr";

export default i18n;