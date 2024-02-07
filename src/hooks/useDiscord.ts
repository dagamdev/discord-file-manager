import { useNotifications } from "../contexts"
import { SECOND_TOKEN } from "../utils/data"
import { createCustomFetch, myApiFetch } from "../utils/functions"
import type { DiscordChannel, DiscordGuild, DiscordMessage, StateFunction } from '../types'

const customFetch = createCustomFetch(SECOND_TOKEN)

export function useDiscord() {
  const { createNotification } = useNotifications()

  const setDefaultErrorNotification = (content: string) => {
    createNotification({
      type: 'ERROR',
      content,
      duration: 20
    })
  }

  const getChannel = async ({channelId, setChannel}: {
    channelId: string
    setChannel: StateFunction<DiscordChannel | undefined>
  }) => {
    const channel = await customFetch(`channels/${channelId}`)
    console.log(channel)
    
    if(channel.id){
      setChannel(channel)
      return true

    }else{
      setDefaultErrorNotification('Error al obtener el canal')
      return false
    }
  }

  const getMessage = ({channelId, messageId, setMessage}: {
    channelId: string
    messageId: string
    setMessage: StateFunction<DiscordMessage | undefined>
  }) => {
    myApiFetch(`channels/${channelId}/messages/${messageId}`).then(msg=> {
      if(msg.id){
        setMessage(msg)

      }else{
        console.log('message')
        setDefaultErrorNotification(msg)
      }
    }).catch((e)=> console.error(e))
  }

  const getGuild = ({guildId, setGuild}: {
    guildId: string
    setGuild: StateFunction<DiscordGuild | undefined>
  }) => { 
    myApiFetch(`guilds/${guildId}`).then(res=> {
      console.log(res)

      if(res.id){
        setGuild(res)
      }else{
        setDefaultErrorNotification(res)
      }
    }).catch(e=> console.error(e))
  }

  return {
    getChannel,
    getMessage,
    getGuild
  }
}