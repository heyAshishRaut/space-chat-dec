"use client"
import {AnimatePresence, motion } from "motion/react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import logo from "@/public/logoWhite.png"
import { useEffect, useRef, useState } from "react"
import { AvatarMedium } from "@/app/components/ui/avatar"
import { DestructiveButton } from "@/app/components/ui/button"
import protectedRoute from "@/lib/protectedRoute"
import axiosApi from "@/lib/axios"
import AlertBox from "@/app/components/ui/alertBox"
import Loading from "@/app/components/ui/loading"
import grad from "@/public/fileGradient.jpg"
import { usePresence } from "@/lib/usePresence"
import { useMessageRealtime } from "@/lib/useMessageRealtime"
import { Message } from "@/lib/message"

interface Participants {
    fullName: string | undefined
    email: string | undefined
    admin: boolean | undefined
}

const Page = () => {
    const router = useRouter()

    const params = useParams()
    const spaceId = params.spaceId

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

    const [visibility, setVisibility] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")

    // Validate SpaceId and get Space details
    const [spaceName, setSpaceName] = useState("")
    const [spaceCode, setSpaceCode] = useState<number>()

    const [fullName, setFullName] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [admin, setAdmin] = useState<boolean>()

    const spaceAndUserInfo = async () => {
        try {
            const res = await protectedRoute(() =>
                axiosApi.post(`/api/v1/space-settings/validate-space-id`, {
                    spaceId: spaceId
                })
            )

            setSpaceName(res.data.data.spaceName)
            setSpaceCode(res.data.data.spaceCode)

            setFullName(res.data.data.fullName)
            setEmail(res.data.data.email)
            setAdmin(res.data.data.admin)
        } catch(e) {
            router.push("/")
        }
    }

    useEffect(() => {
        const init = async () => {
            await spaceAndUserInfo()
        }
        init()
    }, [])

    // Leave Space
    const leaveSpace = async () => {
        setLoading1(true)
        try {
            const res = await protectedRoute(() =>
                axiosApi.post(`/api/v1/space-settings/leave-space`, {
                    spaceId: spaceId
                })
            )
            router.push("/")
        } catch(e: any) {
            setVisibility(true)
            setAlertMsg(e.response.data.message)
        } finally {
            setLoading1(false)
        }
    }

    // Delete Space
    const deleteSpace = async () => {
        if (!admin) {
            return
        }

        setLoading2(true)
        try {
            const res = await protectedRoute(() =>
                axiosApi.post(`/api/v1/space-settings/delete-space`, {
                    spaceId: spaceId
                })
            )
            router.push("/")
        } catch(e) {
            console.log(`Error`)
        } finally {
            setLoading2(false)
        }
    }

    const [file, setFile] = useState<File | null>(null)
    const [text, setText] = useState("")

    const [sending, setSending] = useState(false)
    // send Message
    const sendMessage = async () => {
        if(!text && !file) {
            setVisibility(true)
            setAlertMsg(`Message in required!`)
            return
        }
        setSending(true)
        try {
            if(file) {
                const formData = new FormData()
                formData.append(`text`, text)
                formData.append(`file`, file)
                // @ts-ignore
                formData.append(`spaceId`, spaceId)
                setText(``)
                setFile(null)

                const res = await protectedRoute(() =>
                    axiosApi.post(`/api/v1/messages/add-message`, formData)
                )
            }

            else {
                const res = await protectedRoute(() =>
                    axiosApi.post(`/api/v1/messages/add-message`, {
                        text: text,
                        spaceId: spaceId
                    })
                )
            }

            setFile(null)
            setText(``)
        } catch(e: any) {
            console.log(e)
            const message = e?.response?.data?.message
            // @ts-ignore
            if(message === `UNAUTHORIZED_ACCESS`) {
                router.push("/")
            }

            setVisibility(true)
            setAlertMsg(message)
        } finally {
            setSending(false)
        }
    }

    const [messages, setMessages] = useState<Message[]>([])

    // Fetch all previous messages
    useEffect(() => {
        const init = async () => {
            try {
                const res = await protectedRoute(() =>
                    axiosApi.post(`/api/v1/messages/all-messages`, {
                        spaceId: spaceId
                    })
                )
                setMessages(prev => {
                    const existingIds = new Set(prev.map(m => m.id))
                    const fresh = res.data.data.messages.filter(
                        // @ts-ignore
                        m => !existingIds.has(m.id)
                    )
                    return [...fresh, ...prev]
                })
            } catch(e) {
                console.log(e)
            }
        }
        init()
    }, [spaceId])

    // @ts-ignore
    useMessageRealtime(spaceId, (incoming) => {
        setMessages(prev => {
            const index = prev.findIndex(m => m.id === incoming.id)

            // New message
            if (index === -1) {
                return [...prev, { ...incoming, likedByMe: false }]
            }

            // Update existing message
            const updated = [...prev]
            updated[index] = { ...prev[index], ...incoming }
            return updated
        })
    })

    const toggleLike = async (messageId: string) => {
        try {
            const res = await protectedRoute(() =>
                axiosApi.post(`/api/v1/messages/toggle-like`, {
                    messageId: messageId
                })
            )

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            likedByMe: res.data.liked,
                            likes: msg.likes + (res.data.liked ? 1 : -1)
                        }
                        : msg
                )
            )
        } catch(e) {

        }
    }

    // Supabase Presence
    const user: Participants = {
        email: email,
        fullName: fullName,
        admin: admin
    }

    // @ts-ignore
    const onlineUsers = usePresence(spaceId, user)

    // Copy spaceCode
    const textRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)

    const copyText = async () => {
        if(!textRef.current) return

        await navigator.clipboard.writeText(textRef.current.innerText)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 4000)
    }

    // Menu
    const [menu, setMenu] = useState(false)

    useEffect(() => {
        if (!visibility) return

        const timer = setTimeout(() => {
            setVisibility(false)
            setAlertMsg("")
        }, 2000)

        return () => clearTimeout(timer)
    }, [visibility])

    const formatTime = (createdAt: string) => {
        return new Date(createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
    }

    const [image, setImage] = useState<string | null>()


    return (
        <div className={`relative overflow-x-hidden h-screen w-screen bg-black flex flex-col`}>
            {/* Show Image */}
            {
                image && (
                    <div className="z-70 absolute inset-0 bg-black/50 backdrop-blur-xl">

                        <motion.div
                            whileTap={{
                                filter: "blur(5px)",
                                scale: 0.93
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeIn"
                            }}
                            onClick={() => setImage(null)}
                            className={`absolute top-[30px] right-[30px] h-[50px] aspect-square bg-neutral-500/30 rounded-full flex items-center justify-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z"/></svg>
                        </motion.div>

                        <div className="h-full w-full flex items-center justify-center">
                            <div className="relative h-[70%] w-[90%] overflow-hidden">
                                <Image
                                    src={image}
                                    alt="Image"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>

                )
            }

            {/* Alert */}
            {
                visibility ? (
                    <div className={`z-50 absolute top-[30px] left-1/2 -translate-x-1/2`}>
                        <AlertBox content={alertMsg}/>
                    </div>
                ) : ""
            }

            {/* Menu */}
            <AnimatePresence>
            {
                menu && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            filter: `blur(5px)`,
                            y: -10,
                            scale: 0.97
                        }}
                        animate={{
                            opacity: 1,
                            filter: `blur(0px)`,
                            y: 0,
                            scale: 1
                        }}
                        exit={{
                            opacity: 0,
                            filter: `blur(5px)`,
                            y: -10,
                            scale: 0.97
                        }}
                        transition={{
                            duration: 0.2,
                            ease: `easeIn`
                        }}
                        className={`z-20 p-3 text-white font-mono absolute w-[300px] top-[68px] right-[18px] md:right-[58px] rounded-3xl lg:right-[128px] bg-neutral-600/40 backdrop-blur-lg flex flex-col gap-y-3`}>
                        <div className={`p-2 mb-2`}>
                            <div className={`text-[13px] text-neutral-200/70`}>Space Code</div>
                            <div className={`flex items-center gap-x-6`}>
                                <div ref={textRef} className={`text-2xl`}>{spaceCode}</div>
                                <button disabled={copied} onClick={copyText} className={`hidden md:block`}>
                                    {
                                        copied ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-267.69 183.23-466.46 211.77-495 382-324.77 748.23-691l28.54 28.54L382-267.69Z"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M364.62-280q-27.62 0-46.12-18.5Q300-317 300-344.62v-430.76q0-27.62 18.5-46.12Q337-840 364.62-840h310.76q27.62 0 46.12 18.5Q740-803 740-775.38v430.76q0 27.62-18.5 46.12Q703-280 675.38-280H364.62Zm0-40h310.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-430.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H364.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v430.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69Zm-120 160q-27.62 0-46.12-18.5Q180-197 180-224.61v-470.77h40v470.77q0 9.23 7.69 16.92 7.69 7.69 16.93 7.69h350.76v40H244.62ZM340-320v-480 480Z"/></svg>
                                        )
                                    }
                                </button>
                            </div>
                        </div>
                        <div className={`p-2 w-full bg-red-600/20 border border-red-600/20 rounded-2xl flex flex-col gap-y-4`}>
                            <div className={`flex gap-x-2`}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M460-300h40v-220h-40v220Zm20-276.92q10.46 0 17.54-7.08 7.08-7.08 7.08-17.54 0-10.46-7.08-17.54-7.08-7.07-17.54-7.07-10.46 0-17.54 7.07-7.08 7.08-7.08 17.54 0 10.46 7.08 17.54 7.08 7.08 17.54 7.08Zm.13 456.92q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120Zm-.13-40q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                                </div>
                                <div className={`text-[12px]`}>You won’t receive updates from this space after leaving.</div>
                            </div>
                            <div className={`self-end`}>
                                <DestructiveButton disabled={loading1} onClick={leaveSpace}>
                                    {
                                        loading1 ? (
                                            <Loading/>
                                        ) : (
                                            `Leave`
                                        )
                                    }
                                </DestructiveButton>
                            </div>
                        </div>

                        {
                            admin && (
                                <div className={`p-2 w-full bg-red-600/20 border border-red-600/20 rounded-2xl flex flex-col gap-y-4`}>
                                    <div className={`flex gap-x-2`}>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M460-300h40v-220h-40v220Zm20-276.92q10.46 0 17.54-7.08 7.08-7.08 7.08-17.54 0-10.46-7.08-17.54-7.08-7.07-17.54-7.07-10.46 0-17.54 7.07-7.08 7.08-7.08 17.54 0 10.46 7.08 17.54 7.08 7.08 17.54 7.08Zm.13 456.92q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120Zm-.13-40q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                                        </div>
                                        <div className={`text-[12px]`}>All messages, and members will be permanently deleted.</div>
                                    </div>
                                    <div className={`self-end`}>
                                        <DestructiveButton disabled={loading2} onClick={deleteSpace}>
                                            {
                                                loading2 ? (
                                                    <Loading/>
                                                ) : (
                                                    `Delete`
                                                )
                                            }
                                        </DestructiveButton>
                                    </div>
                                </div>
                            )
                        }
                    </motion.div>
                )
            }
            </AnimatePresence>

            {/* Navbar */}
            <div className={`fixed text-white bg-black z-20 min-h-[60px] w-full px-[10px] md:px-[50px] lg:px-[120px] flex items-center justify-between border-b border-neutral-400/30`}>
                {/* Logo */}
                <div className={`flex items-center gap-x-2`}>
                    <Image src={logo} alt={"Space Logo White"} height={45} width={45}/>
                    <div className={`font-instrument text-4xl`}>Space</div>
                </div>

                {/* Space Name + Button */}
                <div className={`flex gap-x-6 items-center`}>
                    <div className={`font-mono text-xl `}>{spaceName}</div>
                    <motion.div
                        whileTap={{
                            filter: `blur(5px)`,
                            scale: 0.93
                        }}
                        transition={{
                            duration: 0.3,
                            ease: `easeIn`
                        }}
                        onClick={() => setMenu(!menu)}
                        className={`border border-neutral-400/20 bg-neutral-600/50 h-[42px] w-[42px] rounded-full p-2 flex items-center justify-center`}>
                        {
                            !menu ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M160-269.23v-40h640v40H160ZM160-460v-40h640v40H160Zm0-190.77v-40h640v40H160Z"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z"/></svg>
                            )
                        }
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className={`pt-[60px] h-full w-full md:px-[50px] lg:px-[120px] flex`}>
                {/* SVG Lines */}
                <div className={`hidden md:block w-[100px] border-l border-r border-neutral-500/30`}>
                    <svg
                        className="w-full h-full pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern
                                id="diagonalLines"
                                patternUnits="userSpaceOnUse"
                                width="8"
                                height="8"
                                patternTransform="rotate(-45)"
                            >
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="8"
                                    stroke="rgba(163, 163, 163, 0.9)"
                                    strokeWidth="0.7"
                                />
                            </pattern>
                        </defs>

                        <rect width="100%" height="100%" fill="url(#diagonalLines)"/>
                    </svg>
                </div>

                {/* Participants */}
                <div
                    style={{overflow: "auto", scrollbarWidth: "none", msOverflowStyle: "none"}}
                    className={`hidden md:flex h-full w-[300px] pt-2 px-2 font-mono bg-neutral-600/20 border-r border-neutral-500/30 flex-col`}>
                    {
                        onlineUsers.map((e, key) =>
                            <div key={key} className={`cursor-default rounded-xl hover:bg-neutral-400/10 p-2 flex items-center gap-x-3`}>
                                <AvatarMedium name={e.fullName}/>
                                <div className={`flex flex-col justify-center overflow-hidden`}>
                                    <div className={`text-white/90 text-[14px] flex gap-x-2`}>
                                        <div>{e.fullName}</div>
                                        {
                                            e.admin ? (
                                                <div className={`text-[11px] flex items-center justify-center px-2 rounded-full text-blue-200 bg-blue-800/50`}>Chief</div>
                                            ) : ""
                                        }
                                    </div>
                                    <div className={`text-neutral-400 text-[13px]`}>{e.email}</div>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* Chat Interface */}
                <div className={`relative flex-1 flex flex-col p-3`}>

                    {/* Chats */}
                    <div
                        style={{overflow: "auto", scrollbarWidth: "none", msOverflowStyle: "none"}}
                        className={`pb-[100px] overflow-y-scroll h-full w-full flex flex-col gap-y-5 font-mono text-[13px]`}>
                        {
                            messages.map((e, key) =>
                                <div key={e.id} className={`${e.email === email ? "self-end" : "self-start"} group relative min-w-[50%] md:min-w-[30%] max-w-[85%] md:max-w-[70%]`}>
                                    <div className={`w-full p-2 rounded-xl bg-neutral-600/30 flex flex-col gap-y-1 text-neutral-200`}>
                                        {
                                            e.type ===  "image" ? (
                                                <div onClick={() => setImage(e.file)} className="relative mb-2 w-full aspect-square bg-white/20 rounded-xl overflow-hidden">
                                                    <Image
                                                        // @ts-ignore
                                                        src={e?.file}
                                                        alt="Image"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                // @ts-ignore
                                            ) : e.type === "file" ? (
                                                <div className={`relative mb-2 w-full h-[50px] bg-gradient-to-l from-[#ACB6E5] via-[#9fe0dc] to-[#74ebd5] rounded-xl`}>
                                                    <motion.a
                                                        whileTap={{
                                                            filter: "blur(5px)",
                                                            scale: 0.93
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: "easeIn"
                                                        }}
                                                        // @ts-ignore
                                                        href={e.file}
                                                        download
                                                        className={`absolute top-1/2 right-2 -translate-y-1/2 h-[35px] aspect-square bg-neutral-500/30 rounded-full flex items-center justify-center`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M247.54-268.46 220-296l403.23-404H251.54v-40h440v440h-40v-371.69l-404 403.23Z"/></svg>
                                                    </motion.a>
                                                </div>
                                            ) : ""
                                        }
                                        {
                                            e.text && (
                                                <div>{e.text}</div>
                                            )
                                        }
                                        <div className={`text-[12px] flex items-center justify-between text-neutral-400`}>
                                            <div className={`flex items-center`}>
                                                <div>
                                                    {
                                                        e.email !== email && (
                                                            <div className={`mr-2`}>{e.firstName}</div>
                                                        )
                                                    }
                                                </div>
                                                {
                                                    e.likes > 0 && (
                                                        <div className={`py-[2px] pl-1.5 pr-2 rounded-full bg-neutral-600/50 font-mono flex gap-x-1 items-center`}>
                                                            <div className={``}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="#FF0000" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FF0000" className="size-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                                                </svg>
                                                            </div>
                                                            <div className={`text-white`}>{e.likes}</div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div>{formatTime(e.createdAt)}</div>
                                        </div>
                                    </div>

                                    <div onClick={() => toggleLike(e.id)} className={`${e.email === email ? "right-2" : "left-2"} invisible bg-neutral-600/50 backdrop-blur-xl group-hover:visible absolute -bottom-4 h-7 w-7 rounded-full flex items-center justify-center`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={e.likedByMe ? "#FF0000" : "#FFFFFF80"} viewBox="0 0 24 24" strokeWidth="1" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                        </svg>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {/* Input */}
                    <div className={`fixed w-full h-[56px] md:px-[50px] lg:px-[120px] bottom-0 left-0 flex`}>
                        <div className={`hidden md:block w-[400px] h-full`}></div>
                        <div className={`relative h-full flex-1 backdrop-blur-xl flex gap-x-2 px-2 items-center`}>
                            <AnimatePresence>
                            {
                                file && (
                                    <motion.div
                                        initial={{
                                            y: 7,
                                            filter: `blur(5px)`
                                        }}
                                        animate={{
                                            y: 0,
                                            filter: `blur(0px)`
                                        }}
                                        exit={{
                                            y: 7,
                                            filter: `blur(5px)`
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: `easeIn`
                                        }}
                                        className={`absolute bottom-[60px] right-3 p-1 flex justify-center gap-x-2 rounded-full bg-neutral-800 border border-neutral-600/50 h-[45px]`}>
                                        <Image src={grad} alt={`Grad`} className={`h-[36px] w-[36px] aspect-square rounded-full`} />
                                        <div className={`h-full flex-1 flex items-center rounded-full font-mono text-[13px] text-white`}>
                                            {/* @ts-ignore */}
                                            {file.name.length > 10
                                                ? file.name.slice(0, 10) + "..."
                                                : file.name}
                                            {" "}
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </div>
                                        <motion.div
                                            whileTap={{
                                                filter: "blur(5px)",
                                                scale: 0.93
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeIn"
                                            }}
                                            onClick={() => setFile(null)} className={`h-full aspect-square hover:bg-neutral-500/30 hover:border-none border border-white/30 rounded-full flex items-center justify-center`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="m256-236-20-20 224-224-224-224 20-20 224 224 224-224 20 20-224 224 224 224-20 20-224-224-224 224Z"/></svg>
                                        </motion.div>
                                    </motion.div>
                                )
                            }
                            </AnimatePresence>
                            <div className={`h-[44px] flex-1 bg-white/20 rounded-full flex gap-x-1 items-center p-1`}>
                                {/* Upload File */}
                                <input

                                    type="file"
                                    id="file-input"
                                    hidden
                                    onChange={(e) => {
                                        if (!e.target.files?.[0]) return
                                        setFile(e.target.files[0])
                                        e.target.value = ""
                                    }}
                                />

                                {/* Animated file button */}
                                <label htmlFor="file-input" className={`h-full`}>
                                    <motion.div
                                        whileTap={{
                                            filter: "blur(5px)",
                                            scale: 0.93
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeIn"
                                        }}
                                        className="p-1 border border-white/30 h-full aspect-square rounded-full bg-black/30 flex items-center justify-center cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 -960 960 960"
                                            fill="#FFFFFF"
                                            className="w-5 h-5"
                                        >
                                            <path d="M460-200v-483.15L228.31-451.46 200-480l280-280 280 280-28.31 28.54L500-683.15V-200h-40Z" />
                                        </svg>
                                    </motion.div>
                                </label>

                                {/* Chat */}
                                <div className={`h-full flex-1 rounded-full`}>
                                    <input
                                        placeholder={`Say Something...`}
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                if (!text.trim() || sending) return
                                                sendMessage()
                                            }
                                        }}
                                        value={text} className={`rounded-full px-2 text-[13px] outline-none font-mono text-white h-full w-full`}/>
                                </div>
                            </div>

                            <motion.button
                                whileTap={{
                                    filter: `blur(5px)`,
                                    scale: 0.93
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: `easeIn`
                                }}
                                onClick={sendMessage}
                                disabled={sending}
                                className={`h-[44px] bg-white/90 aspect-square rounded-full overflow-hidden p-1`}>
                                <div className={`h-full w-full bg-white rounded-full flex items-center justify-center p-1.5`}>
                                    {
                                        sending ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000000"><path d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85Z"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000"><path d="M665.08-450H180v-60h485.08L437.23-737.85 480-780l300 300-300 300-42.77-42.15L665.08-450Z"/></svg>
                                        )
                                    }
                                </div>
                            </motion.button>
                        </div>
                        <div className={`hidden md:block w-[100px] h-full`}></div>
                    </div>
                </div>

                {/* SVG Lines */}
                <div className={`hidden md:block w-[100px] border-l border-r border-neutral-500/30`}>
                    <svg
                        className="w-full h-full pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern
                                id="diagonalLines"
                                patternUnits="userSpaceOnUse"
                                width="8"
                                height="8"
                                patternTransform="rotate(-45)"
                            >
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="8"
                                    stroke="rgba(156, 163, 175)"
                                    strokeWidth="0.7"
                                />
                            </pattern>
                        </defs>

                        <rect width="100%" height="100%" fill="url(#diagonalLines)"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Page