import { LogLevel, PublicClientApplication } from '@azure/msal-browser'
import type { Configuration, RedirectRequest, SilentRequest } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI
const postLogoutRedirectUri = import.meta.env.VITE_AZURE_POST_LOGOUT_REDIRECT_URI
export const apiScope = import.meta.env.VITE_AZURE_API_SCOPE || `api://${clientId}/access_as_user`

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return
        switch (level) {
          case LogLevel.Error:
            console.error('[MSAL]', message)
            break
          case LogLevel.Warning:
            console.warn('[MSAL]', message)
            break
          default:
            break
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
}

export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'email', apiScope],
}

export const tokenRequest: SilentRequest = {
  scopes: [apiScope],
}

export const msalInstance = new PublicClientApplication(msalConfig)
