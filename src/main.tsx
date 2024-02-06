// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/badges.css'
import './styles/move-files.css'
import TooltipProvider from './providers/TooltipProvider.tsx'
import NotificationProvider from './providers/NotificationsProvider.tsx'
import ImageProvider from './providers/ImageProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <NotificationProvider>
      <TooltipProvider>
        <ImageProvider>
          <App />
        </ImageProvider>
      </TooltipProvider>
    </NotificationProvider>
  // </React.StrictMode>,
)
