import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/shared/routes/ProtectedRoute";
import { routeConfig } from "@/shared/routes/routeConfig";

import Login from "@/features/auth/pages/Login";
import RedirectPage from "@/features/auth/pages/RedirectPage";
import PublicRoute from "../../shared/components/PublicRoute";


export default function AppRouter() {

  
  // console.log(routeConfig)
  return (
    
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {routeConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute roles={route.roles} pageStatus={route.status}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* 🔁 redirect */}
        <Route path="/redirect" element={<RedirectPage />} />
        {/* 🔁 Default */}
        <Route path="/" element={<Navigate to="/redirect" />} />
      </Routes>
    </BrowserRouter>
  );
}
