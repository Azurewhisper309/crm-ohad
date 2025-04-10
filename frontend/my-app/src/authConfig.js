export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID", // ✅ from Azure App Registration
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:5173", // ✅ match frontend port
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

  
  export const loginRequest = {
    scopes: ["openid", "profile", "email"], // ✅ Basic ID token claims
  };
  