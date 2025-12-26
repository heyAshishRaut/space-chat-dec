"use client"
import { SpaceCodeField } from "@/app/components/ui/input"
import { OutlineButton, SecondaryButton } from "@/app/components/ui/button"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation";
import AlertBox from "@/app/components/ui/alertBox";
import protectedRoute from "@/lib/protectedRoute";
import axiosApi from "@/lib/axios";
import Loading from "@/app/components/ui/loading";

const JoinSpace = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const [spaceCode, setSpaceCode] = useState("")

    const join = async () => {
        setLoading(true)
        try {
            if(!spaceCode) {
                setVisibility(true)
                setAlertMsg(`Space Code is required.`)
                return
            }
            const res = await protectedRoute(() =>
                axiosApi.post(`/api/v1/space-settings/join-space`, {
                    spaceCode: spaceCode
                })
            )
            const spaceId = res.data.data.spaceId
            router.push(`/routes/space/${spaceId}`)
        } catch(e: any) {
            setVisibility(true)
            setAlertMsg(e.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!visibility) return

        const timer = setTimeout(() => {
            setVisibility(false)
            setAlertMsg("")
        }, 2000)

        return () => clearTimeout(timer)
    }, [visibility])

    return (
        <div className={`flex flex-col gap-y-3`}>
            {
                visibility ? (
                    <div className={`z-20 absolute top-[30px] left-1/2 -translate-x-1/2`}>
                        <AlertBox content={alertMsg}/>
                    </div>
                ) : ""
            }
            <SpaceCodeField value={spaceCode} onChange={(e) => setSpaceCode(e.target.value)}/>
            <div className={`flex gap-x-3 items-center`}>
                <OutlineButton onClick={() => setSpaceCode("")}>Cancel</OutlineButton>
                <SecondaryButton onClick={join}>{
                    loading ? (
                        <Loading/>
                    ) : 'Join'
                }</SecondaryButton>
            </div>
        </div>
    )
}

export default JoinSpace