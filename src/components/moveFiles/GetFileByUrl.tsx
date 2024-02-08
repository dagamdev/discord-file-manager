import { useRef } from 'react'
import { MdOutlineDownloadForOffline } from 'react-icons/md'
import { myApiFetch } from '../../utils/functions'
import { useMoveFiles, useNotifications } from '../../contexts'
import { BaseAttachment } from '../../types'

export default function GetFileByUrl () {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {
    originChannel,
    setOriginChannel,
    originMessage,
    setOriginMessage
  } = useMoveFiles()
  const { createNotification } = useNotifications()

  const handleClick = async () => {
    const url = inputRef.current?.value
    if (url === undefined || url.length === 0) return

    const attachment = await myApiFetch<BaseAttachment>('attachment', {
      headers: {
        'file-url': url
      }
    })

    if (attachment.id !== undefined) {
      if (inputRef.current) inputRef.current.value = ''
      
      createNotification({
        type: 'SUCCESS',
        content: 'The multimedia file was obtained through the provided URL',
        duration: 20
      })

      if (!originChannel) {
        setOriginChannel({
          id: (Math.floor(Math.random() * 888888) + 111111).toString(),
          type: 0,
          name: '👻 Ghost channel',
          topic: 'Ghost channel created to be able to manage multimedia files obtained through a url.'
        })
      }

      if (originMessage) {
        setOriginMessage({
          ...originMessage,
          attachments: [...originMessage.attachments, attachment]
        })

      } else {
        setOriginMessage({
          id: (Math.floor(Math.random() * 888888) + 111111).toString(),
          type: 0,
          content: '',
          channel_id: '20040109',
          tts: true,
          mention_everyone: false,
          timestamp: '',
          edited_timestamp: '',
          attachments: [attachment],
          embeds: [],
          mentions: [],
          mention_roles: []
        })
      }
    }
  }

  return (
    <section className='getFile'>
      <label htmlFor="fileUrl">
        File url
        <input ref={inputRef} type="url" id='fileUrl' name='fileUrl' />
      </label>
      <button onClick={handleClick}>
        <MdOutlineDownloadForOffline className='button-icon' />
      </button>
    </section>
  )
}