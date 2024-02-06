import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { DiscordAttachment } from "../../types";
import { BiShow, BiHide, BiCheck, BiX } from 'react-icons/bi'
import { BsDownload } from 'react-icons/bs'
import { useImage, useMoveFiles, useTooltip } from '../../contexts';

export default function Attachment({attachment, manage, setFiles, check, viewFile}: {
  attachment: DiscordAttachment
  manage?: boolean,
  setFiles?: Dispatch<SetStateAction<string[]>>,
  check?: boolean
  viewFile: boolean
}){
  const { setMessage } = useMoveFiles()
  const { events, deleteTooltip } = useTooltip()
  const { setImage } = useImage()
  const [showFile, setShowFile] = useState<boolean>()

  useEffect(()=> {
    setShowFile(viewFile)
  }, [viewFile])

  const toggleShowFile = () => {
    setShowFile(s=> {
      if(s != undefined){
        return !s
      } else return true
    })
    deleteTooltip()
  }

  const toggleCheck = () => {
    if(setFiles) setFiles(fi=> {
      if(fi.some(s=> s==attachment.id) && check){
        return fi.filter(f=> f != attachment.id)
      } else return [...fi, attachment.id]
    })
    // setCheck(c=> !c)
  }

  const downloadFile = () => {
    if(!attachment.contentType?.includes('video')){
      fetch(attachment.attachment).then(res=> res.blob()).then(blob=> {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = attachment.name
  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
      }).catch((e)=> console.error(e))
    }
  }

  const deleteFile = () => {
    setMessage(ms=> {
      if (ms) {
        return {...ms, attachments: ms.attachments.filter(f=> f.id != attachment.id)}
      } else return undefined
    })
    deleteTooltip()
  }
  
  const head = (
    <div className={`attachment-head ${showFile ? 'file' : ''}`}>
      <div>
        <strong>{attachment.name}</strong>
        <p>MB {(attachment.size/1048576).toFixed(2)}</p>
      </div>
      <div onClick={downloadFile} className='attachment-head-download badge' {...events} data-tooltip='Descargar' >
        <BsDownload />
      </div>
      <div className='attachment-head-options' >
        <BiX onClick={deleteFile} {...events} data-tooltip='Eliminar' />
        {showFile ? <BiShow onClick={toggleShowFile} {...events} data-tooltip={`Ocultar archivo`} /> : <BiHide onClick={toggleShowFile} {...events} data-tooltip={`Mostrar archivo`} />}
        {manage &&
          <div onClick={toggleCheck}>
            <BiCheck style={{opacity: check ? '1' : '0'}} />
          </div>
        }
      </div>
    </div>
  )

  const handleClick = () => {
    setImage({src: attachment.attachment, alt: attachment.name})    
  }

  return (
    <li className='attachment'>
      {(!showFile) && head}

      {showFile &&
        <div className='attachment-file'>
          {head}
          {attachment.contentType?.includes('video') ?
          <video src={attachment.attachment} preload='metadata' controls autoPlay >
            {/* <source src="ruta/al/video.webm" type="video/webm" />
            <source src="ruta/al/video.ogv" type="video/ogg" /> */}
            Tu navegador no soporta la etiqueta de video.
          </video> :
          <img onClick={handleClick} src={attachment.attachment} alt={attachment.name} />}
          
          <div className='dimentions'>
            <strong>{attachment.width} × {attachment.height}</strong>
          </div>
        </div>
      }
    </li>
  )
}