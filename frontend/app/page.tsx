'use client'
import AnimatedCharacter from './play/SkinMenu/AnimatedCharacter'
import Link from 'next/link'
import BasicButton from '@/components/BasicButton'
import { Code } from '@phosphor-icons/react'

export default function Index() {

  return (
    <div className='w-full grid place-items-center h-screen gradient p-4'>
        <div className='max-w-[600px] flex flex-col items-center'>
            <div>
                <h1 className='font-semibold text-3xl'>Welcome to My Gather Town Clone!</h1>   
                <p className='w-full text-xl my-6'>
                    This project is a functional recreation of the core features of Gather Town, 
                    built as a portfolio piece to demonstrate my passion for virtual spaces and the technical skills
                    needed to contribute to your team at Gather. 
                </p>
            </div>
            
            <div className='flex flex-row items-center justify-center'>
                <Link href='/app' >
                    <BasicButton>
                        Get Started
                    </BasicButton>
                </Link>
            </div>
            <div className='flex flex-row items-center justify-center mt-6'>
                <div className='relative bottom-4'>
                    <AnimatedCharacter src='/sprites/characters/Character_009.png'/>
                </div>
                <p className='text-sm'>created by <a href="https://www.trevdev.me/" target="_blank" rel="noopener noreferrer" className='font-bold underline'>trevdev</a></p>
            </div>
            <a href='https://github.com/trevorwrightdev/gather-clone' target="_blank" rel="noopener noreferrer" 
                className='inline-flex flex-row items-center justify-center gap-2 hover:underline mt-6'>
                <p className='text-sm'>see the code</p>
                <Code className='w-4 h-4'/>
            </a>
        </div>
    </div>
  )
}
