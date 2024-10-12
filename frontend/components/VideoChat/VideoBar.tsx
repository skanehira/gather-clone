import React, { useEffect } from 'react'
import { useVideoChat } from '@/app/hooks/useVideoChat'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'

type VideoBarProps = {
    
}

const VideoBar:React.FC<VideoBarProps> = () => {


    return (
        <main className='absolute z-10 w-full flex flex-col items-center pt-2 top-0'>
            <section className='flex flex-row items-center gap-4' id='video-container'>

            </section>
        </main>
    )
}

export default VideoBar

function RemoteUser({ user }: { user: IAgoraRTCRemoteUser }) {

    return (
        <div id={`remote-user-${user.uid}`} className='w-[233px] h-[130px] bg-secondary rounded-lg overflow-hidden'>
            
        </div>
    )
}