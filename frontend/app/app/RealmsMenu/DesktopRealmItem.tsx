import { DotsThreeVertical, Link as LinkIcon } from '@phosphor-icons/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/app/hooks/useModal'
import Link from 'next/link'
import { toast } from 'react-toastify'

type DesktopRealmItemProps = {
    name: string,
    id: string,
    shareId: string,
    shared?: boolean,
    playerCount?: number
}

const DesktopRealmItem:React.FC<DesktopRealmItemProps> = ({ name, id, shareId, shared, playerCount }) => {
    
    const [showMenu, setShowMenu] = useState<boolean>(false)  
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)
    const dotsRef = useRef<HTMLDivElement>(null)
    const { setRealmToDelete, setModal } = useModal()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && dotsRef.current && !dotsRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    function handleDotsClick() {
        setShowMenu(!showMenu)
    }

    function handleDelete() {
        setRealmToDelete({ name, id })
        setModal('Delete Realm')
    }

    function getLink() {
        if (shared) {
            return `/play/${id}?shareId=${shareId}`
        } else {
            return `/play/${id}`
        }
    }

    function copyShareLink() {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/play/${id}?shareId=${shareId}`)
        toast.success('Link copied!')
    }

    return (
        <div className='relative select-none'>
            <Link href={getLink()}>
                <div className='w-full aspect-video rounded-3xl overflow-hidden relative'>
                    {playerCount !== undefined && playerCount !== null && (
                        <div className='absolute top-2 left-2 rounded-full px-2 py-1 flex flex-row bg-black bg-opacity-80 gap-2 items-center max-w-max'>
                            <div className='bg-green-500 w-3 h-3 rounded-full'/>
                            <p className='text-sm'>{playerCount}</p>
                        </div>
                    )}
                    <div className='w-full h-full bg-black opacity-0 absolute hover:opacity-25'/>
                    <img src='/thumbnail.png' style={{imageRendering: 'pixelated'}}/>
                    <div className='animate-pulse w-full h-full bg-secondary absolute'/>
                </div>
            </Link>
            <div className='mt-1 flex flex-row justify-between'>
                <p>{name}</p>
                {!shared && (
                    <div className='flex flex-row'>
                        <LinkIcon className='h-7 w-7 cursor-pointer hover:bg-neutral-900 rounded-md p-1' onClick={copyShareLink}/>
                    <div ref={dotsRef}>
                        <DotsThreeVertical className='h-7 w-7 cursor-pointer hover:bg-neutral-900 rounded-md p-1' onClick={handleDotsClick}/>
                    </div>
                </div>)}
            </div>
            {showMenu && (
                <div className='absolute w-36 h-24 rounded-lg bg-secondary right-0 flex flex-col z-10' ref={menuRef}>
                    <button className='grow w-full hover:bg-lightblue rounded-t-lg text-left pl-4' onClick={() => router.push(`/editor/${id}`)}>
                        Edit Map
                    </button>
                    <button className='grow w-full hover:bg-lightblue text-left pl-4' onClick={() => router.push(`/manage/${id}`)}>Manage</button>
                    <button className='grow w-full hover:bg-red-500 rounded-b-lg text-left pl-4' onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    )
}

export default DesktopRealmItem