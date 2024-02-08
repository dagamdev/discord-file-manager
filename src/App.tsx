import './App.css'
import './utils/socket'
import { useState } from 'react'
import Tooltip from './components/shared/tooltip/Tooltip'
import MoveFiles from './components/moveFiles/MoveFiles'
import NotificationsList from './components/shared/notifications/NotificationsList'
import ImageViewer from './components/shared/image/ImageViewer'
import GuildData from './components/guild/GuildData'
import MoveFilesProvider from './providers/MoveFilesProvider'

function App() {
  const [mode] = useState<'files' | 'guilds'>('files')

  return (
    <>
      {mode === 'files' ? 
        <MoveFilesProvider>
          <MoveFiles />
        </MoveFilesProvider> :
        <GuildData />
      }
      <NotificationsList />
      <ImageViewer />
      <Tooltip />
    </>
  )
}

export default App
