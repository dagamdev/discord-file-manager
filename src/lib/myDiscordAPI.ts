import { myApiFetch } from '../utils/functions'

export async function getGuild (guildId: string, setGuild?: (value: any) => void) {
  const response = await myApiFetch(`guilds/${guildId}`)

  if (setGuild) {
    setGuild(response)
    return
  }

  return response
}
