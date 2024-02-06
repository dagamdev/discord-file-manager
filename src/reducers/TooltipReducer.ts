import { Tooltip } from "../contexts"

export interface TooltipAction {
  type: 'CREATE' | 'DELETE',
  payload?: {
    rect: DOMRect,
    dataToltip: string
  }
}

export function tooltipReducer(state: Tooltip | undefined, action: TooltipAction){
  const { type, payload } = action

  switch (type) {
    case 'CREATE': {
      if(!payload) return state
      let content = payload.dataToltip
      let direction = 'top'
      if(payload.dataToltip.includes('[') && payload.dataToltip.includes(']')){
        content = payload.dataToltip.split('[')[0] || 'undefined'
        direction = payload.dataToltip.split('[')[1].replace(']', '')
      }

      return {
        rect: payload.rect,
        content,
        direction,
      } as Tooltip
    } 

    case 'DELETE': {
      return undefined
    }
  
    default:
      return state
  }
}