import { useState, type ReactNode } from 'react'
import { MoveFilesContext } from "../contexts";
import type { DiscordChannel, DiscordMessage } from '../types';

export default function MoveFilesProvider ({ children }: { children: ReactNode }) {
  const [destinationChannel, setDestinationChannel] = useState<DiscordChannel>()
  const [messageDestination, setMessageDestination] = useState<DiscordMessage>()
  const [originChannel, setOriginChannel] = useState<DiscordChannel>()
  const [originMessage, setOriginMessage] = useState<DiscordMessage>()
  const [fileNumber, setFileNumber] = useState(0)

  return (
    <MoveFilesContext.Provider value={{
      destinationChannel,
      setDestinationChannel,
      messageDestination,
      setMessageDestination,
      originChannel,
      setOriginChannel,
      originMessage,
      setOriginMessage,
      fileNumber,
      setFileNumber
    }}>
      {children}
    </MoveFilesContext.Provider>
  )
}