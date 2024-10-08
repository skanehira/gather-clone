'use client'
import React, { useState } from 'react'
import Dropdown from '@/components/Dropdown'
import BasicButton from '@/components/BasicButton'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import revalidate from '@/utils/revalidate'
import { useModal } from '../hooks/useModal'
import { Copy } from '@phosphor-icons/react'
import { v4 as uuidv4 } from 'uuid'
import Toggle from '@/components/Toggle'
import BasicLoadingButton from '@/components/BasicLoadingButton'
import { unlinkFromDiscord } from '@/utils/supabase/unlinkFromDiscord'
import Link from 'next/link'
import BasicInput from '@/components/BasicInput'
import { removeExtraSpaces } from '@/utils/removeExtraSpaces'

type ManageChildProps = {
    realmId: string
    privacyLevel: 'anyone' | 'discord'
    startingShareId: string
    startingOnlyOwner: boolean
    starting_discord_id: string
    discord_server_name: string
    discord_error: boolean
    startingName: string
}

const privacyOptions = [
    'anyone with share link',
    'anyone in the discord server'
]

const ManageChild:React.FC<ManageChildProps> = ({ realmId, privacyLevel, startingShareId, startingOnlyOwner, starting_discord_id, discord_server_name, discord_error, startingName }) => {

    const [selectedTab, setSelectedTab] = useState(0)
    const [privacy, setPrivacy] = useState(getDropdownValue())
    const [shareId, setShareId] = useState(startingShareId)
    const [onlyOwner, setOnlyOwner] = useState(startingOnlyOwner)
    const [unlinkButtonLoading, setUnlinkButtonLoading] = useState(false)
    const [discordId, setDiscordId] = useState(starting_discord_id)
    const [name, setName] = useState(startingName)
    const { setModal, setLoadingText } = useModal()

    const supabase = createClient()

    function getDropdownValue() {
        if (privacyLevel === 'anyone') {
            return 'anyone with share link'
        } else {
            return 'anyone in the discord server'
        }
    }

    function getPrivacyLevel() {
        if (privacy === 'anyone with share link') {
            return 'anyone'
        } else {
            return 'discord'
        }
    }

    async function save() {
        if (name.trim() === '') {
            toast.error('Name cannot be empty!')
            return
        }

        setModal('Loading')
        setLoadingText('Saving...')

        const { error } = await supabase
            .from('realms')
            .update({ 
                    privacy_level: getPrivacyLevel(),
                    only_owner: onlyOwner,
                    name: name,
                })
            .eq('id', realmId)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Saved!')
        }

        revalidate('/manage/[id]')
        setModal('None')
    }

    function copyLink() {
        const link = process.env.NEXT_PUBLIC_BASE_URL + '/play/' + realmId + '?shareId=' + shareId
        navigator.clipboard.writeText(link)
        toast.success('Link copied!')
    }

    async function generateNewLink() {
        setModal('Loading')
        setLoadingText('Generating new link...')

        const newShareId = uuidv4()
        const { error } = await supabase
            .from('realms')
            .update({ 
                share_id: newShareId
                })
            .eq('id', realmId)

        if (error) {
            toast.error(error.message)
        } else {
            setShareId(newShareId)
            const link = process.env.NEXT_PUBLIC_BASE_URL + '/play/' + realmId + '?shareId=' + newShareId
            navigator.clipboard.writeText(link)
            toast.success('New link copied!')
        }

        revalidate('/manage/[id]')
        setModal('None')
    }

    async function onClickUnlink() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return
        }

        setUnlinkButtonLoading(true)
        const { error } = await unlinkFromDiscord(session.access_token, realmId)
        if (error) {
            toast.error(error.message)
        }
        setUnlinkButtonLoading(false)

        if (!error) {
            setDiscordId('')
            toast.success('Unlinked from Discord!')
            revalidate('/manage/[id]')
        }
    }

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = removeExtraSpaces(e.target.value)
        setName(value)
    }

    return (
        <div className='flex flex-col items-center pt-24'>
            <div className='flex flex-row gap-8 relative'>
                <div className='flex flex-col h-[500px] w-[200px] border-white border-r-2 pr-4 gap-2'>
                    <h1 className={`${selectedTab === 0 ? 'font-bold underline' : ''} cursor-pointer`} onClick={() => setSelectedTab(0)}>General</h1> 
                    <h1 className={`${selectedTab === 1 ? 'font-bold underline' : ''} cursor-pointer`} onClick={() => setSelectedTab(1)}>Sharing Options</h1> 
                    <h1 className={`${selectedTab === 2 ? 'font-bold underline' : ''} cursor-pointer`} onClick={() => setSelectedTab(2)}>Discord Channel</h1> 
                </div>
                <div className='flex flex-col w-[300px]'>
                    {selectedTab === 0 && (
                        <div className='flex flex-col gap-2'>
                            Name
                            <BasicInput value={name} onChange={onNameChange} maxLength={32}/>
                        </div>
                    )}
                    {selectedTab === 1 && (
                        <div className='flex flex-col gap-2'>
                            Who can join this realm?
                            <div>
                                <Dropdown items={privacyOptions} selectedItem={privacy} setSelectedItem={setPrivacy}/>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <h1>Only owner can join</h1>
                                <Toggle enabled={onlyOwner} setEnabled={setOnlyOwner}/>
                            </div>
                            <BasicButton className='flex flex-row items-center gap-2 text-sm max-w-max' onClick={copyLink}>
                                Copy Link <Copy />
                            </BasicButton>
                            <BasicButton className='flex flex-row items-center gap-2 text-sm max-w-max' onClick={generateNewLink}>
                                Generate New Link <Copy />
                            </BasicButton>
                        </div>
                    )}
                    {selectedTab === 2 && (
                        <div className='flex flex-col gap-2'>
                            {(!discordId || discord_error) && (
                                <div className='flex flex-col gap-1'>
                                    <h1>This realm is not linked to a Discord server.</h1>
                                    <Link href='/howtolink'>
                                        <BasicButton className='max-w-max'>
                                            Link to Discord
                                        </BasicButton>
                                    </Link>
                                </div>
                            )}
                            {(discordId && !discord_error) && (
                                <div className='flex flex-col gap-2'>
                                    <h1>Linked to server: <span className='font-bold'>{discord_server_name}</span></h1>
                                    <BasicLoadingButton loading={unlinkButtonLoading} className='max-w-max' onClick={onClickUnlink}>
                                        Unlink from Discord
                                    </BasicLoadingButton>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                <BasicButton className='absolute bottom-[-50px] right-0' onClick={save}>
                    Save
                </BasicButton>
            </div>
        </div>
    )
}

export default ManageChild