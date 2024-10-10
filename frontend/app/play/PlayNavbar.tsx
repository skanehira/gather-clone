import React from 'react'
import { TShirt } from '@phosphor-icons/react'
import { useModal } from '../hooks/useModal'
import signal from '@/utils/signal'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import MicAndCameraButtons from '@/components/VideoChat/MicAndCameraButtons'
import { LocalVideoTrack } from 'agora-rtc-react'
import { useVideoChat } from '../hooks/useVideoChat'
import AnimatedCharacter from './SkinMenu/AnimatedCharacter'

type PlayNavbarProps = {
    username: string
    skin: string
}


const PlayNavbar:React.FC<PlayNavbarProps> = ({ username, skin }) => {

    const { setModal } = useModal()
    const { localCameraTrack, isCameraEnabled } = useVideoChat()
    function onClickSkinButton() {
        setModal('Skin')
        signal.emit('requestSkin')
    }

    return (
        <div className='bg-primary w-full h-14 absolute bottom-0 flex flex-row items-center p-2 gap-4'>
            <Link href='/app' className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-secondary hover:bg-light-secondary transition-colors duration-300 ease-in-out'>
                <ArrowLeftEndOnRectangleIcon className='h-8 w-8'/>
            </Link>
            <div className='h-full w-[200px] bg-secondary rounded-lg overflow-hidden flex flex-row'>
                <div className='w-[60px] h-full border-r-[1px] border-gray relative grid place-items-center'>
                    <AnimatedCharacter src={'/sprites/characters/Character_' + skin + '.png'} noAnimation className='w-8 h-8 absolute bottom-1' />
                    {isCameraEnabled && <LocalVideoTrack 
                        track={localCameraTrack}
                        play={true}
                        className='w-full h-full absolute'
                    />}
                </div>
                <div className='w-full flex flex-col p-1'>
                    <p className='text-white text-xs'>{username}</p>
                    <p className='text-[#BDBDBD] text-xs'>Available</p>
                </div>
            </div>
            <MicAndCameraButtons />
            <button className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-secondary hover:bg-light-secondary ml-auto transition-colors duration-300 ease-in-out' onClick={onClickSkinButton}>
                <TShirt className='h-8 w-8'/>
            </button>
        </div>
    )
}

export default PlayNavbar