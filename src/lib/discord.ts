import { customPrincipalFetch, customSecondFetch } from '../utils/functions'
import type { DiscordChannel, DiscordMessage } from '../types'

export async function getChannel (type: 'principal' | 'second', channelId: string, setChannel?: (value: DiscordChannel) => void): Promise<DiscordChannel> {
  const customFetch = type === 'principal'
    ? customPrincipalFetch
    : customSecondFetch
    
  const response = await customFetch<DiscordChannel>(`channels/${channelId}`)

  if (setChannel && response.id) {
    setChannel(response)
  }

  return response
}

export async function getMessages (type: 'principal' | 'second', channelId: string, queries: {
  around?: string
  limit?: string
}, setMessage?: (value: DiscordMessage) => void): Promise<DiscordMessage[]> {
  const customFetch = type === 'principal'
    ? customPrincipalFetch
    : customSecondFetch

  let endpointUrl = `channels/${channelId}/messages`

  for (const query in queries) {
    if (!endpointUrl.includes('?')) endpointUrl += '?'
    else endpointUrl += '&'

    endpointUrl += `${query}=${queries[query as 'around' | 'limit']}`
  }

  const response = await customFetch<DiscordMessage[]>(endpointUrl)

  if (setMessage && response.length !== 0) {
    if (queries.around) {
      const message = response.find(f => f.id === queries.around)
      if (message) setMessage(message)
    }
  }

  return response
}
