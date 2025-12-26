import { motion } from "motion/react"

interface AlertBoxProps {
    content: String
}

const AlertBox = ({ content }: AlertBoxProps) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -10
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: -10
            }}
            transition={{
                duration: 0.3,
                ease: "easeIn"
            }}
            className={`z-99 border border-blue-900/50 bg-blue-800/20 backdrop-blur-md text-neutral-300 p-3 w-[400px] rounded-xl flex items-center gap-x-3 text-[13px] font-mono`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`min-h-6 min-w-6 aspect-square`} height="24px" stroke={"currentColor"} strokeWidth={4} viewBox="0 -960 960 960" width="24px" fill="#FFF"><path d="M480-308q8.5 0 14.25-5.75T500-328q0-8.5-5.75-14.25T480-348q-8.5 0-14.25 5.75T460-328q0 8.5 5.75 14.25T480-308Zm-14-124h28v-240h-28v240Zm14.17 300q-72.17 0-135.73-27.39-63.56-27.39-110.57-74.35-47.02-46.96-74.44-110.43Q132-407.65 132-479.83q0-72.17 27.39-135.73 27.39-63.56 74.35-110.57 46.96-47.02 110.43-74.44Q407.65-828 479.83-828q72.17 0 135.73 27.39 63.56 27.39 110.57 74.35 47.02 46.96 74.44 110.43Q828-552.35 828-480.17q0 72.17-27.39 135.73-27.39 63.56-74.35 110.57-46.96 47.02-110.43 74.44Q552.35-132 480.17-132Zm-.17-28q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            <motion.div
            initial={{
                opacity: 0,
                filter: `blur(5px)`
            }}
            animate={{
                opacity: 1,
                filter: `blur(0px)`
            }}
            exit={{
                opacity: 0,
                filter: `blur(5px)`
            }}
            transition={{
                duration: 0.3,
                ease: "easeIn"
            }}
            >{content}</motion.div>
        </motion.div>
    )
}

export default AlertBox