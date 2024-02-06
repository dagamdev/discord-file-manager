import { useNotifications } from "../contexts"
import { TOKEN } from "../utils/data"
import { customFetch, myApiFetch } from "../utils/functions"
import type { DiscordChannel, DiscordGuild, DiscordMessage, StateFunction } from '../types'

export function useDiscord() {
  const { createNotification } = useNotifications()

  const setDefaultErrorNotification = (e: Error) => {
    createNotification({
      type: 'ERROR',
      content: e.message,
      duration: 20
    })
  }

  const getDestination = async ({destinationId, setDestination}: {
    destinationId: string
    setDestination: StateFunction<DiscordChannel | undefined>
  }) => {
    const channel = await customFetch(`channels/${destinationId}`, TOKEN)
      // console.log(ch)

    if(channel.id){
      const messages = await myApiFetch(`channels/${destinationId}/messages?limit=4`)

      setDestination(channel)
      
      if(messages.length){
        const lastMessage = messages.find((f: DiscordMessage)=> f.attachments.length)
        channel.lastMessage = lastMessage
        return true
        
      }else{
        setDefaultErrorNotification(messages)
        return false
      }
      

    }else{
      console.log(channel)
      setDefaultErrorNotification(channel)
      return false
    }
  }

  const getChannel = async ({channelId, setChannel}: {
    channelId: string
    setChannel: StateFunction<DiscordChannel | undefined>
  }) => {
    const channel = await customFetch(`channels/${channelId}`, TOKEN)
    
    if(channel.id){
      setChannel(channel)
      return true

    }else{
      setDefaultErrorNotification(channel)
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
    getDestination,
    getChannel,
    getMessage,
    getGuild
  }
}