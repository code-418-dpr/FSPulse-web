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

                    if (
                        credentials.email === process.env.ADMIN_EMAIL &&
                        credentials.password === process.env.ADMIN_PASSWORD
                    ) {
                        return {
                            id: "admin-id",
                            email: process.env.ADMIN_EMAIL,
                            name: "Федерация",
                            role: "admin",
                        };
                    }

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
                    if (user.representative.length > 0) {
                        const representative = user.representative[0];
                        if (representative.requestStatus === "PENDING") {
                            throw new Error("Ваша заявка на представительство находится на рассмотрении.");
                        } else if (representative.requestStatus === "DECLINED") {
                            throw new Error("Ваша заявка на представительство отклонена.");
                        }
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
                    throw error;
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
                session.user.role = token.role as "athlete" | "representative" | "admin";
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
