import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import type { DiscordChannel, DiscordMessage } from "../../types"
import Attachment from "./Attachment"
import Channel from "./Channel"
import { customPrincipalFetch, customSecondFetch, getFileNewData } from '../../utils/functions'
import { useMoveFiles, useNotifications, useTooltip } from '../../contexts'
import { BiShow, BiHide } from 'react-icons/bi'

export default function Container({ title, channel, manage = false }: {
  title: string
  channel: DiscordChannel
  manage?: boolean
}){
  const {
    originMessage,
    messageDestination,
    setMessageDestination, 
    destinationChannel,
    setDestinationChannel
  } = useMoveFiles()
  const message = manage ? originMessage : messageDestination
  const { createNotification } = useNotifications()
  const { events, deleteTooltip } = useTooltip()
  const [fileIds, setFileIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [viewFile, setViewFile] = useState(false)
  const [fileNumber, setFileNumber] = useState(0)

  const lastAttachmentDestination = useMemo(()=> {
    // const destinationAttachments = destinationChannel?.lastMessage?.attachments
    return messageDestination?.attachments.slice().pop()
  }, [destinationChannel])
  
  useEffect(()=> {
    // console.log(message?.attachments)
    if(message && message.attachments.length === 0) setError(manage
      ? 'The message does not contain files'
      : 'The last message does not contain files'
    )
    else if(error) setError('')

    if(message?.attachments.length){
      let fileCount = fileNumber
      
      message.attachments.forEach(at=> {
        fileCount++
        const { name } = getFileNewData(at.filename, fileCount)
        at.filename = name
      })
    } 
    
  }, [message, lastAttachmentDestination, fileNumber, error])

  useEffect(()=> {
    if(message?.attachments.length){
      setFileIds(message.attachments.map(m=> m.id))
    } 
  }, [message])

  useEffect(()=> {
    setFileNumber(parseInt(lastAttachmentDestination?.filename.match(/\d+/g)?.[0] || '0'))
  }, [lastAttachmentDestination])


  const onChange = ({currentTarget: {value}}: ChangeEvent<HTMLInputElement>) => {
    if(value) setFileNumber(parseInt(value))
  }

  const moveFiles = () => {
    let fileCount = fileNumber
    const files = message?.attachments.filter(f=> fileIds.some(s=> s === f.id))
    
    files?.forEach(at=> {
      fileCount++
      const { name } = getFileNewData(at.filename, fileCount)
      at.filename = name
    })

    // console.log(files)

    if(destinationChannel && files?.length){
      customPrincipalFetch(`channels/${destinationChannel.id}/messages`, {
        method: 'POST',
        body: {
          attachments: files,
          content: "asd",
        }
      }).then(res => {
        console.log(res)
        if(res.id){
          const s = files.length != 1 ? 's' : ''
          createNotification({
            type: 'SUCCESS',
            content: `Archivo${s} enviado${s} al canal ${destinationChannel?.name}`,
            duration: 30
          })

          if(setDestinationChannel && destinationChannel) {
            customSecondFetch<DiscordChannel>(`channels/${destinationChannel.id}`).then(res => {
              if (res.id !== undefined) {
                console.log(res)
                setDestinationChannel(res)
                if (res.last_message_id) {
                  customSecondFetch<DiscordMessage[]>(`channels/${destinationChannel.id}/messages`).then(messages => {
                    console.log(messages)
                    if (messages.length !== 0) {
                      const message = messages[0]
                      console.log(message)
                      setMessageDestination(message)
                    } else {
                      createNotification({
                        type: 'INFO',
                        content: 'El canal de destino no contiene mensajes'
                      })
                    }
                  }).catch(e => {
                    console.error(e)
                  })
      
                } else {
                  createNotification({
                    type: 'WARNING',
                    content: 'No hay mensajes en el canal de destino'
                  })
                }
              }
            }).catch(e => {
              console.error(e)
            }) 
          }

        } else if(res.message){
          createNotification({
            type: 'ERROR',
            content: res.message,
            duration: 30
          })
        }
      })
      .catch((e)=> console.error(e))
    }
  }

  const toggleViewFiles = () => {
    setViewFile(v=> !v)
    deleteTooltip()
  }

  return (
    <div className='channelSection'>
      <span>{channel.position}</span>

      <section className='channelSection-head'>
        <h3>{title}</h3>
        {manage && <>
          <input onChange={onChange} type="number" value={fileNumber} {...events} data-tooltip='Numero del ultimo archivo' />
        </>}
        {viewFile ? <BiShow onClick={toggleViewFiles} {...events} data-tooltip={`Ocultar archivos`} /> : <BiHide onClick={toggleViewFiles} {...events} data-tooltip={`Mostrar archivos`} />}
      </section>
      <Channel channel={channel} />

      {error ? <p>{error}</p> : 
        (message &&
          <ul className='channelSection-files'>
            {message.attachments.map(at=> <Attachment key={at.id} attachment={at} manage={manage} setFiles={setFileIds} viewFile={viewFile} check={fileIds.some(s=> s === at.id)} />)}
          </ul>
        )
      }

      {(manage && destinationChannel && !!message?.attachments.length && !error) && <button onClick={moveFiles}>Move</button>}
    </div>
  )
}