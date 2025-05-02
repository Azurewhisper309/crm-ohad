import React from "react";
import { msalConfig } from "./authConfig";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Listen for sign-in events and set the active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload && event.payload.account) {
        const account = event.payload.account;
        if (account) {
            msalInstance.setActiveAccount(account);
        }
    }
});


const AuthPro = ({ children }) => {
        return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
    };
    
    export default AuthPro;



