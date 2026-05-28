import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { ConfirmProvider } from './context/ConfirmContext'
import AccessibilityPanel from './components/AccessibilityPanel'
import ShortcutsHelp from './components/ShortcutsHelp'
import './styles/tokens.css'
import './styles/a11y.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <ConfirmProvider>
          <AuthProvider>
            <App />
            <AccessibilityPanel />
            <ShortcutsHelp />
          </AuthProvider>
        </ConfirmProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
