import Image from "next/image"
import logo from "../public/logoWhite.png"
import UserAccount from "@/app/components/userAccount"
import CreateJoinSpace from "@/app/components/createJoinSpace"

export default function Home() {
    return (
        <div className={`h-full w-full relative`}>
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `
                    radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
                    radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
                    radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
                    radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
                    #000000
                    `,
                }}
            />
            {/* Content */}
            <div className={`relative h-full w-full flex flex-col`}>
                {/* Navbar */}
                <div
                    className={`h-[60px] w-full px-[10px] md:px-[50px] lg:px-[120px] flex items-center justify-between border-b border-neutral-400/30`}>
                    {/* Logo */}
                    <div className={`flex items-center gap-x-2`}>
                        <Image src={logo} alt={"Space Logo White"} height={45} width={45}/>
                        <div className={`font-instrument text-white text-4xl`}>Space</div>
                    </div>

                    <div>
                        <UserAccount/>
                    </div>
                </div>

                {/* Hero Section */}
                <div className={`flex-1 w-full px-[10px] md:px-[50px] lg:px-[120px] flex flex-col justify-between`}>
                    <div className={`mt-30 mb-8 flex flex-col gap-y-2`}>
                        <div className={`font-instrument text-5xl md:text-6xl text-white`}>A Place for Meaningful Conversations</div>
                        <div className={`font-sans text-lg md:text-xl text-neutral-400`}>Create spaces, join communities, share messages and files, and have meaningful conversations without noise.</div>
                        <div className={`mt-6`}>
                            <CreateJoinSpace/>
                        </div>
                    </div>

                    <div className={`hidden md:block mb-8 h-[200px] w-full text-white font-mono`}>
                        <table className={`h-full w-full border border-neutral-400/30`}>
                            <tbody>
                            <tr>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>Create Spaces</td>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>Join with Ease</td>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>Live Messaging</td>
                            </tr>
                            <tr>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>File Sharing</td>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>Private & Secure</td>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>Built for Communities</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={`block md:hidden mb-8 h-[200px] w-full text-white font-mono`}>
                        <table className={`h-full w-full border border-neutral-400/30`}>
                            <tbody>
                            <tr>
                                <td className={`h-1/3 w-full border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>Live Messaging</td>
                            </tr>
                            <tr>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>File Sharing</td>
                            </tr>
                            <tr>
                                <td className={`h-1/3 w-1/3 border border-neutral-400/30 hover:bg-neutral-800/50 text-center`}>Built for Communities</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
