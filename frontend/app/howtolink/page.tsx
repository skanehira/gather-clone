import BasicButton from '@/components/BasicButton'

export default async function HowToLink() {

    return (
        <div className='grid place-items-center'>
            <div className='flex flex-col items-center pt-24 gap-4 max-w-[400px]'>
                <h1 className='text-2xl'>Link your Discord server to a Realm</h1>
                <div className='text-lg flex flex-col items-center gap-1'>
                    1. First, add the bot to your server with the button below!
                    <a href="https://discord.com/oauth2/authorize?client_id=1231364046893088849&permissions=0&integration_type=0&scope=applications.commands+bot" target="_blank" rel="noopener noreferrer">
                        <BasicButton>
                            Get the bot
                        </BasicButton>
                    </a>
                </div>
                <div className='text-lg'>
                    2. Next, use the <span className='font-bold text-cyan-500'>/link</span> command to link it to a Realm.
                </div>
                <div className='text-lg'>
                    3. Finally, use the <span className='font-bold text-cyan-500'>/connect</span> and <span className='font-bold text-cyan-500'>/disconnect</span> commands to connect the chat between a room and a Discord channel.
                </div>
            </div>
        </div>
    )
}
