import { useState, useEffect, ChangeEvent } from 'react'
import { socket } from '../../utils/socket'
import { DiscordAttachment, DiscordChannel, DiscordMessage } from '../../types'
import DestinationChannel from './DestinationChannel'
import ManageMessage from './ManageMessage'
import { useDiscord } from '../../hooks/useDiscord'
import { useNotifications } from '../../contexts'
import { MoveFilesContext } from '../../contexts'
import { myApiFetch } from '../../utils/functions'

export default function MoveFiles(){
  const { createNotification } = useNotifications()
  const { getDestination, getChannel, getMessage } = useDiscord()
  const [formData, setFormData] = useState({
    destinationId: '', 
    channelId: '', 
    messageId: '',
    fileUrl: ''
  })
  const [destinationChannel, setDestinationChannel] = useState<DiscordChannel>()
  const [channel, setChannel] = useState<DiscordChannel>()
  const [message, setMessage] = useState<DiscordMessage>()

  useEffect(()=> {
    const { destinationId, channelId, messageId, fileUrl } = formData

    if(destinationId.length > 17 && (destinationChannel?.id != destinationId)){
      getDestination({destinationId, setDestination: setDestinationChannel}).then(success=> {
        if (success){
          createNotification({
            content: 'Destination channel loaded',
            type: 'INFO',
            duration: 16
          })
        }
      })
    }else if(destinationChannel && destinationChannel.id != destinationId) setDestinationChannel(undefined)

    if(channelId.length > 17){
      getChannel({channelId, setChannel})
    }else if(channel && channel.id != channelId) setChannel(undefined)

    if(message?.id != messageId && messageId.length > 17){
      getMessage({channelId, messageId, setMessage})
    }else if(message && message.id != messageId) setMessage(undefined)

    if (fileUrl) {
      // myApiFetch(`channels/1139624141100679178`, 'POST', {
      //   attachments: [
      //     {
      //       name: 'video.jpg',
      //       attachment: 'https://i.mart.moe/K1Vv7kwN0sC01Q'
      //     }
      //   ],
      // }).then(res => {
      //   console.log(res)
      // }).catch(e => console.error(e))
    }

  }, [formData])

  useEffect(()=> {
    const handleSendFiles = (message: DiscordMessage) => {
      // console.log(message.attachments)
      if(formData.messageId != message.id){
        setMessage(message)
        setFormData({
          destinationId: formData.destinationId,
          channelId: message.channelId,
          messageId: message.id,
          fileUrl: ''
        })
      }
    }

    const handleAddFiles = (attachments: DiscordAttachment[]) => {
      if (!message) return  createNotification({
        content: 'No hay información de ningun mensaje',
        type: 'ERROR',
        duration: 20
      })

      const totalAttachments = message.attachments.concat(attachments)

      if (totalAttachments.length > 10) return createNotification({
        content: 'Son mas de 10 archivos sumados',
        type: 'ERROR',
        duration: 20
      })

      setMessage({...message, attachments: totalAttachments})
      createNotification({
        content: `Se han sumando ${attachments.length} archivos, ahora son ${totalAttachments.length} archivos.`,
        type: 'INFO',
        duration: 20
      })
    }

    socket.on('sendFiles', handleSendFiles)
    socket.on('addFiles', handleAddFiles)
    
    return ()=> {
      socket.off('sendFiles', handleSendFiles)
      socket.off('addFiles', handleAddFiles)
    }
  })

  const handleChange = ({currentTarget}: ChangeEvent<HTMLInputElement>) => {
    setFormData(fd=> ({...fd, [currentTarget.name]: currentTarget.value}))
  }

  return (
    <>
      <form className='moveFiles-form'>
        <label htmlFor="destinationId">
          Destination channel ID
          <input onChange={handleChange} type="number" id='destinationId' name='destinationId' value={formData.destinationId} />
        </label>
        <label htmlFor="channelId">
          Channel ID
          <input onChange={handleChange} type="number" id='channelId' name='channelId' value={formData.channelId} />
        </label>
        <label htmlFor="messageId">
          Message ID
          <input onChange={handleChange} type="number" id='messageId' name='messageId' value={formData.messageId} />
        </label>
        <label htmlFor="fileUrl">
          File url
          <input onChange={handleChange} type="url" id='fileUrl' name='fileUrl' value={formData.fileUrl} />
        </label>
      </form>

      <section className='section'>
        <MoveFilesContext.Provider value={{
          channel,
          setChannel,
          message,
          setMessage
        }}>
          {destinationChannel && <DestinationChannel channel={destinationChannel} />}
          {channel && <ManageMessage 
            destinationChannel={destinationChannel?.type == 0 ? destinationChannel : undefined} 
            setDestination={setDestinationChannel}
            />}
        </MoveFilesContext.Provider>
      </section>
    </>
  )
}