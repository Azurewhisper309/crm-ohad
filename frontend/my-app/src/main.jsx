import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes.jsx";
import { CRMProvider } from "./CrmContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CRMProvider>
        <AppRoutes />
      </CRMProvider>
    </BrowserRouter>
  </React.StrictMode>
);
