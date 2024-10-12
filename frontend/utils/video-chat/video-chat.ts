import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser, IDataChannelConfig } from 'agora-rtc-sdk-ng'

export class VideoChat {
    private client: IAgoraRTCClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
    private microphoneTrack: IMicrophoneAudioTrack | null = null
    private cameraTrack: ICameraVideoTrack | null = null
    private currentChannel: string = ''

    private remoteUsers: { [uid: string]: IAgoraRTCRemoteUser } = {}

    private userListUpdateHandler: ((users: IAgoraRTCRemoteUser[]) => void) | null = null

    constructor() {
        AgoraRTC.setLogLevel(4)
        this.client.on('user-published', this.onUserJoined)
        this.client.on('user-left', this.onUserLeft)
    }

    public onUserJoined = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "datachannel", config?: IDataChannelConfig) => {
        this.remoteUsers[user.uid] = user
        await this.client.subscribe(user, mediaType)
        
        if (this.userListUpdateHandler) {
            this.userListUpdateHandler(Object.values(this.remoteUsers))
        }
    }

    public setUserListUpdateHandler(handler: (users: IAgoraRTCRemoteUser[]) => void) {
        this.userListUpdateHandler = handler
    }

    public onUserLeft = (user: IAgoraRTCRemoteUser, reason: string) => {
        delete this.remoteUsers[user.uid]
        
        if (this.userListUpdateHandler) {
            this.userListUpdateHandler(Object.values(this.remoteUsers))
        }
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
        await this.microphoneTrack.setMuted(!this.microphoneTrack.muted)
        return this.microphoneTrack.muted
    }

    public playVideoTrackAtElementId(elementId: string) {
        if (this.cameraTrack) {
            this.cameraTrack.play(elementId)
        }
    }

    private resetRemoteUsers() {
        this.remoteUsers = {}
        if (this.userListUpdateHandler) {
            this.userListUpdateHandler([])
        }
    }

    public async joinChannel(channel: string) {
        if (channel === this.currentChannel) return
        if (this.client.connectionState === 'CONNECTED') {
            await this.client.leave()
        }
        this.resetRemoteUsers()

        await this.client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID!, channel, null)
        this.currentChannel = channel

        if (this.microphoneTrack) {
            await this.client.publish([this.microphoneTrack])
        }
        if (this.cameraTrack) {
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
