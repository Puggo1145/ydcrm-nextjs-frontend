import { PropsWithChildren } from "react";

import Image from "next/image";
import Header from "../(welcome)/_components/header";

const LoginLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="relative h-screen flex flex-col">
            <Header />
            <section className="absolute top-[15%] w-full h-[240px] md:h-[360px] overflow-hidden">
                <div className="absolute z-10 w-full h-full bg-blue-600 bg-opacity-70"></div>
                <Image
                    className="relative object-cover w-full h-full saturate-0"
                    src="/images/bg-login.webp"
                    width={700} height={500}
                    priority
                    alt="登录"
                />
            </section>
            <main className="relative z-50 flex-1">
                {children}
            </main>
        </div>
    );
};

export default LoginLayout;