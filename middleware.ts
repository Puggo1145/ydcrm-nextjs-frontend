import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { setRouteRole } from './utils/middleware/checkRouteRole';
import { NextResponse } from 'next/server';
// security
import { RateLimiterMemory } from "rate-limiter-flexible";
// types
import type { RouteRoleOptions } from "@/utils/middleware/checkRouteRole"

// CORS
const allowedOrigins = ["https://www.yuedajiaoyu.top"]

const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 要保护的路由
export const config = {
    matcher: [
        "/",
        "/dashboard",
        "/database/:path*",
        "/taskcenter/:path*",
        "/accounts/:path*",
        "/tasks/:path*",
    ]
}

const routeRoleRules: RouteRoleOptions[] = [
    // GET 为页面层级的权限限制，POST 为 server action 的权限限制
    { route: '/dashboard', method: 'GET', role: ['super_admin'] },
    { route: '/dashboard', method: 'POST', role: ['super_admin'] },

    { route: '/database', method: 'GET', role: ['super_admin', 'admin'] },
    { route: '/database', method: 'POST', role: ['super_admin', 'admin'] },

    { route: '/taskcenter', method: 'GET', role: ['super_admin', 'admin'] },
    { route: '/taskcenter', method: 'POST', role: ['super_admin', 'admin'] },

    { route: '/accounts', method: 'GET', role: ['super_admin'] },
    { route: '/accounts', method: 'POST', role: ['super_admin'] },

    { route: '/tasks', method: 'GET', role: ['super_admin', 'admin', 'employee', 'partime_employee'] },
    { route: '/tasks', method: 'POST', role: ['super_admin', 'admin', 'employee', 'partime_employee'] },
]

const rateLimitOpts = {
    points: 50,
    duration: 5,
}

const rateLimiter = new RateLimiterMemory(rateLimitOpts);

export default withAuth(
    // withAuth augments request with the user's token
    async function middleware(req: NextRequestWithAuth) {
        // rate limiter
        try {
            const rateLimitRes = await rateLimiter.consume(
                req.headers.get("x-forwarded-for")! ||
                req.headers.get("x-real-ip")!,
                1
            );
            if (rateLimitRes.remainingPoints < 1) {
                return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
            }
        } catch (err) {
            return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
        }


        // // content security policy
        // const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
        // const cspHeader = `
        //     default-src 'self';
        //     script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        //     style-src 'self' 'nonce-${nonce}';
        //     img-src 'self' blob: data:;
        //     font-src 'self';
        //     object-src 'none';
        //     base-uri 'self';
        //     form-action 'self';
        //     frame-ancestors 'none';
        //     upgrade-insecure-requests;
        // `
        // // Replace newline characters and spaces
        // const contentSecurityPolicyHeaderValue = cspHeader
        //     .replace(/\s{2,}/g, ' ')
        //     .trim()

        // const requestHeaders = new Headers(req.headers)
        // requestHeaders.set('x-nonce', nonce)

        // requestHeaders.set(
        //     'Content-Security-Policy',
        //     contentSecurityPolicyHeaderValue
        // )

        // const response = NextResponse.next({
        //     request: {
        //         headers: requestHeaders,
        //     },
        // })
        // response.headers.set(
        //     'Content-Security-Policy',
        //     contentSecurityPolicyHeaderValue
        // )

        // CORS
        // Check the origin from the request
        const origin = req.headers.get('origin') ?? ''
        const isAllowedOrigin = allowedOrigins.includes(origin)

        // Handle preflighted requests
        const isPreflight = req.method === 'OPTIONS'
        if (isPreflight) {
            const preflightHeaders = {
                ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
                ...corsOptions,
            }
            return NextResponse.json({}, { headers: preflightHeaders })
        }

        const response = NextResponse.next();

        if (isAllowedOrigin) {
            response.headers.set('Access-Control-Allow-Origin', origin)
        }

        Object.entries(corsOptions).forEach(([key, value]) => {
            response.headers.set(key, value)
        })


        // 权限检查
        const routeRole = setRouteRole({ options: routeRoleRules, req: req });
        if (routeRole) {
            if (req.method === "POST") {
                return NextResponse.json({ error: "权限不足" }, { status: 403 });
            } else {
                return NextResponse.rewrite(new URL('/no-authority', req.url));
            }
        }


        return response;
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)
