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

    const [isCameraEnabled, setIsCameraEnabled] = useState(false)
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false)

    const { localCameraTrack } = useLocalCameraTrack(isCameraEnabled)
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(isMicrophoneEnabled)

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

    const toggleCamera = useCallback(() => {
        const enabled = !isCameraEnabled
        setIsCameraEnabled(enabled)
        if (localCameraTrack) {
            localCameraTrack.setEnabled(enabled)
        }
    }, [localCameraTrack, isCameraEnabled])

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