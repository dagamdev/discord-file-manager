import type { Dispatch, SetStateAction } from 'react'

export type StateFunction<State> = Dispatch<SetStateAction<State>>

export interface Notification {
  id: string
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING'
  content: string
  duration?: number
}


export interface ServerToClientEvents {
  sendMessage: (message: {
    id: string
    channelId: string
  }) => void
  addFiles: (message: {
    id: string
    channelId: string
  }) => void
}

// export interface ClientToServerEvents {
  
// }

export interface DiscordUser {
  id: string
  avatar: string
  username: string
  global_name: string
}

export interface DiscordChannel {
  id: string
  type: number
  guild_id?: string
  position?: number
  name?: string
  topic?: string
  nsfw?: boolean
  last_message_id?: string
  parent_id?: string
  rate_limit_per_user?: number
}

export interface BaseAttachment {
  id: string
  filename: string
  size: number
  url: string
  proxy_url: string
}

export interface DiscordAttachment extends BaseAttachment {
  description?: string
  content_type?: string
  width?: number
  height?: number
  ephemeral?: boolean
  duration_secs?: number
  duration_secs?: string
  flags?: number
}

export interface DiscordMessage {
  id: string
  type: number
  content: string
  channel_id: string
  author?: DiscordUser
  attachments: DiscordAttachment[]
  embeds: any[]
  mentions: any[]
  mention_roles: string[]
  mention_everyone: boolean
  tts: boolean
  timestamp: string
  edited_timestamp: string
}

export interface DiscordGuild {
  id: string
  name: string
  icon: string
  large: boolean
  ownerId: string
  shardId: number
  features: []
  members: []
  channels: []
  splash: string | null
  banner: string | null
  mfaLevel: string
  nsfwLevel: string
  available: boolean
  afkTimeout: number
  memberCount: number
  description: string | null
  premiumTier: string
  afkChannelId: string | null
  vanityURLCode: string | null
  applicationId: string | null
  vanityURLUses: number | null
  maximumMembers: number
  rulesChannelId: string | null
  joinedTimestamp: number
  preferredLocale: string
  systemChannelId: string
  discoverySplash: string | null
  maximumPresences: string | null
  verificationLevel: string
  maxVideoChannelUsers: number
  explicitContentFilter: string
  approximateMemberCount: number | null
  publicUpdatesChannelId: string | null
  premiumSubscriptionCount: number
  approximatePresenceCount: number | null
  premiumProgressBarEnabled: boolean
  defaultMessageNotifications: string
}
