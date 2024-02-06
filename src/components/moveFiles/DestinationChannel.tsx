import { DiscordChannel } from "../../types";
import Channel from './Channel';
import Attachment from './Attachment';

export default function DestinationChannel({channel}: {channel: DiscordChannel}){
  return (
    <div className='channelSection'>
      <span>{channel.position}</span>
      <h3>Destination channel</h3>
      <Channel channel={channel} />

      <ul className='channelSection-files'>
        {channel.lastMessage?.attachments.slice(channel.lastMessage?.attachments.length-2, channel.lastMessage?.attachments.length).map(at=> <Attachment key={at.id} attachment={at} viewFile={false} />)}
      </ul>
    </div>
  )
}