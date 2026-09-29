import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './auth/msalConfig'
import { store } from './store/store'
import App from './App'
import './index.css'

msalInstance
  .initialize()
  .then(() => {
    return msalInstance.handleRedirectPromise().then((response) => {
      if (response?.account) {
        msalInstance.setActiveAccount(response.account)
      } else if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0])
      }
    })
  })
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Provider store={store}>
          <MsalProvider instance={msalInstance}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MsalProvider>
        </Provider>
      </StrictMode>,
    )
  })
  .catch((error) => {
    console.error('Failed to initialize MSAL application:', error)
  })
