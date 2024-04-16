import CredentialsProvider from "next-auth/providers/credentials";
// server actions
import { signIn } from "@/actions/auth/actions";
// types
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                name: { label: 'Name', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const res = await signIn(credentials!);

                
                if (res?.ok) {
                    const user = res.user;

                    return {
                        id: user.id,
                        role: user.role,
                        name: user.name,
                        phone: user.phone
                    };
                }

                return null;
            }
        })
    ],
    session: {
        // 12 小时
        strategy: 'jwt',
        maxAge: 12 * 60 * 60,
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.phone = user.phone;
            }

            return token;
        },
        async session({session, token}) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.user.phone = token.phone as string;

            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
}