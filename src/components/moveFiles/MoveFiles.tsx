import { useState, useEffect, ChangeEvent } from 'react'
import { socket } from '../../utils/socket'
import { useMoveFiles, useNotifications } from '../../contexts'
import Container from './Container'
import packageData from '../../../package.json'
import GetFileByUrl from './GetFileByUrl'
import { getChannel, getMessages } from '../../lib/discord'

export default function MoveFiles(){
  const {
    destinationChannel,
    setDestinationChannel,
    setMessageDestination,
    originChannel,
    setOriginChannel,
    originMessage,
    setOriginMessage,
    setFileNumber
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
      getChannel('second', originId, setOriginChannel).catch(e => {
        console.error(e)
      })
    } else if(originChannel && originChannel.id !== originId) setOriginChannel(undefined)

    if (originId && originMessageId.length > 17 && originMessageId !== originMessage?.id){
      getMessages('second', originId, {
        limit: '1',
        around: originMessageId
      }, setOriginMessage).catch(e => {
        console.error(e)
      })
    } else if(originMessage && originMessage.id !== originMessageId) setOriginMessage(undefined)

    if (destinationId.length > 17 && destinationId !== destinationChannel?.id){
      getChannel('principal', destinationId).then(res => {
        if (res.id !== undefined) {
          setDestinationChannel(res)
          if (res.last_message_id) {
            getMessages('principal', destinationId, {
              limit: '2'
            }).then(messages => {
              setFileNumber(0)
              if (messages.length === 0) {
                createNotification({
                  type: 'INFO',
                  content: 'El canal de destino no contiene mensajes',
                  duration: 30
                })
              } else {
                const message = messages[0]
                setMessageDestination(message)
                const lastAttachment = message.attachments.slice(-1)[0]
                setFileNumber(parseInt(lastAttachment?.filename.match(/\d+/g)?.[0] || '0'))
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
            setFileNumber(0)
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

      getMessages('second', message.channelId, {
        limit: '1',
        around: message.id
      }).then(res => {
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
          title='Target channel'
          channel={originChannel}
          manage
        />}
      </section>
    </>
  )
}