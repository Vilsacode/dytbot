import {client} from '.'

export const sendMessage = (channelName: string, message: string) => {
  const channel = client.channels.cache.get(channelName)

  if (!channel) {
    throw new Error(`Channel ${channelName} not found`);
  }
  if (!channel.isSendable()) {
    throw new Error(`Channel ${channelName} is not Sendable`);
  }
  channel.send(message)
}
