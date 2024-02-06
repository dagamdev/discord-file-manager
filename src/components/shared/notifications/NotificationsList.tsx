import './notifications-list.css'

import { useNotifications } from "../../../contexts"
import { BsX } from 'react-icons/bs'

const EMOJIS_TYPE = {
  'ERROR': '❌',
  'INFO': 'ℹ️',
  'SUCCESS': '✅',
  'WARNING': '⚠️'
}

export default function NotificationsList(){
  const { notifications, deleteNotification } = useNotifications()
  
  return (
    <>
      {Boolean(notifications.length) && 
        <ul className='notifications-list'>
          {notifications.map(n=> <li className='notifications-element' key={n.id}>
            <span className='notification-simbol' >{EMOJIS_TYPE[n.type]}</span>
            <p>{n.content}</p>
            <BsX onClick={()=> deleteNotification(n.id)} className='notification-close' />
            {n.duration && <div className={`notification-timeBarr ${n.type}`} style={{animationDuration: n.duration+'s'}} />}
          </li>)} 
        </ul>
      }
    </>
  )
}