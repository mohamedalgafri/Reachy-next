import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import authConfig from '@/auth.config'
import { getUserById } from './data/user'
import { UserRole } from '@prisma/client'

declare module "next-auth" {
    interface User {
        role: UserRole;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole;
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            });
        }
    },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                const existingUser = await getUserById(token.sub);
                
                if (!existingUser || existingUser.role !== UserRole.ADMIN) {
                    return null;
                }
                
                session.user.id = token.sub;
                session.user.role = token.role as UserRole;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            
            if (!existingUser) return token;
            
            token.role = existingUser.role;
            token.name = existingUser.name;
            token.email = existingUser.email;
            
            return token;
        }
    },
    session: { 
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days 
        updateAge: 24 * 60 * 60, 
    },
    ...authConfig,
})