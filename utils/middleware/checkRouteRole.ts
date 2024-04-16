import type { NextRequestWithAuth } from "next-auth/middleware"
import type { role } from "@/types/modelType/user";

export interface RouteRoleOptions {
    route: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    role: NonNullable<role>[]
}

interface Params {
    options: RouteRoleOptions[];
    req: NextRequestWithAuth;
}

export const setRouteRole = ({ options, req }: Params) => {
    // 获取当前请求的路由和方法
    const requestRoute = req.nextUrl.pathname;
    const requestMethod = req.method;

    // 查找与请求匹配的规则
    const routeRule = options.find(option => 
        requestRoute.startsWith(option.route) && option.method === requestMethod
    );

    // 如果请求路由不存在规则，直接通过
    if (!routeRule || routeRule.role.length === 0) return false;

    // 检查用户是否有权限
    const hasRole = routeRule.role.includes(req.nextauth.token?.role);

    // 如果用户没有权限，返回 true
    return !hasRole;
}