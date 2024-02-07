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
  const { setOriginMessage } = useMoveFiles()
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
    if(!attachment.content_type?.includes('video')){
      fetch(attachment.url).then(res=> res.blob()).then(blob=> {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = attachment.filename
  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
      }).catch((e)=> console.error(e))
    }
  }

  const deleteFile = () => {
    setOriginMessage(ms=> {
      if (ms) {
        return {...ms, attachments: ms.attachments.filter(f=> f.id != attachment.id)}
      } else return undefined
    })
    deleteTooltip()
  }
  
  const head = (
    <header className={`attachment-head ${showFile ? 'file' : ''}`}>
      <p>
        <strong>{attachment.filename}</strong>
        <span>{(attachment.size/1048576).toFixed(2)} MB</span>
      </p>
      <div onClick={downloadFile} className='attachment-head-download badge' {...events} data-tooltip='Descargar' >
        <BsDownload />
      </div>
      <section className='attachment-head-options' >
        {manage && <BiX onClick={deleteFile} {...events} data-tooltip='Eliminar' />}
        {showFile ? <BiShow onClick={toggleShowFile} {...events} data-tooltip={`Ocultar archivo`} /> : <BiHide onClick={toggleShowFile} {...events} data-tooltip={`Mostrar archivo`} />}
        {manage &&
          <div onClick={toggleCheck}>
            <BiCheck style={{opacity: check ? '1' : '0'}} />
          </div>
        }
      </section>
    </header>
  )

  const handleClick = () => {
    setImage({src: attachment.url, alt: attachment.filename})    
  }

  return (
    <li className='attachment'>
      {showFile
        ? <div className='attachment-file'>
          {head}
          {attachment.content_type?.includes('video') ?
          <video src={attachment.url} preload='metadata' controls autoPlay >
            {/* <source src="ruta/al/video.webm" type="video/webm" />
            <source src="ruta/al/video.ogv" type="video/ogg" /> */}
            Tu navegador no soporta la etiqueta de video.
          </video> :
          <img onClick={handleClick} src={attachment.url} alt={attachment.filename} />}
          
          <div className='dimentions'>
            <strong>{attachment.width} × {attachment.height}</strong>
          </div>
        </div>
        : head
      }

    </li>
  )
}