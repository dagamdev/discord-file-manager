import './image-viewer.css'

import { useRef, MouseEvent } from 'react'
import { useImage } from "../../../contexts"

export default function ImageViewer(){
  const { image, setImage } = useImage()
  const imageRef = useRef<HTMLImageElement>(null)

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if(!imageRef.current?.contains(e.target as Node)){
      setImage(undefined)
    }
  }

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
  }
  
  return (
    <>
      {image &&
        <div onClick={handleClick} className="imageViewer">
          <div>
            <img onContextMenu={handleContextMenu} ref={imageRef} {...image} />
          </div>
        </div>
      }
    </>
  )
}