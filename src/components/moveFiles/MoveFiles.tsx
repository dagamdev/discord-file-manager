import { useState, useEffect, ChangeEvent } from 'react'
import { socket } from '../../utils/socket'
import { DiscordChannel, DiscordMessage } from '../../types'
import { useMoveFiles, useNotifications } from '../../contexts'
import { customSecondFetch, customPrincipalFetch } from '../../utils/functions'
import Container from './Container'
import packageData from '../../../package.json'
import GetFileByUrl from './GetFileByUrl'

export default function MoveFiles(){
  const {
    destinationChannel,
    setDestinationChannel,
    setMessageDestination,
    originChannel,
    setOriginChannel,
    originMessage,
    setOriginMessage
  } = useMoveFiles()
  const { createNotification } = useNotifications()
  const [formData, setFormData] = useState({
    originId: '', 
    originMessageId: '',
    destinationId: ''
  })

  useEffect(()=> {
    const { originId, originMessageId, destinationId } = formData
    
    if (originId.length > 17 && originId !== originChannel?.id){
      customSecondFetch<DiscordChannel>(`channels/${originId}`).then(res => {
        if (res.id !== undefined) setOriginChannel(res)
      }).catch(e => {
        console.error(e)
      })
    } else if(originChannel && originChannel.id !== originId) setOriginChannel(undefined)

    if (originId && originMessageId.length > 17 && originMessageId !== originMessage?.id){
      customSecondFetch<DiscordMessage[]>(`channels/${originId}/messages?around=${originMessageId}&limit=1`).then(res => {
        if (res.length !== 0) {
          const message = res.find(f => f.id === originMessageId)
          if (message) setOriginMessage(message)
        }
      }).catch(e => {
        console.error(e)
      })
    } else if(originMessage && originMessage.id !== originMessageId) setOriginMessage(undefined)

    if (destinationId.length > 17){
      customPrincipalFetch<DiscordChannel>(`channels/${destinationId}`).then(res => {
        if (res.id !== undefined) {
          setDestinationChannel(res)
          if (res.last_message_id) {
            customPrincipalFetch<DiscordMessage[]>(`channels/${destinationId}/messages?limit=2`).then(messages => {
              if (messages.length !== 0) {
                const message = messages[0]
                setMessageDestination(message)
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
            setMessageDestination(undefined)
          }
        }
      }).catch(e => {
        console.error(e)
      })
    } else if (destinationChannel && destinationChannel.id !== destinationId) {
      setMessageDestination(undefined)
      setDestinationChannel(undefined)
    }
  }, [formData])

  useEffect(()=> {
    const handleSendMessage = (message: {
      id: string
      channelId: string
    }) => {
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
      <header className='moveFiles-header'>
        <span className='moveFiles-version'>v{packageData.version}</span>
        <form className='moveFiles-form' onClick={(e) => { e.preventDefault() }}>
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
          <GetFileByUrl />
        </form>
      </header>

      <section className='section'>
        {destinationChannel && <Container
          title='Destination channel'
          channel={destinationChannel}
        />}
        {originChannel && <Container
          title='Target message and channel'
          channel={originChannel}
          manage
        />}
      </section>
    </>
  )
}