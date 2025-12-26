"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Message } from "@/lib/message"

export const useMessageRealtime = (
    spaceId: string,
    onNewMessage: (message: Message) => void
) => {
    useEffect(() => {
        if (!spaceId) return

        const channel = supabase
            .channel(`messages-${spaceId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                    filter: `spaceId=eq.${spaceId}`
                },
                (payload) => {
                    onNewMessage(payload.new as Message)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [spaceId])
}
