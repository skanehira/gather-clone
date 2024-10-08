'use client'
import React, { useState } from 'react'
import LinkScreen from './LinkScreen'
import { CheckCircle } from '@phosphor-icons/react'
import Link from 'next/link'

type LinkClientProps = {
    serverName: string,
    serverId: string
    ownedRealms: any
}

const LinkClient:React.FC<LinkClientProps> = ({ serverName, serverId, ownedRealms }) => {
    
    const [showEndScreen, setShowEndScreen] = useState(false)

    return (
        <div className='pt-36 place-items-center grid px-12'>
            {!showEndScreen && <LinkScreen serverId={serverId} serverName={serverName} ownedRealms={ownedRealms} setShowEndScreen={setShowEndScreen}/>}
            {showEndScreen && (
                <div className='flex flex-col items-center gap-8'>
                    <CheckCircle className='w-36 h-36 text-green-500'/>
                    <h1 className='text-green-500'>Your realm has been linked!</h1>
                    <Link href='/app'>
                        <button className='bg-secondary hover:bg-lightblue text-white px-2 py-1 rounded-md outline-none'>Home</button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default LinkClient