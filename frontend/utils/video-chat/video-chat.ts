import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser, IDataChannelConfig } from 'agora-rtc-sdk-ng'

export class VideoChat {
    private client: IAgoraRTCClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
    private microphoneTrack: IMicrophoneAudioTrack | null = null
    private cameraTrack: ICameraVideoTrack | null = null
    private currentChannel: string = ''

    private remoteUsers: { [uid: string]: IAgoraRTCRemoteUser } = {}

    constructor() {
        AgoraRTC.setLogLevel(4)
        this.client.on('user-published', this.onUserJoined)
        this.client.on('user-left', this.onUserLeft)
    }

    public onUserJoined = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "datachannel", config?: IDataChannelConfig) => {
        this.remoteUsers[user.uid] = user
        await this.client.subscribe(user, mediaType)
        console.log('USER JOINED')

        if (mediaType === 'video') {
            let player = document.getElementById(`remote-user-${user.uid}`)
            if (player) {
                player.remove()
            }

            const newPlayer = document.createElement('div')
            newPlayer.id = `remote-user-${user.uid}`
            newPlayer.className = 'w-[233px] h-[130px] bg-secondary rounded-lg overflow-hidden'
            document.getElementById('video-container')?.appendChild(newPlayer)

            user.videoTrack?.play(`remote-user-${user.uid}`)
        }

        if (mediaType === 'audio') {
            user.audioTrack?.play()
        }
    }

    public onUserLeft = (user: IAgoraRTCRemoteUser, reason: string) => {
        delete this.remoteUsers[user.uid]
        document.getElementById(`remote-user-${user.uid}`)?.remove()
    }

    public async toggleCamera() {
        if (!this.cameraTrack) {
            this.cameraTrack = await AgoraRTC.createCameraVideoTrack()
            this.cameraTrack.play('local-video')

            if (this.client.connectionState === 'CONNECTED') {
                await this.client.publish([this.cameraTrack])
            }

            return false
        }
        await this.cameraTrack.setEnabled(!this.cameraTrack.enabled)
        return !this.cameraTrack.enabled
    }

    public async toggleMicrophone() {
        if (!this.microphoneTrack) {
            this.microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()

            if (this.client.connectionState === 'CONNECTED') {
                await this.client.publish([this.microphoneTrack])
            }

            return false
        }
        await this.microphoneTrack.setEnabled(!this.microphoneTrack.enabled)
        return !this.microphoneTrack.enabled
    }

    public playVideoTrackAtElementId(elementId: string) {
        if (this.cameraTrack) {
            this.cameraTrack.play(elementId)
        }
    }

    private resetRemoteUsers() {
        Object.values(this.remoteUsers).forEach((user) => {
            document.getElementById(`remote-user-${user.uid}`)?.remove()
        })
        this.remoteUsers = {}
    }

    public async joinChannel(channel: string) {
        if (channel === this.currentChannel) return
        if (this.client.connectionState === 'CONNECTED') {
            await this.client.leave()
        }
        this.resetRemoteUsers()

        await this.client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID!, channel, null)
        this.currentChannel = channel

        if (this.microphoneTrack && this.microphoneTrack.enabled) {
            await this.client.publish([this.microphoneTrack])
        }
        if (this.cameraTrack && this.cameraTrack.enabled) {
            await this.client.publish([this.cameraTrack])
        }
    }

    public async leaveChannel() {
        if (this.currentChannel === '') return

        if (this.client.connectionState === 'CONNECTED') {
            await this.client.leave()
            this.currentChannel = ''
        }
        this.resetRemoteUsers()
    }

    public destroy() {
        if (this.cameraTrack) {
            this.cameraTrack.stop()
            this.cameraTrack.close()
        }
        if (this.microphoneTrack) {
            this.microphoneTrack.stop()
            this.microphoneTrack.close()
        }
        this.microphoneTrack = null
        this.cameraTrack = null
    }
}

export const videoChat = new VideoChat()
