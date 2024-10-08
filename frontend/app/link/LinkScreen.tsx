import Link from 'next/link'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import LinkRealmDropdown from '@/components/LinkRealmDropdown'
import { linkDiscordServer } from '@/utils/supabase/linkDiscordServer'
import BasicLoadingButton from '@/components/BasicLoadingButton'

type LinkScreenProps = {
    ownedRealms: any,
    serverName: string,
    serverId: string,
    setShowEndScreen: (show: boolean) => void
}

const LinkScreen:React.FC<LinkScreenProps> = ({ ownedRealms, serverName, serverId , setShowEndScreen}) => {
    
    const [selectedRealm, setSelectedRealm] = useState(ownedRealms?.[0] ?? null)
    const [loading, setLoading] = useState(false)

    const supabase = createClient()


    function getRealmTitle() {
        if (selectedRealm) {
            return <span className='text-3xl font-bold text-quaternaryhover'>{selectedRealm.name}</span>
        } else {
            return <span>a realm.</span>
        }
    }

    async function onLink() {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setLoading(false)
            return toast.error('You must be signed in to link a realm to a server.')
        }

        const { error } = await linkDiscordServer(session.access_token, serverId, selectedRealm.id)
        if (error) {
            toast.error(error.message)
        } else {
            setShowEndScreen(true)
        }

        setLoading(false)
    }

    return (
        <div className='flex flex-col items-center gap-12'>
            <h1 className='text-xl text-center'>link <span className='font-bold text-3xl text-[#5764F2]'>{serverName}</span> to {getRealmTitle()}</h1>
            {!ownedRealms || ownedRealms.length === 0 && (
                <h1 className='text-lg'>You haven't made any realms! Click <Link href='/app' className='underline'>here</Link> to make one!</h1>
            )}
            {ownedRealms && ownedRealms.length > 0 && (
                <div className='flex flex-col items-center gap-2'>
                    <h1 className='3xl font-bold'>What will happen:</h1>
                    <ul className='list-disc max-w-[450px]'>
                        <li>Messages will be shared between the Discord channels and rooms that you link together.</li>
                        <li>It basically combines your realm chat and your Discord chat!</li>
                    </ul>
                    <h1 className='mt-12'>Choose a realm to link to your server!</h1>
                    <h1 className='max-w-[350px] text-center'></h1>
                    <LinkRealmDropdown realms={ownedRealms} setSelectedRealm={setSelectedRealm} selectedRealm={selectedRealm} />
                    <BasicLoadingButton onClick={onLink} loading={loading}>
                        Link 🚀
                    </BasicLoadingButton>
                </div>
            )}
        </div>
    )
}

export default LinkScreen