"use client"
import Image from "next/image"
import logo from "@/public/logoWhite.png"
import { EmailCodeField } from "@/app/components/ui/input"
import { useEffect, useState } from "react"
import { PrimaryButton, SecondaryButton } from "@/app/components/ui/button"
import AlertBox from "@/app/components/ui/alertBox"
import axiosApi from "@/lib/axios"
import Loading from "@/app/components/ui/loading"
import { useRouter } from "next/navigation"

const EmailVerification = () => {
    const router = useRouter()

    const [code, setCode] = useState("")

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const [loading, setLoading] = useState(false)

    const verifyEmail = async () => {
        setLoading(true)

        try {
            // Empty, Length and Only Numbers
            if(!code) {
                setVisibility(true)
                setAlertMsg("Verification code is required")
                return
            }

            if(code.length !== 6) {
                setVisibility(true)
                setAlertMsg("Verification code must be of 6 characters.")
                return
            }

            const numberOnlyRegex = /^[0-9]+$/
            const checkCode = numberOnlyRegex.test(code)

            if(!checkCode) {
                setVisibility(true)
                setAlertMsg("Verification code must contains numbers only.")
                return
            }

            // Check email in SessionStorage
            const email = sessionStorage.getItem(`email`)
            if(!email) {
                setVisibility(true)
                setAlertMsg(`Something went wrong`)

                setTimeout(() => {
                    router.push("/")
                }, 2000)
            }

            // Send to Backend
            const res = await axiosApi.post(`/api/v1/user/verify-email`, {
                email: email,
                otp: code
            })
            sessionStorage.removeItem(`email`)
            router.push("/")
            return

        } catch(e) {

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
        <div className={`h-screen w-screen bg-black flex flex-col`}>
            {
                visibility ? (
                    <div className={`z-20 absolute top-[30px] left-1/2 -translate-x-1/2`}>
                        <AlertBox content={alertMsg}/>
                    </div>
                ) : ""
            }
            {/* Navbar */}
            <div className={`h-[60px] w-full px-[10px] md:px-[50px] lg:px-[120px] flex items-center justify-between border-b border-neutral-400/30`}>
                {/* Logo */}
                <div className={`flex items-center gap-x-2`}>
                    <Image src={logo} alt={"Space Logo White"} height={45} width={45}/>
                    <div className={`font-instrument text-white text-4xl`}>Space</div>
                </div>
            </div>

            {/* Content */}
            <div className={`text-white flex-1 flex px-[10px] md:px-[50px] lg:px-[120px]`}>
                <div className={`h-full w-1/2 flex`}>
                    <div className={`h-full w-full flex flex-col justify-center`}>
                        <div className={`font-instrument text-4xl mb-10`}>Email Verification</div>
                        <EmailCodeField value={code} onChange={(e) => setCode(e.target.value)}/>
                        <div className={`mt-3 flex items-center gap-x-3`}>
                            <SecondaryButton onClick={() => setCode("")}>Cancel</SecondaryButton>
                            <PrimaryButton onClick={verifyEmail}>
                                {
                                    loading ? (
                                        <Loading/>
                                    ) : (
                                        "Verify"
                                    )
                                }
                            </PrimaryButton>
                        </div>
                        <div className={`mt-6 w-[400px] text-neutral-300 font-mono text-[13px] p-3 flex flex-col rounded-xl border-2 border-emerald-900/50 bg-emerald-800/20`}>
                            A verification code has been sent to your registered email address. Please check your inbox and enter the code to continue.
                        </div>
                    </div>

                </div>
                <div className={`h-full w-1/2 py-4`}>
                    <div style={{ backgroundImage: "url(/posters/four.jpg)" }} className="relative h-full w-full rounded-4xl bg-cover bg-center">
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative h-full w-full flex flex-col gap-y-4 items-center justify-center text-white text-5xl font-instrument">
                            <Image src={logo} alt={`image`} height={60} width={60}/>
                            <div className={`text-3xl`}>History does not sleep. It whispers.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailVerification