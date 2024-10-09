import React, { useState } from 'react'
import { TShirt } from '@phosphor-icons/react'
import { useModal } from '../hooks/useModal'
import signal from '@/utils/signal'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { removeExtraSpaces } from '@/utils/removeExtraSpaces'

type PlayNavbarProps = {
    
}


const PlayNavbar:React.FC<PlayNavbarProps> = () => {

    const { setModal } = useModal()
    const [input, setInput] = useState('')

    function onClickSkinButton() {
        setModal('Skin')
        signal.emit('requestSkin')
    }

    function onFocus() {
        signal.emit('disableInput', true)
    }

    function onBlur() {
        signal.emit('disableInput', false)
    }

    function onSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (input.trim() === '') return
        // unfocus the input
        e.currentTarget.querySelector('input')?.blur()
        signal.emit('message', input)
        setInput('')
    }

    function onChange(e:React.ChangeEvent<HTMLInputElement>) {
        const value = removeExtraSpaces(e.target.value)
        setInput(value)
    }
    
    return (
        <div className='bg-secondary w-full h-14 absolute bottom-0 flex flex-row items-center px-2 justify-between gap-4'>
            <Link href='/app' className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-darkblue hover:bg-light-secondary'>
                <ArrowLeftEndOnRectangleIcon className='h-8 w-8'/>
            </Link>
            <button className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-darkblue hover:bg-light-secondary' onClick={onClickSkinButton}>
                <TShirt className='h-8 w-8'/>
            </button>
        </div>
    )
}

export default PlayNavbar