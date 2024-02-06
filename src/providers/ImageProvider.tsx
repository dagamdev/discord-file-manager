import { useState, ReactNode } from 'react'
import { Image, ImageContext } from "../contexts";

export default function ImageProvider({children}: {children: ReactNode}){
  const [image, setImage] = useState<Image>()
  
  return (
    <ImageContext.Provider value={{image, setImage}}>
      {children}
    </ImageContext.Provider>
  )
}