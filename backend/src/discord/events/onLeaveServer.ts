import { Events, GuildMember } from 'discord.js'
import { Event } from '../events'
import { users } from '../../Users'
import { kickPlayer } from '../../sockets/helpers'
import { sessionManager } from '../../session'
import { setConfirmedGuildState } from '../utils'

const event: Event = {
    name: Events.GuildMemberRemove,
    execute(member: GuildMember) {
        setConfirmedGuildState(member.guild.id, member.id, false)
        const user = users.getUserByDiscordId(member.id)
        if (!user) return
        const session = sessionManager.getPlayerSession(user.id)
        if (!session) return

        if (session.privacy_level === 'discord') {
            kickPlayer(user.id, "You left the Discord server.")
        }
    }
}

export default event