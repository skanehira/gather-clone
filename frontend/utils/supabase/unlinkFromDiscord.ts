'use server'
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export async function unlinkFromDiscord(access_token: string, realm_id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    const { data: user, error: userError } = await supabase.auth.getUser(access_token)
    if (!user || !user.user) {
        return { error: userError }
    }

    const { error } = await supabase
        .from('realms')
        .update({ discord_server_id: null })
        .eq('id', realm_id)
        .eq('owner_id', user.user.id)

    if (error) {
        return { error }
    }

    return { error: null }
}