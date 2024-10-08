'use client'
import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import BasicButton from '../BasicButton'
import BasicInput from '../BasicInput'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation' 
import revalidate from '@/utils/revalidate'
import { removeExtraSpaces } from '@/utils/removeExtraSpaces'

const CreateRealmModal:React.FC = () => {
    
    const { modal, setModal } = useModal()
    const [realmName, setRealmName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    async function createRealm() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return
        }

        const uid = user.id

        setLoading(true)
        const { data, error } = await supabase.from('realms').insert({
            owner_id: uid,
            name: realmName,
        }).select()

        if (error) {
            toast.error(error?.message)
        } 

        if (data) {
            setRealmName('')
            revalidate('/app')
            setModal('None')
            toast.success('Your new realm has been created!')
            router.push(`/editor/${data[0].id}`)
        }

        setLoading(false)
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = removeExtraSpaces(e.target.value)
        setRealmName(value)
    }

    return (
        <Modal open={modal === 'Create Realm'} closeOnOutsideClick>
            <div className='flex flex-col items-center p-4 w-[400px] gap-4'>
                <h1 className='text-2xl'>Create a Realm</h1>
                <BasicInput label={'Realm Name'} className='w-[280px]' value={realmName} onChange={onChange} maxLength={32}/>
                <BasicButton disabled={realmName.length <= 0 || loading} onClick={createRealm} className='text-lg'>
                    Create
                </BasicButton>
            </div>
        </Modal>
    )
}

export default CreateRealmModal