import React from 'react'

type AnimatedCharacterProps = {
    src: string
    className?: string
}

const AnimatedCharacter:React.FC<AnimatedCharacterProps> = ({ src, className }) => {
    
    return (
        <div className={`relative aspect-square w-20 overflow-hidden ${className}`}>
            <div className='character-container'>
                <img src={src} style={{imageRendering: 'pixelated'}} className='character'/>
            </div>
        </div>
    )
}

export default AnimatedCharacter