import './App.css'
import './utils/socket'
import Tooltip from './components/shared/tooltip/Tooltip'
import MoveFiles from './components/moveFiles/MoveFiles'
import NotificationsList from './components/shared/notifications/NotificationsList'
import ImageViewer from './components/shared/image/ImageViewer'
import GuildData from './components/guild/GuildData'

function App() {

  return (
    <>
      {true ? 
        <MoveFiles /> :
        <GuildData />
      }
      <NotificationsList />
      <ImageViewer />
      <Tooltip />
    </>
  )
}

export default App
