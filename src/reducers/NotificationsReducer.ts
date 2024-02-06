import { uuidGenerator } from "../utils/functions"
import { Notification } from "../types"

export interface NotificationsAction {
  type: 'CREATE' | 'DELETE',
  payload: {
    id?: string
    data?: {
      type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING'
      content: string
      duration?: number
    }
  }
}

export function notificationsReducer(state: Notification[], action: NotificationsAction){
  const { type, payload } = action

  switch (type) {
    case 'CREATE': {
      if(!payload.data) return state
      const newState = [...state, {id: uuidGenerator(), ...payload.data}]

      return newState
    } 

    case 'DELETE': {
      return payload.id ? state.filter(f=> f.id != payload.id) : state
    }
  
    default:
      return state
  }
}