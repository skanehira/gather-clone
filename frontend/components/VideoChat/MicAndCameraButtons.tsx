import React from 'react'
import { VideoCameraSlash, MicrophoneSlash } from '@phosphor-icons/react'
import { useVideoChat } from '@/app/hooks/useVideoChat'

type MicAndCameraButtonsProps = {
    
}

const MicAndCameraButtons:React.FC<MicAndCameraButtonsProps> = () => {

    const { isCameraEnabled, isMicrophoneEnabled, toggleCamera } = useVideoChat()
    
    return (
        <section className='flex flex-row gap-2'>
            <button className={`${isMicrophoneEnabled ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#682E44] hover:bg-[#7a3650]'} p-2 rounded-full transition-colors duration-300 ease-in-out`}>
                <MicrophoneSlash className={`w-6 h-6 ${isMicrophoneEnabled ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`} />
            </button>
            <button 
                className={`${isCameraEnabled ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#682E44] hover:bg-[#7a3650]'} 
                p-2 rounded-full transition-colors duration-300 ease-in-out`}
                onClick={toggleCamera}
            >
                <VideoCameraSlash className={`w-6 h-6 ${isCameraEnabled ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`} />
            </button>
        </section>
        
    )
}

export default MicAndCameraButtons