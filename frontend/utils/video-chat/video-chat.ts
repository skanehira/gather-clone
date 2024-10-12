import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'

export class VideoChat {
    private client: IAgoraRTCClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
    private microphoneTrack: IMicrophoneAudioTrack | null = null
    private cameraTrack: ICameraVideoTrack | null = null

    constructor() {
        AgoraRTC.setLogLevel(4)
    }

    public async toggleCamera() {
        if (!this.cameraTrack) {
            this.cameraTrack = await AgoraRTC.createCameraVideoTrack()
            this.cameraTrack.play('local-video')
            return false
        }
        await this.cameraTrack.setEnabled(!this.cameraTrack.enabled)
        return !this.cameraTrack.enabled
    }

    public async toggleMicrophone() {
        if (!this.microphoneTrack) {
            this.microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack()
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

    public cleanup() {
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
