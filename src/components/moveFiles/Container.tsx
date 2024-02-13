import { useState, useEffect, ChangeEvent } from 'react'
import type { DiscordChannel } from "../../types"
import Attachment from "./Attachment"
import Channel from "./Channel"
import { getFileNewData, myApiFetch } from '../../utils/functions'
import { useMoveFiles, useNotifications, useTooltip } from '../../contexts'
import { BiShow, BiHide } from 'react-icons/bi'
import { getChannel, getMessages } from '../../lib/discord'

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
    setDestinationChannel,
    fileNumber,
    setFileNumber
  } = useMoveFiles()
  const message = manage ? originMessage : messageDestination
  const { createNotification } = useNotifications()
  const { events, deleteTooltip } = useTooltip()
  const [fileIds, setFileIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [viewFile, setViewFile] = useState(false)
  
  useEffect(()=> {
    if(message && message.attachments.length === 0) setError(manage
      ? 'The message does not contain files'
      : 'The last message does not contain files'
    )
    else if(error) setError('')

    if(manage && message?.attachments.length) {      
      message.attachments.forEach((at, i) => {
        const { name } = getFileNewData(at.filename, fileNumber + i + 1)
        at.filename = name
      })
    } 
    
  }, [message, fileNumber, error])

  useEffect(()=> {
    if(message?.attachments.length){
      setFileIds(message.attachments.map(m=> m.id))
    } 
  }, [message])

  const onChange = ({currentTarget: {value}}: ChangeEvent<HTMLInputElement>) => {
    if(value) setFileNumber(parseInt(value))
  }

  const moveFiles = async () => {
    let fileCount = fileNumber
    const files = message?.attachments.filter(f=> fileIds.some(s=> s === f.id))
    
    files?.forEach(at=> {
      fileCount++
      const { name } = getFileNewData(at.filename, fileCount)
      at.filename = name
    })

    if(destinationChannel && files?.length){
      myApiFetch(`/channels/${destinationChannel.id}`, {
        method: 'POST',
        body: {
          attachments: files
        }
      }).then(res => {
        if(res.id){
          const s = files.length != 1 ? 's' : ''
          createNotification({
            type: 'SUCCESS',
            content: `Archivo${s} enviado${s} al canal ${destinationChannel?.name}`,
            duration: 30
          })

          getChannel('principal', destinationChannel.id).then(res => {
            if (res.id !== undefined) {
              setDestinationChannel(res)
              if (res.last_message_id) {
                getMessages('principal', destinationChannel.id, {
                  limit: '4'
                }).then(messages => {
                  if (messages.length !== 0) {
                    const message = messages[0]
                    setMessageDestination(message)
                    const lastAttachment = message.attachments.slice(-1)[0]
                    setFileNumber(parseInt(lastAttachment?.filename.match(/\d+/g)?.[0] || '0'))
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
              }
            }
          }).catch(e => {
            console.error(e)
          }) 

        } else if(res.message){
          createNotification({
            type: 'ERROR',
            content: res.message,
            duration: 30
          })
        }
      }).catch(e => {
        console.error(e)
      })
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
            {(manage ? message.attachments : message.attachments.slice(-2)).map(at=> <Attachment key={at.id} attachment={at} manage={manage} setFiles={setFileIds} viewFile={viewFile} check={fileIds.some(s=> s === at.id)} />)}
          </ul>
        )
      }

      {(manage && destinationChannel && !!message?.attachments.length && !error) && <button onClick={moveFiles}>Move</button>}
    </div>
  )
}