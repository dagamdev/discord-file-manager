import type { Dispatch, SetStateAction } from 'react'

export type StateFunction<State> = Dispatch<SetStateAction<State>>

export interface Notification {
  id: string
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING'
  content: string
  duration?: number
}


export interface ServerToClientEvents {
  sendFiles: (message: DiscordMessage) => void
  addFiles: (attachments: DiscordAttachment[]) => void
}

// export interface ClientToServerEvents {
  
// }

export interface DiscordUser {
  id: string
  bot: boolean
  system: boolean
  premiumSince: null
  premiumGuildSince: null
  bio: string | null
}

export interface DiscordChannel {
  id: string
  type: number
  name: string
  nsfw: boolean
  flags: number
  topic: string | null
  guild_id: string
  position: number
  parent_id: string | null
  icon_emoji: object
  theme_color: null
  lastMessage: DiscordMessage | undefined
  last_message_id: string
  rate_limit_per_user: number | null
}

export interface DiscordAttachment {
  id: string
  url: string
  name: string
  size: number
  width: number
  height: number
  proxyURL: string
  ephemeral: boolean
  attachment: string
  contentType: string | null
  description: string | null
}

export interface DiscordMessage {
  id: string
  channelId: string
  guildId: string
  position: null
  createdTimestamp: number
  system: boolean
  type: string
  content: string
  author: DiscordUser 
  pinned: boolean
  tts: false
  nonce: null
  embeds: []
  components: []
  attachments: DiscordAttachment[]
  editedTimestamp: number | null
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