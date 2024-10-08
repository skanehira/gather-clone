'use client'
import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useModal } from '@/app/hooks/useModal'
import BasicButton from '../BasicButton'

type NavbarChildProps = {
    name: string,
    avatar_url: string
}

export const NavbarChild:React.FC<NavbarChildProps> = ({ name, avatar_url }) => {

    const { setModal } = useModal()

    return (
        <div className='h-16'>
            <div className='w-full fixed bg-secondary flex flex-row items-center p-2 pl-4 justify-end sm:justify-between z-10'>
                <BasicButton onClick={() => setModal('Create Realm')} className='hidden sm:flex flex-row items-center gap-2 text-lg'>
                    Create Realm
                    <PlusCircleIcon className='h-5'/>
                </BasicButton>
                <div className='flex flex-row items-center gap-4 hover:bg-lightblue rounded-full cursor-pointer py-1 px-1 select-none' onClick={() => setModal('Account Dropdown')}>
                    <p className='text-white text-lg'>{name}</p>
                    <img src={avatar_url} className='aspect-square rounded-full w-12'/>
                </div>
            </div>
        </div> 
    )
}