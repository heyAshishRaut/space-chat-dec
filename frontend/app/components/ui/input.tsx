"use client"
import { useState } from "react"

interface FieldProps {
    value: any
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const EmailField = ({ value, onChange }: FieldProps) => {
    return (
        <input value={value} onChange={onChange} placeholder="Email" type={"email"} className={`font-mono text-[14px] h-[42px] w-[400px] px-3 flex items-center text-neutral-300 placeholder:text-neutral-500 rounded-xl border-2 border-neutral-400/30 outline-none focus:border-neutral-400`}/>
    )
}

const NameField = ({ value, onChange }: FieldProps) => {
    return (
        <input value={value} onChange={onChange} placeholder="FullName" type={"text"} className={`font-mono text-[14px] h-[42px] w-[400px] px-3 flex items-center text-neutral-300 placeholder:text-neutral-500 rounded-xl border-2 border-neutral-400/30 outline-none focus:border-neutral-400`}/>
    )
}

const SpaceField = ({ value, onChange }: FieldProps) => {
    return (
        <input value={value} onChange={onChange} placeholder="SpaceName" type={"text"} className={`font-mono text-[14px] h-[42px] w-[400px] px-3 flex items-center text-neutral-300 placeholder:text-neutral-500 rounded-xl border-2 border-neutral-400/30 outline-none focus:border-neutral-400`}/>
    )
}

const SpaceCodeField = ({ value, onChange }: FieldProps) => {
    return (
        <input value={value} onChange={onChange} placeholder="SpaceCode" type={"text"} className={`font-mono text-[14px] h-[42px] w-[400px] px-3 flex items-center text-neutral-300 placeholder:text-neutral-500 rounded-xl border-2 border-neutral-400/30 outline-none focus:border-neutral-400`}/>
    )
}

const EmailCodeField = ({ value, onChange }: FieldProps) => {
    return (
        <input value={value} onChange={onChange} placeholder="Enter Code" type={"text"} className={`font-mono text-[14px] h-[42px] w-[400px] px-3 flex items-center text-neutral-300 placeholder:text-neutral-500 rounded-xl border-2 border-neutral-400/30 outline-none focus:border-neutral-400`}/>
    )
}

const PasswordField = ({ value, onChange }: FieldProps) => {
    const [visibility, setVisibility] = useState(false)

    return (
        <div className={`h-[42px] w-[400px] relative`}>
            <input value={value} onChange={onChange} type={visibility ? "text" : "password"} placeholder="Password" className={`font-mono text-[14px] h-full w-full px-3 flex items-center text-neutral-300 placeholder:text-neutral-500 rounded-xl border-2 border-neutral-400/30 outline-none focus:border-neutral-400`}/>
            <div onClick={() => setVisibility(!visibility)} className={`absolute -translate-y-1/2 top-1/2 right-[12px]`}>
                {
                    !visibility ? (
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M252-466v-28h456v28H252Z"/></svg>
                        </div>
                    ) : (
                        <div>
                            <svg stroke={"currentColor"} strokeWidth={4} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF80"><path d="M480.17-132q-72.17 0-135.73-27.39-63.56-27.39-110.57-74.35-47.02-46.96-74.44-110.43Q132-407.65 132-479.83q0-72.17 27.39-135.73 27.39-63.56 74.35-110.57 46.96-47.02 110.43-74.44Q407.65-828 479.83-828q72.17 0 135.73 27.39 63.56 27.39 110.57 74.35 47.02 46.96 74.44 110.43Q828-552.35 828-480.17q0 72.17-27.39 135.73-27.39 63.56-74.35 110.57-46.96 47.02-110.43 74.44Q552.35-132 480.17-132Zm-.17-28q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export { EmailField, NameField, SpaceField, SpaceCodeField, EmailCodeField, PasswordField }