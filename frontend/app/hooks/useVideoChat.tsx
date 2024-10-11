import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo } from 'react'
import AgoraRTC, { 
    AgoraRTCProvider, 
    useLocalCameraTrack, 
    useJoin, 
    ICameraVideoTrack, 
    useLocalMicrophoneTrack, 
    IMicrophoneAudioTrack,
    usePublish,
    useRemoteUsers,
    useRemoteAudioTracks,
    IAgoraRTCRemoteUser,
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

interface VideoChatProviderProps {
  children: ReactNode
  uid: string
}

export const AgoraVideoChatProvider: React.FC<VideoChatProviderProps> = ({ children, uid }) => {
    const client = useMemo(() => {
        const newClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
        AgoraRTC.setLogLevel(4)
        return newClient
    }, [])

    return (
        <AgoraRTCProvider client={client}>
            <VideoChatProvider uid={uid}>
                {children}
            </VideoChatProvider>
        </AgoraRTCProvider>
    )
}

const VideoChatProvider: React.FC<VideoChatProviderProps> = ({ children, uid }) => {
    const [isCameraEnabled, setIsCameraEnabled] = useState(false)
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false)
    
    const { localCameraTrack } = useLocalCameraTrack(isCameraEnabled)
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicrophoneEnabled)

    const remoteUsers = useRemoteUsers()
    const { audioTracks } = useRemoteAudioTracks(remoteUsers)

    audioTracks.map((track) => track.play())
    usePublish([localCameraTrack, localMicrophoneTrack])
    useJoin({
        appid: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel: uid,
        token: null,
    })

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
        const onJoinChannel = (channel: string) => {
            console.log(channel)
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