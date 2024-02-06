import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import type { DiscordChannel, StateFunction } from "../../types";
import Attachment from "./Attachment";
import Channel from "./Channel";
import { getFileNewData, myApiFetch } from '../../utils/functions';
import { useMoveFiles, useNotifications, useTooltip } from '../../contexts';
import { BiShow, BiHide } from 'react-icons/bi'
import { useDiscord } from '../../hooks/useDiscord';

export default function ManageMessage({destinationChannel, setDestination}: {
  destinationChannel?: DiscordChannel
  setDestination?: StateFunction<DiscordChannel | undefined>
}){
  const { channel, message } = useMoveFiles()
  const { createNotification } = useNotifications()
  const { events, deleteTooltip } = useTooltip()
  const { getDestination } = useDiscord()
  const [filesIds, setFilesIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [viewFile, setViewFile] = useState(false)
  const [fileNumber, setFileNumber] = useState(0)

  const destinationLastAttachment = useMemo(()=> {
    // const destinationAttachments = destinationChannel?.lastMessage?.attachments
    return destinationChannel?.lastMessage?.attachments.slice().pop()
  }, [destinationChannel])
  
  useEffect(()=> {
    // console.log(message?.attachments)
    if(message && !message.attachments.length) setError('The message does not contain attachments')
    else if(error) setError('')

    if(message?.attachments.length){
      let fileCount = fileNumber
      
      message.attachments.forEach(at=> {
        fileCount++
        const { name } = getFileNewData(at.name, fileCount)
        at.name = name
      })
    } 
    
  }, [message, destinationLastAttachment, fileNumber, error])

  useEffect(()=> {
    if(message?.attachments.length){
      setFilesIds(message.attachments.map(m=> m.id))
    } 
  }, [message])

  useEffect(()=> {
    setFileNumber(parseInt(destinationLastAttachment?.name.match(/\d+/g)?.[0] || '0'))
  }, [destinationLastAttachment])


  const onChange = ({currentTarget: {value}}: ChangeEvent<HTMLInputElement>) => {
    if(value) setFileNumber(parseInt(value))
  }

  const moveFiles = () => {
    let fileCount = fileNumber
    const files = message?.attachments.filter(f=> filesIds.some(s=> s==f.id))
    
    files?.forEach(at=> {
      fileCount++
      const { name } = getFileNewData(at.name, fileCount)
      at.name = name
    })

    // console.log(files)

    if(files?.length){
      myApiFetch(`channels/${destinationChannel?.id}`, 'POST', {
        attachments: files
      }).then(res=> {
        if(res.id){
          const s = files.length != 1 ? 's' : ''
          createNotification({
            type: 'SUCCESS',
            content: `Archivo${s} enviado${s} al canal ${destinationChannel?.name}`,
            duration: 30
          })

          if(setDestination && destinationChannel) {
            getDestination({
              destinationId: destinationChannel.id,
              setDestination 
            })  
          }

        }else if(res.message){
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

  return channel ? (
    <div className='channelSection'>
      <span>{channel.position}</span>

      <div className='channelSection-head'>
        <h3>Target message and channel</h3>
        <input onChange={onChange} type="number" value={fileNumber} {...events} data-tooltip='Numero del ultimo archivo' />
        {viewFile ? <BiShow onClick={toggleViewFiles} {...events} data-tooltip={`Ocultar archivos`} /> : <BiHide onClick={toggleViewFiles} {...events} data-tooltip={`Mostrar archivos`} />}
      </div>
      <Channel channel={channel} />

      {error ? <p>{error}</p> : 
        (message &&
          <ul className='channelSection-files'>
            {message.attachments.map(at=> <Attachment key={at.id} attachment={at} manage={true} setFiles={setFilesIds} viewFile={viewFile} check={filesIds.some(s=> s==at.id)} />)}
          </ul>
        )
      }

      {(destinationChannel && Boolean(message?.attachments.length) && !error) && <button onClick={moveFiles}>Move</button>}
    </div>
  ) : null
}