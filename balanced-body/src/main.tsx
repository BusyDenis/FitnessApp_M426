import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { StoreProvider } from './state/store'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <StoreProvider>
                <App />
            </StoreProvider>
        </BrowserRouter>
    </StrictMode>
)
