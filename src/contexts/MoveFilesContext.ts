import { createContext, useContext } from 'react'
import type { DiscordChannel, DiscordMessage, StateFunction } from '../types'

interface MoveFilesContextData {
  originChannel?: DiscordChannel
  setOriginChannel: StateFunction<DiscordChannel | undefined>
  originMessage?: DiscordMessage
  setOriginMessage: StateFunction<DiscordMessage | undefined>
  destinationChannel?: DiscordChannel
  setDestinationChannel: StateFunction<DiscordChannel | undefined>
  messageDestination?: DiscordMessage
  setMessageDestination: StateFunction<DiscordMessage | undefined>
  fileNumber: number
  setFileNumber: StateFunction<number>
}

export const MoveFilesContext = createContext<MoveFilesContextData | undefined>(undefined)

export function useMoveFiles() {
  return useContext(MoveFilesContext) as MoveFilesContextData
}