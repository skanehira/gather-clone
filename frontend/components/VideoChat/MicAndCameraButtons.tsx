import React from 'react'
import { VideoCameraSlash, MicrophoneSlash } from '@phosphor-icons/react'

type MicAndCameraButtonsProps = {
    
}

const MicAndCameraButtons:React.FC<MicAndCameraButtonsProps> = () => {
    
    return (
        <section className='flex flex-row gap-2'>
            <button className='bg-[#682E44] hover:bg-[#7a3650] p-2 rounded-full transition-colors duration-300 ease-in-out'>
                <MicrophoneSlash className='w-6 h-6 text-[#FF2F49]' />
            </button>
            <button className='bg-[#682E44] hover:bg-[#7a3650] p-2 rounded-full transition-colors duration-300 ease-in-out'>
                <VideoCameraSlash className='w-6 h-6 text-[#FF2F49]' />
            </button>
        </section>
        
    )
}

export default MicAndCameraButtons