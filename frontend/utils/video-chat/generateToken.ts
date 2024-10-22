'use server'
import 'server-only'
import { RtcRole, RtcTokenBuilder } from 'agora-token'

export async function generateToken() {
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!
    const appCertificate = process.env.APP_CERTIFICATE!
    const channelName = ''
    const uid = 0
    const role = RtcRole.PUBLISHER
    const expireTime = 3600
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const expiredTs = currentTimestamp + expireTime

    const token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        role,
        expiredTs,
        expiredTs,
    )

    return token
}