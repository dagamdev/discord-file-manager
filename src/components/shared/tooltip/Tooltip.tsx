import './tooltip.css'

import { useState, useEffect } from 'react'
import { useTooltip } from "../../../contexts"
import { setTooltipPosition } from '../../../utils/functions'

export default function Tooltip(){
  const { tooltip } = useTooltip()
  const [thisRef, setThisRef] = useState<HTMLDivElement | null>(null)

  useEffect(()=> {
    if(tooltip && thisRef){
      setTooltipPosition(tooltip, thisRef)
    }

  }, [thisRef, tooltip])

  
  return (
    <>
      {tooltip &&
        <div ref={setThisRef} className={`tooltip ${tooltip.direction}`} >
          <div className='tooltip-arrow' />
          <p>{tooltip.content}</p> 
        </div>
      }
    </>
  )
}