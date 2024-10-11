import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useRef } from 'react'
import AgoraRTC, { 
    AgoraRTCProvider, 
    useLocalCameraTrack, 
    ICameraVideoTrack, 
    useLocalMicrophoneTrack, 
    IMicrophoneAudioTrack,
    usePublish,
    useRemoteUsers,
    useRemoteAudioTracks,
    IAgoraRTCRemoteUser,
    IAgoraRTCClient,
} from 'agora-rtc-react'
import signal from '../../utils/signal'

interface VideoChatContextType {
    localCameraTrack: ICameraVideoTrack | null
    localMicrophoneTrack: IMicrophoneAudioTrack | null
    toggleCamera: () => void
    toggleMicrophone: () => void
    isCameraEnabled: boolean
    isMicrophoneEnabled: boolean
    remoteUsers: IAgoraRTCRemoteUser[]
}

const VideoChatContext = createContext<VideoChatContextType | undefined>(undefined)


interface AgoraVideoChatProviderProps {
    children: ReactNode
    uid: string
}

interface VideoChatProviderProps {
  children: ReactNode
  uid: string
  client: IAgoraRTCClient
}

export const AgoraVideoChatProvider: React.FC<AgoraVideoChatProviderProps> = ({ children, uid }) => {
    const client = useMemo(() => {
        const newClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
        AgoraRTC.setLogLevel(4)
        return newClient
    }, [])

    return (
        <AgoraRTCProvider client={client}>
            <VideoChatProvider uid={uid} client={client}>
                {children}
            </VideoChatProvider>
        </AgoraRTCProvider>
    )
}

const VideoChatProvider: React.FC<VideoChatProviderProps> = ({ children, uid, client }) => {
    const [isCameraEnabled, setIsCameraEnabled] = useState(false)
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false)
    
    const { localCameraTrack } = useLocalCameraTrack(isCameraEnabled)
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicrophoneEnabled)

    const remoteUsers = useRemoteUsers()
    const { audioTracks } = useRemoteAudioTracks(remoteUsers)
    const hasJoined = useRef(false)
    const currentChannel = useRef(uid)
    audioTracks.map((track) => track.play())
    usePublish([localCameraTrack, localMicrophoneTrack])

    useEffect(() => {
        return () => {
            localCameraTrack?.close()
        }
    }, [localCameraTrack])

    useEffect(() => {
        return () => {
            localMicrophoneTrack?.close()
        }
    }, [localMicrophoneTrack])

    useEffect(() => {
        if (!hasJoined.current) {
            console.log('joining channel')
            client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID!, uid, null)
            hasJoined.current = true
        }
    }, [])

    useEffect(() => {
        const onJoinChannel = async (channel: string) => {
            const localChannel = uid
            if (channel === 'local' && currentChannel.current === localChannel) return
            if (channel === currentChannel.current) return

            await client.leave()

            if (channel === 'local') {
                currentChannel.current = localChannel
                await client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID!, localChannel, null)
            } else {
                currentChannel.current = channel
                await client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID!, channel, null)
            }
        }

        signal.on('joinChannel', onJoinChannel)

        return () => {
            signal.off('joinChannel', onJoinChannel)
        }
    }, [])

    const toggleCamera = async () => {
        const enabled = !isCameraEnabled
        if (localCameraTrack) {
            await localCameraTrack.setEnabled(enabled)
        }
        setIsCameraEnabled(enabled)
    }

    const toggleMicrophone = async () => {
        const enabled = !isMicrophoneEnabled
        if (localMicrophoneTrack) {
            await localMicrophoneTrack.setEnabled(enabled)
        }
        setIsMicrophoneEnabled(enabled)
    }

    const value: VideoChatContextType = {
        localCameraTrack,
        localMicrophoneTrack,
        toggleCamera,
        toggleMicrophone,
        isCameraEnabled,
        isMicrophoneEnabled,
        remoteUsers,
    }

    return (
        <VideoChatContext.Provider value={value}>
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
  const context = useContext(VideoChatContext)
  if (context === undefined) {
    throw new Error('useVideoChat must be used within a VideoChatProvider')
  }
  return context
}