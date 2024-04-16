"use client"
import { PropsWithChildren } from "react";

// icons
import { ArrowLeft } from "lucide-react";
// shadcn ui
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
// hooks
import { useRouter } from "next-nprogress-bar";

const DetailsLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const router = useRouter();

    return (
        <div>
            <Card className="h-full space-y-4">
                <CardHeader className="py-4 flex flex-row items-center justify-between border-b">
                    <Button
                        variant={"ghost"}
                        className="flex items-center gap-x-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft />
                        <h6 className="text-md font-bold">返回</h6>
                    </Button>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
};

export default DetailsLayout;