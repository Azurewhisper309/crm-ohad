import React from "react";
import AppRoutes from "./Routes";
import { CRMProvider } from "./CrmContext";

const App = () => {
  return (
    <CRMProvider>
      <AppRoutes />
    </CRMProvider>
  );
};

export default App;
