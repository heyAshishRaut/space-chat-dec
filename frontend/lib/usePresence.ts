"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type PresenceUser = {
    email: string
    fullName: string
    admin: boolean
}

export const usePresence = (spaceId: string, currentUser: PresenceUser) => {
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([])

    useEffect(() => {
        if (!spaceId || !currentUser?.email) return

        const channel = supabase.channel(`presence-${spaceId}`, {
            config: {
                presence: {
                    key: currentUser.email
                }
            }
        })

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState()

                const users: PresenceUser[] = Object.values(state)
                    .flat()
                    .map((p: any) => ({
                        email: p.email,
                        fullName: p.fullName,
                        admin: p.admin ?? false
                    }))

                setOnlineUsers(users)
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        email: currentUser.email,
                        fullName: currentUser.fullName,
                        admin: currentUser.admin,
                        joinedAt: new Date().toISOString()
                    })
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [spaceId, currentUser.email])
    return onlineUsers
}
