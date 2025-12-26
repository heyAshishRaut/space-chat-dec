"use client"
import {EmailField, NameField, PasswordField} from "@/app/components/ui/input"
import {PrimaryButton, SecondaryButton} from "@/app/components/ui/button"
import {useEffect, useState} from "react"
import AlertBox from "@/app/components/ui/alertBox"
import axiosApi from "@/lib/axios"
import {useRouter} from "next/navigation"
import Loading from "@/app/components/ui/loading";

const CreateAccount = () => {
    const router = useRouter()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    const [loading, setLoading] = useState(false)

    const signUp = async () => {
        try {
            setLoading(true)

            // Empty fields
            if (!fullName || !email || !password) {
                setVisibility(true)
                setAlertMsg("All fields are mandatory.")
                return
            }

            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const checkEmail = emailRegex.test(email)

            if (!checkEmail) {
                setVisibility(true)
                setAlertMsg("Invalid Email Address")
                return
            }

            // Password
            if (password.length < 8) {
                setVisibility(true)
                setAlertMsg("Password is too short.")
                return
            }

            if (password.length > 12) {
                setVisibility(true)
                setAlertMsg("Password is too long.")
                return
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
            const checkPassword = passwordRegex.test(password)

            if (!checkPassword) {
                setVisibility(true)
                setAlertMsg("Password must contain capital, small, numeric and special characters.")
                return
            }

            // Send to Backend
            const res = await axiosApi.post(`/api/v1/user/register`, {
                fullName: fullName,
                email: email,
                password: password
            })
            sessionStorage.setItem(`email`, email)
            router.push(`/routes/user-account/verify-email`)
            return

        } catch (e: any) {
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

    const cancel = () => {
        setFullName("")
        setEmail("")
        setPassword("")
    }

    return (
        <div className={`flex flex-col gap-y-3`}>
            <NameField value={fullName} onChange={(e) => setFullName(e.target.value)}/>
            <EmailField value={email} onChange={(e) => setEmail(e.target.value)}/>
            <PasswordField value={password} onChange={(e) => setPassword(e.target.value)}/>
            {
                visibility ? (
                    <div className={`z-20 absolute top-[30px] left-1/2 -translate-x-1/2`}>
                        <AlertBox content={alertMsg}/>
                    </div>
                ) : ""
            }
            <div className={`flex items-center gap-x-3`}>
                <SecondaryButton onClick={cancel}>Cancel</SecondaryButton>
                <PrimaryButton disabled={loading} onClick={signUp}>
                    {
                        loading ? (
                            <Loading/>
                        ) : (
                            "Sign Up"
                        )
                    }
                </PrimaryButton>
            </div>
        </div>
    )
}

export default CreateAccount