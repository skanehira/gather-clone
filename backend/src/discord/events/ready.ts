import { Events } from 'discord.js'
import { Event } from '../events'

const event: Event = {
    name: Events.ClientReady,
    once: true,
    execute(client: any) {
        console.log(`Ready! Logged in as ${client.user.tag}`)
    }
}

export default event