import React, { useEffect, useRef, useState } from 'react'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import signal from '@/utils/signal'
import { MicrophoneSlash } from '@phosphor-icons/react'

interface RemoteUser {
    uid: string
    micEnabled: boolean
    cameraEnabled: boolean
    user: IAgoraRTCRemoteUser
}

const VideoBar:React.FC = () => {

    const [remoteUsers, setRemoteUsers] = useState<{ [uid: string]: RemoteUser }>({})

    useEffect(() => {
        const onUserPublished = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers(prev => ({ ...prev, [user.uid]: {
                uid: user.uid.toString(),
                micEnabled: user.hasAudio,
                cameraEnabled: user.hasVideo,
                user: user,
            } }))
        }
        const onResetUsers = () => {
            setRemoteUsers({})
        }
        const onUserLeft = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers(prev => {
                const newUsers = { ...prev }
                delete newUsers[user.uid]
                return newUsers
            })
        }

        signal.on('user-published', onUserPublished)
        signal.on('reset-users', onResetUsers)
        signal.on('user-left', onUserLeft)

        return () => {
            signal.off('user-published', onUserPublished)
            signal.off('reset-users', onResetUsers)
            signal.off('user-left', onUserLeft)
        }
    }, [])

    return (
        <main className='absolute z-10 w-full flex flex-col items-center pt-2 top-0'>
            <section className='flex flex-row items-center gap-4' id='video-container'>
                {Object.values(remoteUsers).map(user => (
                    <RemoteUser key={user.uid} user={user} />
                ))}
            </section>
        </main>
    )
}

export default VideoBar

function RemoteUser({ user }: { user: RemoteUser }) {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // if the container has a child, remove it
        if (containerRef.current?.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild)
        }

        user.user.videoTrack?.play(`remote-user-${user.uid}`)
    }, [user])

    return (
        <div className='w-[233px] h-[130px] bg-primary bg-opacity-70 rounded-lg overflow-hidden relative'>
            <div ref={containerRef} id={`remote-user-${user.uid}`} className='w-full h-full'></div>
            <p className='absolute bottom-1 left-2 bg-black bg-opacity-70 rounded-full z-10 text-xs p-1 px-2 select-none flex flex-row items-center gap-1'>
                {!user.micEnabled && <MicrophoneSlash className='w-3 h-3 text-[#FF2F49]' />}
                {user.uid}
            </p>
        </div>
    )
}