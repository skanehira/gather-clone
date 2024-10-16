import React, { useEffect, useRef, useState } from 'react'
import { useVideoChat } from '@/app/hooks/useVideoChat'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import signal from '@/utils/signal'

type VideoBarProps = {
    
}

const VideoBar:React.FC<VideoBarProps> = () => {

    const [remoteUsers, setRemoteUsers] = useState<{ [uid: string]: IAgoraRTCRemoteUser }>({})

    useEffect(() => {
        const onUserPublished = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers(prev => ({ ...prev, [user.uid]: user }))
        }

        signal.on('user-published', onUserPublished)

        return () => {
            signal.off('user-published', onUserPublished)
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

function RemoteUser({ user }: { user: IAgoraRTCRemoteUser }) {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // if the container has a child, remove it
        if (containerRef.current?.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild)
        }

        user.videoTrack?.play(`remote-user-${user.uid}`)
    }, [])

    return (
        <div ref={containerRef} id={`remote-user-${user.uid}`} className='w-[233px] h-[130px] bg-secondary rounded-lg overflow-hidden'>
            
        </div>
    )
}