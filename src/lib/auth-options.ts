import bcrypt from "bcrypt";

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials.password) return null;

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        include: {
                            athlete: true,
                            representative: true,
                        },
                    });

                    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                        throw new Error("Неверный email или пароль");
                    }

                    let role: "athlete" | "representative" = "athlete";
                    if (user.representative.length > 0) role = "representative";

                    return {
                        id: user.id,
                        email: user.email,
                        name: `${user.firstname} ${user.lastname}`,
                        role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user as User | undefined) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (token.role && token.id) {
                session.user.role = token.role as "athlete" | "representative";
                session.user.id = token.id as string;
            }
            return session;
        },
        redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
