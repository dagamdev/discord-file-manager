import { useState, useRef, MouseEvent } from 'react'
import { useTooltip } from "../../contexts";
import { BiHash } from 'react-icons/bi'
import { MdArrowBackIosNew } from 'react-icons/md'
import { DiscordChannel } from '../../types';

export default function Channel({channel}: {
  channel: DiscordChannel
}){
  const { events } = useTooltip()
  const [showTopic, setShowTopic] = useState(false)
  const topicContentRef = useRef<HTMLDivElement>(null)

  const toggleShowTopic = (e: MouseEvent) => {
    setShowTopic(s=> !s)
    e.currentTarget.classList.toggle('active')
    
    if(topicContentRef.current){
      const childrend = topicContentRef.current.children.item(0) as HTMLDivElement | null
      const height = childrend?.offsetHeight      
      topicContentRef.current.style.height = showTopic ? '' : height+'px'
    }
  }

  return (
    <div className='moveFile_channel'>
      <div className='moveFile_channel-head'>
        <div className='badge' {...events} data-tooltip={`Typo ${channel?.type}`}>
          <BiHash />
        </div>
        <strong {...events} data-tooltip={`${channel?.nsfw ? 'Canal NSFW' : 'Canal normal'}`} >{channel?.name}</strong>
        {channel?.topic && <MdArrowBackIosNew className='moveFile_channel-head-toggle' onClick={toggleShowTopic} />}
      </div>

      <div ref={topicContentRef} className={`moveFile_channel-topicContent ${showTopic ? 'show' : ''}`}>
        {channel?.topic && 
          <div className={`moveFile_channel-topic`}>
            {channel.topic}
          </div>
        }
      </div>
    </div>
  )
}