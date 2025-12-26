"use client"
import { PrimaryButton, SecondaryButton } from "@/app/components/ui/button"
import {useRouter} from "next/navigation"
import { useEffect, useState } from "react"
import AlertBox from "@/app/components/ui/alertBox"
import Loading from "@/app/components/ui/loading"
import { useQuery } from "@tanstack/react-query"
import UserDetailsOptions from "@/app/options/userDetails.options"

const CreateJoinSpace = () => {
    const router = useRouter()

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

    const [isUser, setIsUser] = useState(false)

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const { data, isPending } = useQuery(UserDetailsOptions())

    const createSpace = async () => {
        if(!data) {
            setVisibility(true)
            setAlertMsg(`Please Sign in to proceed.`)
            return
        }
        setLoading1(true)

        router.push("routes/space-settings/create-space")
        setLoading1(false)
    }

    const joinSpace = async () => {
        if(!data) {
            setVisibility(true)
            setAlertMsg(`Please Sign in to proceed.`)
            return
        }
        setLoading2(true)

        router.push("routes/space-settings/join-space")
        setLoading2(false)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisibility(false)
            setAlertMsg("")
        }, 2000)
        return () => clearTimeout(timer)
    }, [visibility])

    return (
        <div className={`flex items-center gap-x-3`}>
            <div className={`absolute top-[30px] left-1/2 -translate-x-1/2`}>
                {
                    visibility ? (
                        <AlertBox content={alertMsg}/>
                    ) : ""
                }
            </div>
            <PrimaryButton onClick={createSpace}>
                {
                    loading1 ? (
                        <Loading/>
                    ) : (
                        "Create"
                    )
                }
            </PrimaryButton>
            <SecondaryButton onClick={joinSpace}>
                {
                    loading2 ? (
                        <Loading/>
                    ) : (
                        "Join Space"
                    )
                }
            </SecondaryButton>
        </div>
    )
}

export default CreateJoinSpace