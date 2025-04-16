import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { StoreProvider } from './Store/Store.jsx'
import { store } from './Store/Store.jsx'
import { initializeSocket } from './Store/SocketSlice.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
)
