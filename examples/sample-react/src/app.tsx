import React from 'react'
import ReactDOM from 'react-dom/client'
import { defineCustomElements } from '@latitude-data/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { LatitudeProvider } from '@latitude-data/react'

import { routeTree } from './routeTree.gen'
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Define the custom elements from Latitude React
defineCustomElements()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LatitudeProvider apiConfig={{ host: import.meta.env.VITE_LATITUDE_HOST }}>
      <RouterProvider router={router} />
    </LatitudeProvider>
  </React.StrictMode>,
)
