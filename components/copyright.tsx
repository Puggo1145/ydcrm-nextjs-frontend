import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/authOptions";

const Copyright: React.FC = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="
            z-50 fixed w-full h-screen pointer-events-none flex flex-wrap"
        >
            {
                Array.from({ length: 16 }, (_, index) => (
                    <div
                        className="
                        text-xs text-muted-foreground opacity-10 size-[180px] md:size-[300px]
                        flex items-center justify-center -rotate-45"
                        key={index}
                    >
                        {session?.user.name ?? ""}-{new Date().toLocaleDateString()}
                    </div>
                ))
            }
        </div>
    );
};

export default Copyright;