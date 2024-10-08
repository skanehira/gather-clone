import { Events, GuildMember } from 'discord.js'
import { Event } from '../events'
import { setConfirmedGuildState } from '../utils'

const event: Event = {
    name: Events.GuildMemberAdd,
    execute(member: GuildMember) {
        setConfirmedGuildState(member.guild.id, member.id, true)
    }
}

export default event