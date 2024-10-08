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
        <div className='bg-secondary w-full sm:w-[600px] md:w-[750px] lg:w-[950px] h-14 sm:absolute sm:bottom-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:rounded-tl-2xl sm:rounded-tr-2xl flex flex-row items-center px-2 justify-between gap-4'>
            <Link href='/app' className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-darkblue hover:bg-lightblue'>
                <ArrowLeftEndOnRectangleIcon className='h-8 w-8'/>
            </Link>
            <form className='grow h-10 bg-lightblue rounded-full flex flex-row' autoComplete='off' onSubmit={onSubmit}>
                <input 
                    type='text' 
                    className='grow rounded-full bg-transparent outline-none p-2 pl-4' 
                    spellCheck='false' 
                    autoComplete='false' 
                    onFocus={onFocus} 
                    onBlur={onBlur} 
                    value={input} 
                    onChange={onChange}
                    maxLength={300}
                    placeholder='type a message...'
                />
                <button className='w-10 h-10 rounded-full bg-darkblue grid place-items-center hover:bg-lightblue border-2 border-white outline-none'>
                    <PaperPlaneRight className='w-6 h-6'/>
                </button>
            </form>
            <button className='aspect-square grid place-items-center rounded-lg p-1 outline-none bg-darkblue hover:bg-lightblue' onClick={onClickSkinButton}>
                <TShirt className='h-8 w-8'/>
            </button>
        </div>
    )
}

export default PlayNavbar