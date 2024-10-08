import AnimatedCharacter from './play/SkinMenu/AnimatedCharacter';
import Link from 'next/link';

export default async function Index() {

  return (
    <div className='w-full pt-48 p-8 flex flex-col items-center'>
        <div className='max-w-96 flex flex-col items-center'>
            <div className='w-full h-2 bg-primary'/>
            <div className='w-full flex flex-row justify-between'>
                <AnimatedCharacter src='/sprites/characters/Character_012.png'/>
                <AnimatedCharacter src='/sprites/characters/Character_013.png'/>
                <AnimatedCharacter src='/sprites/characters/Character_024.png'/>
                <AnimatedCharacter src='/sprites/characters/Character_028.png'/>
            </div>     
            <h1 className='font-bold text-3xl'>Make your Discord server open-world</h1>   
            <p className='w-full text-xl mb-6'>Create a 2D pixel art world. Invite your friends to play. Integrate it with your Discord server.</p>
            <Link href='/app' className='bg-rainbow-less hover:bg-rainbow-less-hover p-2 rounded-md font-bold mb-6'>Open App</Link>
            <p className='mt-6'></p>
            <div className='flex flex-row items-center'>
                <div className='relative bottom-4'>
                    <AnimatedCharacter src='/sprites/characters/Character_009.png'/>
                </div>
                <p className='text-sm text-gray-500'>created by <a href="https://x.com/trevdev__" target="_blank" rel="noopener noreferrer" className='font-bold underline'>trevdev</a></p>
            </div>
        </div>
    </div>
  )
}
