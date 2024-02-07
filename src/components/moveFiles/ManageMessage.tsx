import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import Attachment from "./Attachment";
import Channel from "./Channel";
import { getFileNewData, myApiFetch } from '../../utils/functions';
import { useMoveFiles, useNotifications, useTooltip } from '../../contexts';
import { BiShow, BiHide } from 'react-icons/bi'

export default function ManageMessage(){
  const {
    originChannel,
    originMessage,
    destinationChannel,
    messageDestination
  } = useMoveFiles()
  const { createNotification } = useNotifications()
  const { events, deleteTooltip } = useTooltip()
  const [filesIds, setFilesIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [viewFile, setViewFile] = useState(false)
  const [fileNumber, setFileNumber] = useState(0)

  const destinationLastAttachment = useMemo(()=> {
    // const destinationAttachments = destinationChannel?.lastMessage?.attachments
    return messageDestination?.attachments.slice().pop()
  }, [destinationChannel])
  
  useEffect(()=> {
    // console.log(message?.attachments)
    if(originMessage && !originMessage.attachments.length) setError('The message does not contain attachments')
    else if(error) setError('')

    if(originMessage?.attachments.length){
      let fileCount = fileNumber
      
      originMessage.attachments.forEach(at=> {
        fileCount++
        const { name } = getFileNewData(at.filename, fileCount)
        at.filename = name
      })
    } 
    
  }, [originMessage, destinationLastAttachment, fileNumber, error])

  useEffect(()=> {
    if(originMessage?.attachments.length){
      setFilesIds(originMessage.attachments.map(m=> m.id))
    } 
  }, [originMessage])

  useEffect(()=> {
    setFileNumber(parseInt(destinationLastAttachment?.filename.match(/\d+/g)?.[0] || '0'))
  }, [destinationLastAttachment])


  const onChange = ({currentTarget: {value}}: ChangeEvent<HTMLInputElement>) => {
    if(value) setFileNumber(parseInt(value))
  }

  const moveFiles = () => {
    let fileCount = fileNumber
    const files = originMessage?.attachments.filter(f=> filesIds.some(s=> s==f.id))
    
    files?.forEach(at=> {
      fileCount++
      const { name } = getFileNewData(at.filename, fileCount)
      at.filename = name
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

          if(destinationChannel) {
            // getDestination({
            //   destinationId: destinationChannel.id,
            //   setDestinationChannel 
            // })  
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

  return originChannel ? (
    <div className='channelSection'>
      <span>{originChannel.position}</span>

      <div className='channelSection-head'>
        <h3>Target message and channel</h3>
        <input onChange={onChange} type="number" value={fileNumber} {...events} data-tooltip='Numero del ultimo archivo' />
        {viewFile ? <BiShow onClick={toggleViewFiles} {...events} data-tooltip={`Ocultar archivos`} /> : <BiHide onClick={toggleViewFiles} {...events} data-tooltip={`Mostrar archivos`} />}
      </div>
      <Channel channel={originChannel} />

      {error ? <p>{error}</p> : 
        (originMessage &&
          <ul className='channelSection-files'>
            {originMessage.attachments.map(at=> <Attachment key={at.id} attachment={at} manage={true} setFiles={setFilesIds} viewFile={viewFile} check={filesIds.some(s=> s==at.id)} />)}
          </ul>
        )
      }

      {(destinationChannel && Boolean(originMessage?.attachments.length) && !error) && <button onClick={moveFiles}>Move</button>}
    </div>
  ) : null
}