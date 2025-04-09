// 📁 frontend/src/useAuthenticatedAxios.js
import { useMsal } from "@azure/msal-react";
import { useEffect, useMemo } from "react";
import axios from "axios";
import { loginRequest } from "./authConfig";

const useAuthenticatedAxios = () => {
  const { instance, accounts } = useMsal();

  const axiosInstance = useMemo(() => {
    const axiosClient = axios.create({
      baseURL: "http://localhost:3000", // Update as needed
    });

    axiosClient.interceptors.request.use(async (config) => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          if (!response || !response.accessToken) {
            throw new Error("No access token retrieved.");
          }

          config.headers.Authorization = `Bearer ${response.accessToken}`;
        } catch (err) {
          console.error("Token acquisition failed", err);
          await instance.loginRedirect(loginRequest); // fallback to login
        }
      }

      return config;
    });

    return axiosClient;
  }, [instance, accounts]);

  return axiosInstance;
};

export default useAuthenticatedAxios;
