import { User } from '@supabase/supabase-js'

class Users {
    private users: { [key: string]: User } = {}
    private discordIdtoUid: { [key: string]: string } = {}

    addUser(id: string, user: User) {
        this.users[id] = user
        this.discordIdtoUid[user.user_metadata.provider_id] = id
    }

    getUser(id: string): User | undefined {
        return this.users[id]
    }

    getUserByDiscordId(discordId: string): User | undefined {
        const uid = this.discordIdtoUid[discordId]
        return this.users[uid]
    }

    removeUser(id: string) {
        delete this.discordIdtoUid[this.users[id].user_metadata.provider_id]
        delete this.users[id]
    }
}

const users = new Users()

export { users }

