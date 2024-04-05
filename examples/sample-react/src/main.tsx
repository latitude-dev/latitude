import React from 'react'
import ReactDOM from 'react-dom/client'
import Example from './Example.tsx'
import './index.css'
import { LatitudeProvider } from '@latitude-data/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LatitudeProvider apiConfig={{ host: import.meta.env.VITE_LATITUDE_HOST }}>
      <Example />
    </LatitudeProvider>
  </React.StrictMode>,
)
