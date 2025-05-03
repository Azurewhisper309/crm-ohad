import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const Login = () => {
  const { instance } = useMsal();
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    try {
      instance.loginRedirect(loginRequest).then(() => {
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          setAuthenticated(true);
        }
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        const tokenResponse = await instance.acquireTokenSilent(loginRequest).catch(() => null);
        if (tokenResponse) {
          const token = tokenResponse.accessToken;
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp > currentTime) {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
    };

    checkAuthentication();
  }, [instance]);

  return (
    <>
      {!authenticated ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Welcome to CRM</h2>
          <p>Please sign in with your Microsoft account</p>
          <button onClick={handleLogin}>Sign in with Microsoft</button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Welcome to CRM</h2>
          <p>You are already signed in!</p>
        </div>
      )}
    </>
  );
};

export default Login;
