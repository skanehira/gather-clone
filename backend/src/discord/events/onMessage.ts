import { Events, GuildChannel, Message } from 'discord.js'
import { Event } from '../events'
import { sessionManager } from '../../session'
import { io } from '../..'
import { userHasPermissionToAccessChannel } from '../utils'

const event: Event = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot || message.system) return
        if (!message.guild) return
        if (!(message.channel instanceof GuildChannel)) return
        if (!message.channel.isTextBased()) return
        const session = sessionManager.getSessionByServerId(message.guild.id)
        if (!session) return
        const channelId = message.channel.id
        const roomIndex = session.getRoomWithChannelId(channelId)
        if (roomIndex === null) return
        const players = session.getPlayersInRoom(roomIndex)

        for (const player of players) {
            const hasPermission = userHasPermissionToAccessChannel(player.discordId, message.channel)
            if (!hasPermission) return

            io.to(player.socketId).emit('discordMessage', {
                username: message.author.displayName,
                content: message.content
            })
        }
    }
}

export default event