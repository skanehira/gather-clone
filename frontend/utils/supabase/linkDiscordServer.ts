'use server'
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { request } from '../backend/requests'

export async function linkDiscordServer(access_token: string, discord_server_id: string, realm_id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    const { data: user, error: userError } = await supabase.auth.getUser(access_token)
    if (!user || !user.user) {
        return { error: userError }
    }

    const { data: ownerData, error: isOwnerError } = await request('/isOwnerOfServer', { serverId: discord_server_id }, access_token)
    if (isOwnerError) {
        return { error: isOwnerError }
    }

    if (!ownerData || !ownerData.isOwner) {
        return { error: { message: 'You must be the owner of the server to link it to a realm!' } }
    }

    // Check if the realm already has the specified discord_server_id
    const { data: existingRealms, error: existingRealmError } = await supabase
        .from('realms')
        .select('id')
        .eq('discord_server_id', discord_server_id)
        .eq('id', realm_id)
        .eq('owner_id', user.user.id)
    
    if (existingRealmError) {
        return { error: existingRealmError }
    }

    if (existingRealms && existingRealms[0]) {
        return { error: { message: 'This realm is already linked to this server!' } }
    }

    const { error } = await supabase
        .from('realms')
        .update({ discord_server_id: null })
        .eq('discord_server_id', discord_server_id)
        .eq('owner_id', user.user.id)

    if (error) {
        return { error }
    }

    const { error: linkError } = await supabase
        .from('realms')
        .update({ discord_server_id })
        .eq('id', realm_id)
        .eq('owner_id', user.user.id)

    if (linkError) {
        return { error: linkError }
    }

    return { error: null }
}