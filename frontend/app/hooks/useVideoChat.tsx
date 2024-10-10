import React, { createContext, useContext, useState, ReactNode } from 'react'
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react'

interface VideoChatContextType {
}

const VideoChatContext = createContext<VideoChatContextType | undefined>(undefined)

interface VideoChatProviderProps {
  children: ReactNode
}

export const VideoChatProvider: React.FC<VideoChatProviderProps> = ({ children }) => {
  const value: VideoChatContextType = {
  }

  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }))

  return (
    <AgoraRTCProvider client={client}>
      <VideoChatContext.Provider value={value}>
        {children}
      </VideoChatContext.Provider>
    </AgoraRTCProvider>
  )
}

export const useVideoChat = () => {
  const context = useContext(VideoChatContext)
  if (context === undefined) {
    throw new Error('useVideoChat must be used within a VideoChatProvider')
  }
  return context
}