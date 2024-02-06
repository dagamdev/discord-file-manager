import { createContext, useContext } from 'react'
import type { DiscordChannel, DiscordMessage, StateFunction } from '../types'

interface MoveFilesContextData {
  channel?: DiscordChannel
  setChannel: StateFunction<DiscordChannel | undefined>
  message?: DiscordMessage
  setMessage: StateFunction<DiscordMessage | undefined>
}

export const MoveFilesContext = createContext<MoveFilesContextData | undefined>(undefined)

export function useMoveFiles() {
  return useContext(MoveFilesContext) as MoveFilesContextData
}