"use client"
import { PrimaryButton, SecondaryButton } from "@/app/components/ui/button"
import { AvatarSmall } from "@/app/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import UserDetailsOptions from "../options/userDetails.options"

const UserAccount = () => {
    const router = useRouter()
    const { data, isPending } = useQuery(UserDetailsOptions())

    const signUp = () => {
        router.push("/routes/user-account/sign-up")
    }

    const logIn = () => {
        router.push("/routes/user-account/log-in")
    }

    const userProfile = () => {
        router.push(`/routes/user-account/user-profile`)
    }

    return (
        <div>
            {
                data ? (
                    <div className={`flex items-center gap-x-3`}>
                        <AvatarSmall name={data.fullName}/>
                        <div className={`text-white font-mono`}>{data?.fullName}</div>
                        <div onClick={userProfile} className={`p-2 hover:bg-neutral-400/20 rounded-full`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="m245-277-19-19 409-410H255v-28h428v428h-28v-380L245-277Z"/></svg>
                        </div>
                    </div>
                ) : (
                    <div className={`flex items-center gap-x-3`}>
                        <PrimaryButton onClick={signUp}>Sign Up</PrimaryButton>
                        <SecondaryButton onClick={logIn}>Log In</SecondaryButton>
                    </div>
                )
            }
        </div>
    )
}

export default UserAccount