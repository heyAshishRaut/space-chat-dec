"use client"
import Image from "next/image"
import logo from "@/public/logoWhite.png"
import { useEffect, useState } from "react"
import axiosApi from "@/lib/axios"
import { AvatarLarge } from "@/app/components/ui/avatar"
import { DestructiveButton, OutlineButton } from "@/app/components/ui/button"
import { useRouter } from "next/navigation"
import protectedRoute from "@/lib/protectedRoute"
import Loading from "@/app/components/ui/loading"
import AlertBox from "@/app/components/ui/alertBox"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import UserDetailsOptions from "@/app/options/userDetails.options"

const UserProfile = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const { data, isPending } = useQuery(UserDetailsOptions())
    const queryClient = useQueryClient()

    const close = () => {
        router.push("/")
    }

    const logout = async () => {
        setLoading(true)
        try {
            await protectedRoute(() =>
                axiosApi.post(`/api/v1/user/logout`)
            )
            console.log(`logout`)
            queryClient.clear()
            router.push("/")
        } catch(e) {
            setVisibility(true)
            setAlertMsg("Something went wrong")
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
                <div className={`h-full w-full md:w-1/2 flex`}>
                    {
                         data && (
                            <div className={`h-full w-full flex flex-col justify-center`}>
                                <div className={`font-instrument text-4xl mb-10`}>User Profile</div>
                                <AvatarLarge name={data.fullName}/>
                                <div className={`mt-6 font-mono flex flex-col gap-y-6`}>
                                    <div className={`flex flex-col`}>
                                        <div className={`text-neutral-400 text-[13px]`}>FullName</div>
                                        <div className={`font-mono text-white`}>{data.fullName}</div>
                                    </div>
                                    <div className={`flex flex-col`}>
                                        <div className={`text-neutral-400 text-[13px]`}>Email</div>
                                        <div className={`font-mono text-white`}>{data.email}</div>
                                    </div>
                                    <div className={`flex items-center gap-x-3`}>
                                        <OutlineButton onClick={close}>Close</OutlineButton>
                                        <DestructiveButton disabled={loading} onClick={logout}>
                                            {
                                                loading ? (
                                                    <Loading/>
                                                ) : (
                                                    "Logout"
                                                )
                                            }
                                        </DestructiveButton>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className={`hidden md:block h-full w-1/2 py-4`}>
                    <div style={{ backgroundImage: "url(/posters/three.jpg)" }} className="relative h-full w-full rounded-4xl bg-cover bg-center">
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative h-full w-full flex flex-col gap-y-4 items-center justify-center text-white text-5xl font-instrument">
                            <Image src={logo} alt={`image`} height={60} width={60}/>
                            <div className={`text-3xl`}>The universe is not silent. It is waiting.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile