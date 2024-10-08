import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { NavbarChild } from './NavbarChild'
import { formatEmailToName } from '@/utils/formatEmailToName'

export const Navbar:React.FC = async () => {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    console.log(user?.user_metadata)

    return (
        <NavbarChild name={formatEmailToName(user?.user_metadata.email)} avatar_url={user?.user_metadata.picture}/>
    )
}
