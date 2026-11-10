import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { i18n } from './i18n'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element missing in index.html')

void i18n
  .whenReady()
  .catch(() => undefined)
  .then(() => {
    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
