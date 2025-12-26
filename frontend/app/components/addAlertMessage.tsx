"use client"
import AlertBox from "@/app/components/ui/alertBox"
import { useEffect } from "react"

interface AddAlertMessageProps {
    visibility?: boolean,
    content?: string
}

const AddAlertMessage = ({visibility, content}: AddAlertMessageProps) => {
    useEffect(() => {
        setTimeout(() => {
            visibility = false
        }, 2000)
    }, [])

    return (
        visibility ? (
            // @ts-ignore
            <AlertBox content={content}/>
        ) : ""
    )
}

export default AddAlertMessage