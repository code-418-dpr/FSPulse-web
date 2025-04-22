import bcrypt from "bcrypt";

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaClient } from "@/app/generated/prisma";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

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
                    const { email, password } = credentials ?? {};
                    if (!email || !password) {
                        throw new Error("Пожалуйста, введите email и пароль");
                    }

                    // 1. Проверка — атлет
                    const athlete = await prisma.athlete.findUnique({
                        where: { email },
                    });

                    if (athlete && (await bcrypt.compare(password, athlete.password))) {
                        return {
                            id: athlete.id,
                            email: athlete.email,
                            role: "athlete" as const,
                            name: `${athlete.firstname} ${athlete.lastname}`,
                        };
                    }

                    // 2. Проверка — представитель
                    const representative = await prisma.representative.findUnique({
                        where: { email },
                    });

                    if (representative && (await bcrypt.compare(password, representative.password))) {
                        return {
                            id: representative.id,
                            email: representative.email,
                            role: "representative" as const,
                            name: `${representative.firstname} ${representative.lastname}`,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Ошибка авторизации:", error);
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
