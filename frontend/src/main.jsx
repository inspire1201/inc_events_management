import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // Import the AuthProvider
import { LanguageProvider } from './context/LanguageContext.jsx'
import { DateTimeProvider } from './context/DateTimeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DateTimeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </DateTimeProvider>
    </AuthProvider>
  </StrictMode>,
)