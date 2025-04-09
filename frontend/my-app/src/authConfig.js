// 📁 frontend/src/authConfig.js
export const msalConfig = {
    auth: {
      clientId: import.meta.env.VITE_AZURE_CLIENT_ID,      // e.g. "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`, // e.g. "your-tenant-id"
      redirectUri: "/",                                     // Redirect back to home after login
    },
    cache: {
      cacheLocation: "localStorage", // or "sessionStorage"
      storeAuthStateInCookie: false,
    },
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "email"], // ✅ Basic ID token claims
  };
  