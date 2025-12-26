"use client"
import { motion } from "motion/react"
import React from "react"

interface ButtonProps {
    disabled?: boolean | undefined
    children: React.ReactNode
    onClick?: () => void
}

const PrimaryButton = ({ disabled, children, onClick }: ButtonProps) => {
    return (
        <motion.button
            whileTap={{
                scale: 0.90
            }}
            transition={{
                duration: 0.3,
                ease: "easeIn"
            }}
            disabled={disabled}
            className={`font-mono h-[37px] min-w-[80px] px-4 bg-[#023e8a] hover:bg-[#023e8a]/80 cursor-default text-white rounded-xl text-[13px] flex items-center justify-center`} onClick={onClick}>
            {children}
        </motion.button>
    )
}

const SecondaryButton = ({ disabled, children, onClick }: ButtonProps) => {
    return (
        <motion.button
            whileTap={{
                scale: 0.90
            }}
            transition={{
                duration: 0.3,
                ease: "easeIn"
            }}
            disabled={disabled}
            className={`font-mono h-[37px] min-w-[80px] px-4 bg-gray-300 hover:bg-gray-300/80 cursor-default text-black rounded-xl text-[13px] flex items-center justify-center`} onClick={onClick}>
            {children}
        </motion.button>
    )
}
const OutlineButton = ({ disabled, children, onClick }: ButtonProps) => {
    return (
        <motion.button
            whileTap={{
                scale: 0.90
            }}
            transition={{
                duration: 0.3,
                ease: "easeIn"
            }}
            disabled={disabled}
            className={`font-mono h-[37px] min-w-[80px] px-4 bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 border border-neutral-600/50 text-gray-200 rounded-xl text-[13px] flex items-center justify-center`} onClick={onClick}>
            {children}
        </motion.button>
    )
}

const DestructiveButton = ({ disabled, children, onClick }: ButtonProps) => {
    return (
        <motion.button
            whileTap={{
                scale: 0.90
            }}
            transition={{
                duration: 0.3,
                ease: "easeIn"
            }}
            disabled={disabled}
            className={`font-mono h-[37px] min-w-[80px] px-4 bg-[#d62828]/70 hover:bg-[#d62828]/60 text-neutral-200 rounded-xl text-[13px] flex items-center justify-center`} onClick={onClick}>
            {children}
        </motion.button>
    )
}

export { PrimaryButton, SecondaryButton, OutlineButton, DestructiveButton }