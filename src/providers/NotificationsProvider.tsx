import { useReducer, useEffect, ReactNode } from 'react'
import { NotificationsContext } from "../contexts";
import { NotificationsAction, notificationsReducer } from '../reducers'

export default function NotificationProvider({children}: {children: ReactNode}){
  const [notifications, notificationsDispatch] = useReducer(notificationsReducer, [])

  const createNotification = (data: NotificationsAction['payload']['data']) => {
    notificationsDispatch({
      type: 'CREATE',
      payload: {
        data
      }
    })
  }

  const deleteNotification = (notificationId: string) => {
    notificationsDispatch({
      type: 'DELETE',
      payload: {
        id: notificationId
      }
    })
  }

  useEffect(()=> {
    const lastNotification = notifications[notifications.length-1]
    if(lastNotification && lastNotification.duration){
      setTimeout(()=> {
        deleteNotification(lastNotification.id)
      }, lastNotification.duration*1000)
    }
  }, [notifications])
  
  return (
    <NotificationsContext.Provider value={{
      notifications,
      createNotification, 
      deleteNotification
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}