import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center gap-x-4">
            <section>
                <h2 className="text-xl font-bold">页面不存在</h2>
                <p className="text-sm text-muted-foreground">请检查您的浏览器地址</p>
            </section>
            <Button asChild>
                <Link href="/">返回主页面</Link>
            </Button>
        </div>
    );
};

export default NotFound;