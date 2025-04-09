import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const Login = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance
      .loginRedirect(loginRequest)
      .catch((error) => console.error("Login failed:", error));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to CRM</h2>
      <p>Please sign in with your Microsoft account</p>
      <button onClick={handleLogin}>Sign in with Microsoft</button>
    </div>
  );
};

export default Login;
