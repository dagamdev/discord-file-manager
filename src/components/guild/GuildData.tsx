import { getGuild } from '../../lib/myDiscordAPI'
import { DiscordGuild } from '../../types'
import './guild.css'

import { useState, ChangeEvent } from 'react'

export default function GuildData(){
  const [guildlId, setGuildlId] = useState('')
  const [guild, setGuild] = useState<DiscordGuild>()
  
  const handleChange = async ({currentTarget: {value}}: ChangeEvent<HTMLInputElement>) => {
    setGuildlId(value)
    if(value.length > 17){
      await getGuild(value, setGuild)
    }
  }

  return (
    <section className='guildData'>
      <form>
        <label htmlFor="guildId">
          Guild ID
          <input onChange={handleChange} type="text" id='guildId' name='guildId' value={guildlId} />
        </label>
      </form>

      {guild && <div className='guildData-info'>
        <header>
          {guild?.icon &&
            <div className="icon">
              <img src={`https://cdn.discordapp.com/icons/${guildlId}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}`} alt="" />
            </div>
          }

          <div>
            <strong>{guild.name}</strong>
            <p>{guild.description}</p>
          </div>
        </header>

        <ul>
          <li>
            <strong>Members:</strong>
            <p>{guild.memberCount.toLocaleString()}</p>
          </li>
        </ul>
      </div>}
    </section>
  )
}