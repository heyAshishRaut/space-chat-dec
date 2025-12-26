"use client"
import {SpaceField} from "@/app/components/ui/input"
import {OutlineButton, SecondaryButton} from "@/app/components/ui/button"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import AlertBox from "@/app/components/ui/alertBox"
import Loading from "@/app/components/ui/loading"
import axiosApi from "@/lib/axios";
import protectedRoute from "@/lib/protectedRoute";

const CreateSpace = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const [spaceName, setSpaceName] = useState("")

    const createSpace = async () => {
        setLoading(true)
        try {
            if(!spaceName) {
                setVisibility(true)
                setAlertMsg("Please provide spaceName")
                return
            }
            if(spaceName.length > 30) {
                setVisibility(true)
                setAlertMsg("Max 30 chars allowed")
                return
            }
            const res = await protectedRoute(() =>
                axiosApi.post(`/api/v1/space-settings/create-space`, {
                    spaceName: spaceName
                })
            )
            console.log(res)
            const spaceId = res.data.data.spaceId
            router.push(`/routes/space/${spaceId}`)
        } catch(e: any) {
            console.log(e)
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
            <SpaceField value={spaceName} onChange={(e) => setSpaceName(e.target.value)}/>
            <div className={`flex gap-x-3 items-center`}>
                <OutlineButton>Cancel</OutlineButton>
                <SecondaryButton onClick={createSpace}>
                    {
                        loading ? (
                            <Loading/>
                        ) : (
                            "Create"
                        )
                    }
                </SecondaryButton>
            </div>
        </div>
    )
}

export default CreateSpace