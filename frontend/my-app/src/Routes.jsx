import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CRMContext } from "./CrmContext";

import Login from "./Login";
import UserFormPage from "./UserFormPage";
import Dashboard from "./Dashboard";
import EditForm from "./EditForm";
import RecoveryPage from "./RecoveryPage";
import KingScreen from "./KingScreen";

const AppRoutes = () => {
  const { role, token } = useContext(CRMContext);

  if (!token) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* ✅ Accessible by authenticated users */}
      <Route path="/" element={<UserFormPage />} />
      <Route path="/edit/:id" element={<EditForm />} />

      {/* ✅ Admin-only routes */}
      {role === "admin" && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recovery" element={<RecoveryPage />} />
          <Route path="/king" element={<KingScreen />} />
        </>
      )}

      {/* 🔁 Fallback to user homepage if no match */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
