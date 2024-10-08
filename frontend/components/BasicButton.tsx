import React from 'react'

type BasicButtonProps = {
    children?: React.ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
}

const BasicButton:React.FC<BasicButtonProps> = ({ children, className, onClick, disabled }) => {
    
    return (
        <button className={`bg-quaternary hover:bg-quaternaryhover py-1 px-2 rounded-3xl ${disabled ? 'bg-quaternarydisabled pointer-events-none text-gray-400' : ''} ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default BasicButton