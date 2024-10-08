'use client'
import { createClient } from '@/utils/supabase/client'
import DiscordSignInButton from './DiscordSignInButton'

export default function Login() {

    const signInWithDiscord = async () => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: process.env.NEXT_PUBLIC_BASE_URL + '/auth/callback'
            }
        })
    }

  return (
    <div className='flex flex-col items-center w-full pt-56'>
        <DiscordSignInButton onClick={signInWithDiscord}/>
    </div>
  );
}
