import { AttachmentBuilder } from 'discord.js';
import {client} from '.'
import { config } from '../config';
import { Canvas } from 'canvas';

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

export const sendImage = (channelName: string, image: Canvas) => {
  const channel = client.channels.cache.get(channelName)

  if (!channel) {
    throw new Error(`Channel ${channelName} not found`);
  }
  if (!channel.isSendable()) {
    throw new Error(`Channel ${channelName} is not Sendable`);
  }

  const attachment = new AttachmentBuilder(image.createPNGStream(), { name: 'profile-image.png' });

  channel.send({ files: [attachment] })
  console.log('image envoyée')
}

export const assignRole = async (memberId: string, roleId: string) => {
  if (!config.DISCORD_GUILD_ID) {
    throw new Error(`Guild ID not provided`);
  }

  const guild = client.guilds.cache.get(config.DISCORD_GUILD_ID)

  if (!guild) {
    throw new Error(`Guild ${config.DISCORD_GUILD_ID} not found`);
  }

  const members = await guild.members.fetch()

  const member = members.find(member => member.id == memberId)
  const role = guild.roles.cache.get(roleId)

  if (!member) {
    throw new Error(`Member ${memberId} not found`);
  }
  if (!role) {
    throw new Error(`Role ${roleId} not found`);
  }

  await member.roles.add(role)

  console.log(`Role ${role.name} is added to ${member.user.username}`)
}
