import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './api/queryClient'
import { router } from './routes'
import { store } from './store/configureStore'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--text-muted)'
      }}>
        Loading...
      </div>
    }>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </Suspense>
  </StrictMode>,
)
