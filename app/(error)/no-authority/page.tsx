import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

const NoAuthority: React.FC = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <Ban size={128} />
            <h1 className="text-3xl font-bold text-foreground">
                您没有权限访问该页面
            </h1>
            <Button className="mt-8">
                <Link href="/">返回主页面</Link>
            </Button>
        </div>
    );
};

export default NoAuthority;