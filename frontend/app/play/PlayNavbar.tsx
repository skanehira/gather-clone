import React from 'react'
import { TShirt } from '@phosphor-icons/react'
import { useModal } from '../hooks/useModal'
import signal from '@/utils/signal'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import MicAndCameraButtons from '@/components/VideoChat/MicAndCameraButtons'

type PlayNavbarProps = {
    
}


const PlayNavbar:React.FC<PlayNavbarProps> = () => {

    const { setModal } = useModal()

    function onClickSkinButton() {
        setModal('Skin')
        signal.emit('requestSkin')
    }

    return (
        <div className='bg-secondary w-full h-14 absolute bottom-0 flex flex-row items-center px-2 gap-4'>
            <Link href='/app' className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-darkblue hover:bg-light-secondary'>
                <ArrowLeftEndOnRectangleIcon className='h-8 w-8'/>
            </Link>
            <MicAndCameraButtons />
            <button className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-darkblue hover:bg-light-secondary ml-auto' onClick={onClickSkinButton}>
                <TShirt className='h-8 w-8'/>
            </button>
        </div>
    )
}

export default PlayNavbar