import React from "react";
import ReactDOM from "react-dom/client";
import AuthPro from "./auth-pro.jsx";
import RootApp from "./Appi.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <AuthPro>
      <RootApp/>
    </AuthPro>
  </React.StrictMode>
);