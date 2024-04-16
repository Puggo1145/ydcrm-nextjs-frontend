// 该路由下包含无权限与错误页面
import { PropsWithChildren } from "react";

const ErrorLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="h-screen flex items-center">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default ErrorLayout;