import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'

export class VideoChat {
    private client: IAgoraRTCClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
    private microphoneTrack: IMicrophoneAudioTrack | null = null
    private cameraTrack: ICameraVideoTrack | null = null
    private currentChannel: string = ''

    constructor() {
        AgoraRTC.setLogLevel(4)
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

    public async joinChannel(channel: string) {
        if (channel === this.currentChannel) return
        if (this.client.connectionState === 'CONNECTED') {
            await this.client.leave()
        }

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
    }

    public destroy() {
        if (this.cameraTrack) {
            this.cameraTrack.setEnabled(false)
        }
        if (this.microphoneTrack) {
            this.microphoneTrack.setEnabled(false)
        }
        this.microphoneTrack = null
        this.cameraTrack = null
    }
}

export const videoChat = new VideoChat()
