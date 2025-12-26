import Image from "next/image"
import logo from "@/public/logoWhite.png"
import JoinSpace from "@/app/components/joinSpace"

const JoinSpacePage = () => {
    return (
        <div className={`h-screen w-screen bg-black flex flex-col`}>
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
                    <div className={`h-full w-full flex flex-col justify-center`}>
                        <div className={`font-instrument text-4xl mb-10`}>Join Space</div>
                        <JoinSpace/>
                        <div className={`mt-6 w-[400px] text-neutral-300 font-mono text-[13px] p-3 flex flex-col rounded-xl border-2 border-emerald-900/50 bg-emerald-800/20`}>
                            Ask your friend to share the space code so you can join.
                        </div>
                        <div className={`mt-3 w-[400px] p-3 flex flex-col rounded-xl border-2 border-blue-900/50 bg-blue-800/20`}>
                            <div className={`text-neutral-300 flex flex-col gap-y-1 text-[13px] font-mono`}>
                                <div>1. Be cool & respectful – Treat everyone kindly</div>
                                <div>2. Keep it safe – No harmful or illegal stuff</div>
                                <div>3. Respect privacy – Don’t share personal info</div>
                                <div>4. Have good conversations – Fun, helpful, or meaningful vibes only</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`hidden md:block h-full w-1/2 py-4`}>
                    <div style={{ backgroundImage: "url(/posters/six.jpg)" }} className="relative h-full w-full rounded-4xl bg-cover bg-center">
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative z-10 h-full w-full flex flex-col gap-y-4 items-center justify-center text-white text-5xl font-instrument">
                            <Image src={logo} alt={`image`} height={60} width={60}/>
                            <div className={`text-3xl`}>Distance fades. Connection remains.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinSpacePage