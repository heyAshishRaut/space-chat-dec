"use client"
import {EmailField, PasswordField} from "@/app/components/ui/input"
import {PrimaryButton, SecondaryButton} from "@/app/components/ui/button"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import Loading from "@/app/components/ui/loading"
import axiosApi from "@/lib/axios"
import AlertBox from "@/app/components/ui/alertBox"

const LoggedIn = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    useEffect(() => {
        if (!visibility) return

        const timer = setTimeout(() => {
            setVisibility(false)
            setAlertMsg("")
        }, 2000)

        return () => clearTimeout(timer)
    }, [visibility])

    const signIn = async () => {
        setLoading(true)
        try {
            const res = await axiosApi.post(`api/v1/user/login`, {
                email: email,
                password: password
            })

            if(res.data.statusCode == 200) {
                router.push("/")
            }
        } catch(e: any) {
            console.log(e)
            if(e?.response?.status === 403) {
                const email = sessionStorage.getItem(`email`)
                if(!email) {
                    setVisibility(true)
                    setAlertMsg(`Something went wrong`)
                }
                const res = await axiosApi.post(`api/v1/user/resend-email-verification-code`, {
                    email: email
                })
                router.push("/routes/user-account/verify-email")
            }
            setVisibility(true)
            setAlertMsg(`Something went wrong`)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className={`flex flex-col gap-y-3`}>
            {
                visibility ? (
                    <div className={`z-20 absolute top-[30px] left-1/2 -translate-x-1/2`}>
                        <AlertBox content={alertMsg}/>
                    </div>
                ) : ""
            }
            <EmailField value={email} onChange={(e) => setEmail(e.target.value)}/>
            <PasswordField value={password} onChange={(e) => setPassword(e.target.value)}/>

            <div className={`flex items-center gap-x-3`}>
                <SecondaryButton>Cancel</SecondaryButton>
                <PrimaryButton disabled={loading} onClick={signIn}>
                    {
                        loading ? (
                            <Loading/>
                        ) : (
                            "Log In"
                        )
                    }
                </PrimaryButton>
            </div>
        </div>
    )
}

export default LoggedIn