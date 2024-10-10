import React, { createContext, useContext, ReactNode, useEffect } from 'react'
import AgoraRTC, { AgoraRTCProvider, useRTCClient, useLocalCameraTrack, useJoin, ICameraVideoTrack } from 'agora-rtc-react'

interface VideoChatContextType {
    localCameraTrack: ICameraVideoTrack | null
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

    const { localCameraTrack } = useLocalCameraTrack(false)

    useJoin({
        appid: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel: 'local',
        token: null,
    })

    const value: VideoChatContextType = {
        localCameraTrack,
    }

    useEffect(() => {
        return () => {
            localCameraTrack?.close()
        }
    }, [localCameraTrack])

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