import { Router } from 'express'
import { GetPlayersInRoom, GetServerName, IsOwnerOfServer, UserIsInGuild, GetChannelName, GetPlayerCounts } from './route-types'
import { supabase } from '../supabase'
import { z } from 'zod'
import { sessionManager } from '../session'
import { client } from '../discord/client'
import { userIsInGuildWithId, userHasPermissionToAccessChannel } from '../discord/utils'
import { GuildChannel } from 'discord.js'

export default function routes(): Router {
    const router = Router()

    router.get('/getPlayersInRoom', async (req, res) => {
        const access_token = req.headers.authorization?.split(' ')[1];

        if (!access_token) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        const params = req.query as unknown as z.infer<typeof GetPlayersInRoom>
        if (!GetPlayersInRoom.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        const session = sessionManager.getPlayerSession(user.user.id)
        if (!session) {
            return res.status(400).json({ message: 'User not in a realm.' })
        }

        const players = session.getPlayersInRoom(params.roomIndex)
        return res.json({ players })
    })

    router.get('/isOwnerOfServer', async (req, res) => {
        const access_token = req.headers.authorization?.split(' ')[1];

        if (!access_token) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        const params = req.query as unknown as z.infer<typeof IsOwnerOfServer>
        if (!IsOwnerOfServer.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        const userId = user.user.user_metadata.provider_id

        try {
            const guild = await client.guilds.fetch(params.serverId)
            if (!guild) {
                return res.status(400).json({ message: 'Invalid server ID.' })
            }
            return res.json({ isOwner: guild.ownerId === userId })
        } catch (err: any) {
            if (err.rawError?.message === 'Unknown Guild') {
                return res.status(400).json({ message: 'Please add the realms bot to your server before linking!' })
            }
            return res.status(400).json({ message: 'Invalid server ID.' })
        }
    })

    router.get('/getServerName', async (req, res) => {
        const access_token = req.headers.authorization?.split(' ')[1];

        if (!access_token) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        const params = req.query as unknown as z.infer<typeof GetServerName>
        if (!GetServerName.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }
        
        try {
            const guild = await client.guilds.fetch(params.serverId)
            if (!guild) {
                return res.status(400).json({ message: 'Invalid server ID.' })
            }
            return res.json({ name: guild.name })
        } catch (err: any) {
            return res.status(400).json({ message: 'Something went wrong.' })
        }
    })

    router.get('/getChannelName', async (req, res) => {
        const access_token = req.headers.authorization?.split(' ')[1];

        if (!access_token) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        const params = req.query as unknown as z.infer<typeof GetChannelName>
        if (!GetChannelName.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        try {
            const guild = await client.guilds.fetch(params.serverId)
            if (!guild) {
                return res.status(400).json({ message: 'Invalid server ID.' })
            }

            const channel = await guild.channels.fetch(params.channelId)
            if (!channel) {
                return res.status(400).json({ message: 'Invalid channel ID.' })
            }
            if (!userHasPermissionToAccessChannel(params.userId, channel as GuildChannel)) {
                return res.status(400).json({ message: 'User does not have permission to access channel.' }) 
            }

            return res.json({ name: channel.name })
        } catch (err: any) {
            return res.status(400).json({ message: 'Something went wrong.' })
        }
    })

    router.get('/userIsInGuild', async (req, res) => {
        const access_token = req.headers.authorization?.split(' ')[1];

        if (!access_token) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        const params = req.query as unknown as z.infer<typeof UserIsInGuild>
        if (!UserIsInGuild.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        const isInGuild = await userIsInGuildWithId(user.user.user_metadata.provider_id, params.guildId)
        return res.json({ isInGuild })
    })

    router.get('/getPlayerCounts', async (req, res) => {
        const access_token = req.headers.authorization?.split(' ')[1];

        if (!access_token) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        let params = req.query as unknown as z.infer<typeof GetPlayerCounts>
        const parseResults = GetPlayerCounts.safeParse(params)
        if (!parseResults.success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        params = parseResults.data

        if (params.realmIds.length > 100) {
            return res.status(400).json({ message: 'Too many server IDs' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        const playerCounts: number[] = []
        for (const realmId of params.realmIds) {
            const session = sessionManager.getSession(realmId)
            if (session) {
                const playerCount = session.getPlayerCount()

                playerCounts.push(playerCount)
            } else {
                playerCounts.push(0)
            }
        }

        return res.json({ playerCounts })
    })

    return router
}