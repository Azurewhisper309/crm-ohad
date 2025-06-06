export const msalConfig={
  auth:{
      clientId:import.meta.env.VITE_CLIENT_ID,
      authority:import.meta.env.VITE_AUTHORITY,
      redirectUri:import.meta.env.VITE_REDIRECT_URI,
  },
  cache:{
      cacheLocation:"localStorage",
      storeAuthStateInCookie:false,
  },

};
export const loginRequest = {
  scopes: ["openid", "profile", "email", "User.Read","User.ReadBasic.All"]
};