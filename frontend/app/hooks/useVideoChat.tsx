import React, { createContext, useContext, ReactNode, useEffect, useCallback, useState } from 'react'
import AgoraRTC, { 
    AgoraRTCProvider, 
    useRTCClient, 
    useLocalCameraTrack, 
    useJoin, 
    ICameraVideoTrack, 
    useLocalMicrophoneTrack, 
    IMicrophoneAudioTrack 
} from 'agora-rtc-react'

interface VideoChatContextType {
    localCameraTrack: ICameraVideoTrack | null
    localMicrophoneTrack: IMicrophoneAudioTrack | null
    toggleCamera: () => void
    isCameraEnabled: boolean
    isMicrophoneEnabled: boolean
}

const VideoChatContext = createContext<VideoChatContextType | undefined>(undefined)

interface VideoChatProviderProps {
  children: ReactNode
}

export const AgoraVideoChatProvider: React.FC<VideoChatProviderProps> = ({ children }) => {

    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }))

    return (
        <AgoraRTCProvider client={client}>
        <VideoChatProvider>
            {children}
        </VideoChatProvider>
        </AgoraRTCProvider>
    )
}

const VideoChatProvider: React.FC<VideoChatProviderProps> = ({ children }) => {

    const { localCameraTrack } = useLocalCameraTrack()
    const { localMicrophoneTrack } = useLocalMicrophoneTrack()

    const [isCameraEnabled, setIsCameraEnabled] = useState(true)
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true)

    useJoin({
        appid: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel: 'local',
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

    const toggleCamera = useCallback(async () => {
        if (localCameraTrack) {
            await localCameraTrack.setEnabled(!localCameraTrack.enabled)
            setIsCameraEnabled(localCameraTrack.enabled)
        }
    }, [localCameraTrack])

    const value: VideoChatContextType = {
        localCameraTrack,
        localMicrophoneTrack,
        toggleCamera,
        isCameraEnabled,
        isMicrophoneEnabled,
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