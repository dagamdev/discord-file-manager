import { createContext, useContext, MouseEvent } from 'react'

export interface Tooltip {
  rect: DOMRect
  content: string
  direction: 'top' | 'left' | 'bottom' | 'right',
}

interface TooltipContext {
  tooltip: Tooltip | undefined
  events: {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => void,
    onMouseLeave: () => void
  }
  deleteTooltip: () => void
}

export const TooltipContext = createContext<TooltipContext | undefined>(undefined)

export function useTooltip() {
  return useContext(TooltipContext) as TooltipContext
}