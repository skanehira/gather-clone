import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ManageChild from '../ManageChild'
import NotFound from '../../not-found'
import { request } from '@/utils/backend/requests'

export default async function Manage({ params }: { params: { id: string } }) {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()

    if (!user || !session) {
        return redirect('/signin')
    }

    const { data, error } = await supabase.from('realms').select('id, name, owner_id, map_data, privacy_level, share_id, only_owner, discord_server_id').eq('id', params.id).single()
    // Show not found page if no data is returned
    if (!data) {
        return <NotFound />
    }
    const realm = data
    const { data: serverData, error: serverError } = await request('/getServerName', { serverId: realm.discord_server_id }, session.access_token)

    const discordError = serverError ? true : false

    return (
        <div>
            <ManageChild 
                realmId={realm.id} 
                privacyLevel={realm.privacy_level} 
                startingShareId={realm.share_id} 
                startingOnlyOwner={realm.only_owner} 
                starting_discord_id={realm.discord_server_id}
                discord_error={discordError}
                discord_server_name={serverData?.name}
                startingName={realm.name}
            />
        </div>
    )
}