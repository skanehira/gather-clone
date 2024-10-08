import React from 'react'
import NotFound from '@/app/not-found'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getPlayRealmData } from '@/utils/supabase/getPlayRealmData'
import PlayClient from '../Play'
import { updateVisitedRealms } from '@/utils/supabase/updateVisitedRealms'

export default async function Play({ params, searchParams }: { params: { id: string }, searchParams: { shareId: string } }) {

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    if (!session || !user) {
        return redirect('/signin')
    }
    const { data, error } = !searchParams.shareId ? await supabase.from('realms').select('map_data, owner_id, discord_server_id').eq('id', params.id).single() : await getPlayRealmData(session.access_token, searchParams.shareId)
    const { data: profile, error: profileError } = await supabase.from('profiles').select('skin, discord_id').eq('id', user.id).single()
    // Show not found page if no data is returned
    if (!data || !profile) {
        const message = error?.message || profileError?.message

        return <NotFound specialMessage={message}/>
    }
    const realm = data
    const map_data = realm.map_data

    let skin = profile.skin

    if (searchParams.shareId && realm.owner_id !== user.id) {
        updateVisitedRealms(session.access_token, searchParams.shareId)
    }

    return (
        <PlayClient 
            mapData={map_data} 
            username={user.user_metadata.custom_claims.global_name || user.user_metadata.full_name} 
            access_token={session.access_token} 
            realmId={params.id} 
            uid={user.id} 
            shareId={searchParams.shareId || ''} 
            initialSkin={skin}
            serverId={realm.discord_server_id}
            discordId={profile.discord_id}
        />
    )
}