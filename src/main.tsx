// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@/store/store'
import App from './App'
import './index.css'

function Fallback() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <p>Try refreshing the page.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
)
