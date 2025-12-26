"use client"
import {useEffect, useState} from "react"

interface AvatarProps {
    name?: String
}

const AvatarSmall = ({ name }: AvatarProps) => {
    const [initials, setInitials] = useState<String>()

    useEffect(() => {
        const getInitials = () => {
            if(!name) return
            const nameArray = name ? name.split(" "): []
            const first = nameArray[0].split("")[0].toUpperCase()
            const second = nameArray[1].split("")[0].toUpperCase()
            setInitials(first + "" + second )
        }
        getInitials()
    }, [name])

    return (
        <div className={`h-[40px] w-[40px] aspect-square rounded-full bg-[#1a1a1a] border border-neutral-600/50 text-gray-200 flex items-center justify-center text-[14px] font-sans`}>
            {initials}
        </div>
    )
}

const AvatarMedium = ({ name }: AvatarProps) => {
    const [initials, setInitials] = useState<String>()

    useEffect(() => {
        const getInitials = () => {
            if(!name) return
            const nameArray = name ? name.split(" "): []
            const first = nameArray[0].split("")[0].toUpperCase()
            const second = nameArray[1].split("")[0].toUpperCase()
            setInitials(first + "" + second )
        }
        getInitials()
    }, [name])

    return (
        <div className={`h-[47px] w-[47px] aspect-square rounded-full bg-[#1a1a1a] border border-neutral-600/50 text-gray-200 flex items-center justify-center text-[14px] font-sans`}>
            {initials}
        </div>
    )
}

const AvatarLarge = ({ name }: AvatarProps) => {
    const [initials, setInitials] = useState<String>()

    useEffect(() => {
        const getInitials = () => {
            if(!name) return
            const nameArray = name ? name.split(" "): []
            const first = nameArray[0].split("")[0].toUpperCase()
            const second = nameArray[1].split("")[0].toUpperCase()
            setInitials(first + "" + second )
        }
        getInitials()
    }, [name])

    return (
        <div className={`h-[70px] w-[70px] aspect-square rounded-2xl bg-[#1a1a1a] border border-neutral-600/50 text-gray-200 flex items-center justify-center text-xl font-sans`}>
            {initials}
        </div>
    )
}

export { AvatarSmall, AvatarMedium, AvatarLarge }