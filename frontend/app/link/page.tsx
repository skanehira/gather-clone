import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LinkClient from './LinkClient'

export default async function LinkRealm({ searchParams }: { searchParams: { id: string, name: string } }) {

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin')
    }

    const { data: ownedRealms, error } = await supabase.from('realms').select('id, name').eq('owner_id', user.id)

    return (
        <LinkClient serverId={searchParams.id} serverName={searchParams.name} ownedRealms={ownedRealms}/>
    )
}
