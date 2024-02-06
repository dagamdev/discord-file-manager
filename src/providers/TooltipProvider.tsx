import { useReducer, MouseEvent, ReactNode } from 'react'
import { TooltipContext } from '../contexts/TooltipContext';
import { tooltipReducer } from '../reducers';

export default function TooltipProvider({children}: {children: ReactNode}){
  const [tooltip, tooltipDispatch] = useReducer(tooltipReducer, undefined)

  const createTooltip = ({currentTarget}: MouseEvent<HTMLElement>) => {
    const { innerWidth } = window
    if(innerWidth <= 700) return
    const rect = currentTarget.getBoundingClientRect()

    tooltipDispatch({
      type: 'CREATE',
      payload: {
        rect,
        dataToltip: currentTarget.dataset.tooltip || 'undefined'
      }
    })
  }

  const deleteTooltip = () => {
    tooltipDispatch({type: 'DELETE'})
  }

  return (
    <TooltipContext.Provider value={{
      tooltip, 
      events: {
        onMouseEnter: createTooltip,
        onMouseLeave: deleteTooltip
      },
      deleteTooltip
    }}>
      {children}
    </TooltipContext.Provider>
  )
}