import React from 'react'
import BasicButton from '@/components/BasicButton'
import AnimatedCharacter from './SkinMenu/AnimatedCharacter'

type IntroScreenProps = {
    realmName: string
    initialSkin: string
    username: string
}

const IntroScreen:React.FC<IntroScreenProps> = ({ realmName, initialSkin, username }) => {

    const src = '/sprites/characters/Character_' + initialSkin + '.png'
    
    return (
        <main className='dark-gradient w-full h-screen flex flex-col items-center pt-28'>
            <h1 className='text-4xl font-semibold'>Welcome to <span className='text-[#CAD8FF]'>{realmName}</span></h1>
            <section className='flex flex-row mt-32 items-center gap-24'>
                <div className='aspect-video w-[337px] h-[227px] bg-black rounded-xl border-2 border-[#3F4776]'>

                </div>
                <div className='flex flex-col items-center gap-4'>
                    <div className='flex flex-row items-center'>
                        <AnimatedCharacter src={src}/>
                        <p className='relative top-4'>{username}</p>
                    </div>
                    <BasicButton className='py-0 px-32'>
                        Join
                    </BasicButton>
                </div>
            </section>
        </main>
    )
}

export default IntroScreen