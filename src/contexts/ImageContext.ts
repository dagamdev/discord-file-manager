import { createContext, useContext, Dispatch, SetStateAction } from 'react'

export interface Image {
  src: string
  alt: string
}

interface ImageContext {
  image?: Image
  setImage: Dispatch<SetStateAction<Image | undefined>>
}

export const ImageContext = createContext<ImageContext | undefined>(undefined)

export function useImage() {
  return useContext(ImageContext) as ImageContext
}