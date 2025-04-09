import React, { createContext, useState, useEffect } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig, loginRequest } from "./authConfig";
import { jwtDecode } from "jwt-decode";

export const CRMContext = createContext();

const msalInstance = new PublicClientApplication(msalConfig);

export const CRMProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        try {
          const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const decoded = jwtDecode(response.idToken);
          setToken(response.idToken);
          setUser(decoded.name || decoded.preferred_username);
          setRole(decoded.roles?.[0] || null); // If multiple roles, use the first
        } catch (err) {
          console.error("Silent token acquisition failed:", err);
        }
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      const idToken = response.idToken;
      const decoded = jwtDecode(idToken);
      setUser(decoded.name || decoded.preferred_username);
      setToken(idToken);
      setRole(decoded.roles?.[0] || null);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    msalInstance.logoutPopup();
    setUser(null);
    setToken(null);
    setRole(null);
  };

  return (
    <CRMContext.Provider
      value={{
        user,
        role,
        token,
        login,
        logout,
        forms,
        setForms,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};
