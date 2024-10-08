'use client'
import React, { useEffect } from 'react'
import PixiApp from './PixiApp'
import { RealmData } from '@/utils/pixi/types'
import PlayNavbar from './PlayNavbar'
import { useModal } from '../hooks/useModal'
import signal from '@/utils/signal'
import ChatLog from './ChatLog'
import revalidate from '@/utils/revalidate'

type PlayProps = {
    mapData: RealmData
    username: string
    access_token: string
    realmId: string
    uid: string
    shareId: string
    initialSkin: string
    serverId: string
    discordId: string,
}

const PlayClient:React.FC<PlayProps> = ({ mapData, username, access_token, realmId, uid, shareId, initialSkin, serverId, discordId }) => {

    const { setErrorModal, setDisconnectedMessage } = useModal()

    useEffect(() => {
        const onShowKickedModal = (message: string) => { 
            setErrorModal('Disconnected')
            setDisconnectedMessage(message)
        }

        const onShowDisconnectModal = () => {
            setErrorModal('Disconnected')
            setDisconnectedMessage('You have been disconnected from the server.')
        }

        signal.on('showKickedModal', onShowKickedModal)
        signal.on('showDisconnectModal', onShowDisconnectModal)

        return () => {
            signal.off('showKickedModal', onShowDisconnectModal)
            signal.off('showDisconnectModal', onShowDisconnectModal)
        }
    }, [])

    return (
        <div className='relative w-full h-screen flex flex-col-reverse sm:flex-col'>
            <PixiApp 
                mapData={mapData} 
                className='w-full grow sm:h-full sm:flex-grow-0' 
                username={username} 
                access_token={access_token} 
                realmId={realmId} 
                uid={uid} 
                shareId={shareId} 
                initialSkin={initialSkin} 
                serverId={serverId}
                discordId={discordId}
            />
            <PlayNavbar />
            <ChatLog />
        </div>
    )
}
export default PlayClient