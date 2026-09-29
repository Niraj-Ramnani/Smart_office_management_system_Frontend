import { InteractionRequiredAuthError } from '@azure/msal-browser'
import type { AccountInfo } from '@azure/msal-browser'
import { msalInstance, loginRequest, tokenRequest } from '../auth/msalConfig'

export const getActiveAccount = (): AccountInfo | null => {
  const active = msalInstance.getActiveAccount()
  if (active) {
    return active
  }
  const accounts = msalInstance.getAllAccounts()
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0])
    return accounts[0]
  }
  return null
}

export const getAccessToken = async (): Promise<string | null> => {
  const account = getActiveAccount()
  if (!account) {
    return null
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...tokenRequest,
      account,
    })
    return response.accessToken
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      try {
        const response = await msalInstance.acquireTokenPopup(tokenRequest)
        return response.accessToken
      } catch (interactiveError) {
        console.error('Interactive token acquisition failed:', interactiveError)
        return null
      }
    }
    console.error('Silent token acquisition failed:', error)
    return null
  }
}

export const loginWithMicrosoft = async (usePopup = false): Promise<void> => {
  if (usePopup) {
    const result = await msalInstance.loginPopup(loginRequest)
    if (result.account) {
      msalInstance.setActiveAccount(result.account)
    }
  } else {
    await msalInstance.loginRedirect(loginRequest)
  }
}

export const logoutMicrosoft = async (): Promise<void> => {
  const account = getActiveAccount()
  await msalInstance.logoutRedirect({
    account: account || undefined,
  })
}
