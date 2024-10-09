'use client'
import React from 'react'
import BasicButton from '@/components/BasicButton'
import AnimatedCharacter from './SkinMenu/AnimatedCharacter'
import { useLocalCameraTrack, useLocalMicrophoneTrack, LocalVideoTrack, useRTCClient } from 'agora-rtc-react'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'

type IntroScreenProps = {
    realmName: string
    initialSkin: string
    username: string
    setShowIntroScreen: (show: boolean) => void
}

const IntroScreen:React.FC<IntroScreenProps> = ({ realmName, initialSkin, username, setShowIntroScreen }) => {

    const src = '/sprites/characters/Character_' + initialSkin + '.png'

    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }))

    return (
        <AgoraRTCProvider client={client}>
            <main className='dark-gradient w-full h-screen flex flex-col items-center pt-28'>
                <h1 className='text-4xl font-semibold'>Welcome to <span className='text-[#CAD8FF]'>{realmName}</span></h1>
                <section className='flex flex-row mt-32 items-center gap-24'>
                    <div className='aspect-video w-[337px] h-[227px] bg-black rounded-xl border-2 border-[#3F4776]'>
                        <LocalVideo/>
                    </div>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='flex flex-row items-center'>
                            <AnimatedCharacter src={src}/>
                            <p className='relative top-4'>{username}</p>
                        </div>
                        <BasicButton className='py-0 px-32' onClick={() => setShowIntroScreen(false)}>
                            Join
                        </BasicButton>
                    </div>
                </section>
            </main>
        </AgoraRTCProvider>
    )
}

export default IntroScreen

function LocalVideo() {
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack()
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack()

    return (
        <LocalVideoTrack 
            track={localCameraTrack}
            play={true}
            className='w-full h-full'
        />
    )
}