import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useRef } from 'react'
import AgoraRTC, { 
    AgoraRTCProvider, 
    useRemoteUsers,
    useRemoteAudioTracks,
    IAgoraRTCRemoteUser,
    IAgoraRTCClient,
} from 'agora-rtc-react'
import signal from '../../utils/signal'
import { videoChat } from '../../utils/video-chat/video-chat'

interface VideoChatContextType {
    toggleCamera: () => void
    toggleMicrophone: () => void
    isCameraMuted: boolean
    isMicMuted: boolean
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
    const [isCameraMuted, setIsCameraMuted] = useState(true)
    const [isMicMuted, setIsMicMuted] = useState(true)
    
    const remoteUsers = useRemoteUsers()
    const { audioTracks } = useRemoteAudioTracks(remoteUsers)

    audioTracks.map((track) => track.play())

    const currentChannel = useRef(uid)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const onJoinChannel = (channel: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            // TODO: Add debounce
            timeoutRef.current = setTimeout(async () => {
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
            }, 1000)
        }

        signal.on('joinChannel', onJoinChannel)

        return () => {
            signal.off('joinChannel', onJoinChannel)
        }
    }, [])

    useEffect(() => {
        return () => {
            videoChat.destroy()
        }
    }, [])

    const toggleCamera = async () => {
        const muted = await videoChat.toggleCamera()
        setIsCameraMuted(muted)
    }

    const toggleMicrophone = async () => {
        const muted = await videoChat.toggleMicrophone()
        setIsMicMuted(muted)
    }

    const value: VideoChatContextType = {
        toggleCamera,
        toggleMicrophone,
        isCameraMuted,
        isMicMuted,
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