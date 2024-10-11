import React from 'react'
import { useVideoChat } from '@/app/hooks/useVideoChat'
import { RemoteUser } from 'agora-rtc-react'

type VideoBarProps = {
    
}

const VideoBar:React.FC<VideoBarProps> = () => {

    const { remoteUsers } = useVideoChat()

    return (
        <main className='absolute z-10 w-full flex flex-col items-center pt-2 top-0'>
            <section className='flex flex-row items-center gap-4'>
                {remoteUsers.map((user) => (
                    <div key={user.uid} className='w-[233px] h-[130px] bg-secondary rounded-lg overflow-hidden'>
                        <RemoteUser user={user} />
                    </div>
                ))}
            </section>
        </main>
    )
}

export default VideoBar