import { useState, useEffect, ChangeEvent } from 'react'
import { socket } from '../../utils/socket'
import { DiscordChannel, DiscordMessage } from '../../types'
import { useNotifications } from '../../contexts'
import { MoveFilesContext } from '../../contexts'
import { customSecondFetch, customPrincipalFetch } from '../../utils/functions'
import Container from './Container'

export default function MoveFiles(){
  const { createNotification } = useNotifications()
  const [formData, setFormData] = useState({
    originId: '', 
    originMessageId: '',
    destinationId: '',
    fileUrl: ''
  })
  const [destinationChannel, setDestinationChannel] = useState<DiscordChannel>()
  const [lastMessageDestination, setLastMessageDestination] = useState<DiscordMessage>()
  const [originChannel, setOriginChannel] = useState<DiscordChannel>()
  const [originMessage, setOriginMessage] = useState<DiscordMessage>()

  useEffect(()=> {
    const { originId, originMessageId, destinationId, fileUrl } = formData
    
    if (originId.length > 17){
      customSecondFetch<DiscordChannel>(`channels/${originId}`).then(res => {
        if (res.id !== undefined) setOriginChannel(res)
      }).catch(e => {
        console.error(e)
      })
    } else if(originChannel && originChannel.id !== originId) setOriginChannel(undefined)

    if (originId && originMessageId.length > 17){
      customSecondFetch<DiscordMessage[]>(`channels/${originId}/messages?around=${originMessageId}&limit=1`).then(res => {
        if (res.length !== 0) {
          const message = res.find(f => f.id === originMessageId)
          
          if (message) setOriginMessage(message)
        }
      }).catch(e => {
        console.error(e)
      })
    } else if(originMessage && originMessage.id !== originMessageId) setOriginChannel(undefined)

    if (destinationId.length > 17){
      customPrincipalFetch<DiscordChannel>(`channels/${destinationId}`).then(res => {
        if (res.id !== undefined) {
          setDestinationChannel(res)
          if (res.last_message_id) {
            customPrincipalFetch<DiscordMessage[]>(`channels/${destinationId}/messages?limit=2`).then(messages => {
              if (messages.length !== 0) {
                const message = messages[0]
                setLastMessageDestination(message)
              } else {
                createNotification({
                  type: 'INFO',
                  content: 'El canal de destino no contiene mensajes',
                  duration: 30
                })
              }
            }).catch(e => {
              console.error(e)
            })

          } else {
            createNotification({
              type: 'WARNING',
              content: 'No hay mensajes en el canal de destino',
              duration: 30
            })
            setLastMessageDestination(undefined)
          }
        }
      }).catch(e => {
        console.error(e)
      })
    } else if (destinationChannel && destinationChannel.id !== destinationId) {
      setLastMessageDestination(undefined)
      setDestinationChannel(undefined)
    }

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
    const handleSendMessage = (message: {
      id: string
      channelId: string
    }) => {
      console.log(message)
      if(formData.originMessageId !== message.id){
        setFormData(value => ({
          ...value,
          originId: message.channelId,
          originMessageId: message.id,
        }))
      }
    }

    const handleAddFiles = (message: {
      id: string
      channelId: string
    }) => {
      if (!originMessage) return  createNotification({
        content: 'No hay información de ningun mensaje',
        type: 'ERROR',
        duration: 20
      })

      customSecondFetch<DiscordMessage[]>(`channels/${message.channelId}/messages?around=${message.id}&limit=1`).then(res => {
        if (res.length !== 0) {
          const messageFiles = res.find(f => f.id === message.id)?.attachments
          
          if (messageFiles !== undefined && messageFiles.length !== 0) {
            const totalAttachments = originMessage.attachments.concat(messageFiles)

            if (totalAttachments.length > 10) return createNotification({
              content: 'Son mas de 10 archivos sumados',
              type: 'ERROR',
              duration: 20
            })
      
            setOriginMessage({...originMessage, attachments: totalAttachments})
            createNotification({
              content: `Se han sumando ${messageFiles.length} archivos, ahora son ${totalAttachments.length} archivos.`,
              type: 'INFO',
              duration: 20
            })
          }
        }
      }).catch(e => {
        console.error(e)
      })
    }

    socket.on('sendMessage', handleSendMessage)
    socket.on('addFiles', handleAddFiles)
    
    return ()=> {
      socket.off('sendMessage', handleSendMessage)
      socket.off('addFiles', handleAddFiles)
    }
  })

  const handleChange = ({currentTarget}: ChangeEvent<HTMLInputElement>) => {
    setFormData(fd=> ({
      ...fd, [currentTarget.name]: currentTarget.value
    }))
  }

  return (
    <>
      <form className='moveFiles-form'>
        <label htmlFor="originId">
          Origin channel ID
          <input onChange={handleChange} type="number" id='originId' name='originId' value={formData.originId} />
        </label>
        <label htmlFor="originMessageId">
          Message ID
          <input onChange={handleChange} type="number" id='originMessageId' name='originMessageId' value={formData.originMessageId} />
        </label>
        <label htmlFor="destinationId">
          Destination channel ID
          <input onChange={handleChange} type="number" id='destinationId' name='destinationId' value={formData.destinationId} />
        </label>
        <label htmlFor="fileUrl">
          File url
          <input onChange={handleChange} type="url" id='fileUrl' name='fileUrl' value={formData.fileUrl} />
        </label>
      </form>

      <section className='section'>
        <MoveFilesContext.Provider value={{
          destinationChannel,
          setDestinationChannel,
          messageDestination: lastMessageDestination,
          setMessageDestination: setLastMessageDestination,
          originChannel,
          setOriginChannel,
          originMessage,
          setOriginMessage
        }}>
          {destinationChannel && <Container
            title='Destination channel'
            channel={destinationChannel}
          />}
          {originChannel && <Container
            title='Target message and channel'
            channel={originChannel}
            manage
          />}

          {/* {destinationChannel && <DestinationChannel channel={destinationChannel} />} */}
          {/* {channel && <ManageMessage 
            destinationChannel={destinationChannel?.type == 0 ? destinationChannel : undefined} 
            setDestination={setDestinationChannel}
            />} */}
        </MoveFilesContext.Provider>
      </section>
    </>
  )
}