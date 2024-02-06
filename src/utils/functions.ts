import { Tooltip } from "../contexts"
import { ENDPOINT } from "./data"

export function setTooltipPosition(tooltip: Tooltip, element: HTMLDivElement) {
  const { innerWidth } = window
  const pdd = 10, ed = 20

  if(innerWidth <= 500) return
  // console.log(thisRef)

  const hHalf = (tooltip.rect.height/2)
  const wHalf = (tooltip.rect.width/2) 
  let y = tooltip.rect.top+hHalf
  let x = tooltip.rect.left+wHalf

  const rect = element.getBoundingClientRect()
  const thHalf = rect.height/2
  const thWalf = rect.width/2

  const firstChild = element.childNodes.item(0) as HTMLDivElement
  const arrowRect = firstChild.getBoundingClientRect()
  
  let aX = 0

  if(tooltip.direction == 'top'){
    y-=hHalf+rect.height+ed
    x-=thWalf
  }
  
  if(tooltip.direction == 'bottom'){
    y+=hHalf+ed
    x-=thWalf

  }

  if(tooltip.direction == 'left'){
    y-=thHalf
    x-=wHalf+rect.width+ed

  }

  if(tooltip.direction == 'right'){
    y-=thHalf
    x+=rect.width+ed

  }

  
  aX = (thWalf-arrowRect.width/2)

  if(x < pdd) {
    aX = (aX-((-x)+pdd))
    
    x=pdd
  }

  if(x+rect.width > innerWidth-pdd) {
    aX = (aX+(x+rect.width - (innerWidth-pdd)))

    x-= x+rect.width - (innerWidth-pdd)
  }

  element.style.top = y+'px'
  element.style.left = x+'px'
  // firstChild.style.top = aY ? aY+'px' : ''
  firstChild.style.left = aX ? aX+'px' : ''
}

export function uuidGenerator() {
  const arr: string[] = []
  arr[8] = '-', arr[13] = '-', arr[18] = '-', arr[23] = '-'
  
  for(let i=0; i<36; i++){
    const el = arr[i], random = (Math.floor(Math.random()*15)+1)
    if(!el) arr[i] = random.toString(16)
  }

  return arr.join('')
}

export async function customFetch(route: string, token: string, method?: string, body?: object) {
  return fetch(`https://discord.com/api/v10/${route}`, {
    method,
    headers: {
      "Authorization": `${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  }).then(prom=> prom.json())
}

export async function myApiFetch(route: string, method?: string, body?: object) {
  return fetch(`${ENDPOINT}dc/${route}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  }).then(prom=> prom.json())
}

const fileTypes = {
  img: ['png', 'jpg'],
  gif: ['gif'], 
  video: ['mp4', 'mov', 'webm']
}

const extencionReplaces: {[key: string]: string} = {
  webm: 'mp4',
  webp: 'png'
}

export function getFileNewData(fileName: string, fileCount: number) {
  const extencion = fileName.split('.').pop()
  const type =  fileTypes.video.some(s=> s==extencion) ? 'video' : fileTypes.gif.some(s=> s==extencion) ? 'gif' : 'img'
 
  return { type, name: `${type}${fileCount}.`+(extencion ? extencionReplaces[extencion] || extencion : extencion) }
}