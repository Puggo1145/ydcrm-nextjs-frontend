"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
            <section>
                <h2 className="text-lg">应用发生错误！请重试</h2>
                <p>{error.message}</p>
            </section>
            <section className="space-x-2">
                <Button onClick={() => reset()}>
                    重试
                </Button>
                <Button asChild>
                    <Link href="/">
                        返回主页面
                    </Link>
                </Button>
            </section>
        </div>
    );
};

export default Error;