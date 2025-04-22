"use client";

import axios from "axios";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

export default function TelegramLinkPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth(); // Removed 'role' since it's not used

    useEffect(() => {
        const tg = searchParams.get("tg");

        if (isLoading || !isAuthenticated || !tg || !user?.id) return;

        console.log(user);

        axios
            .post("/api/link-telegram", {
                tg,
                userId: user.id,
            })
            .then(() => {
                router.push("/profile");
            })
            .catch((err: unknown) => {
                // Changed type of 'err' to 'unknown'
                if (err instanceof Error) {
                    console.error("Ошибка при привязке Telegram:", err.message);
                } else {
                    console.error("Неизвестная ошибка:", err);
                }
            });
    }, [searchParams, user, isAuthenticated, isLoading, router]);

    return <p>⏳ Подвязываем Telegram к вашему аккаунту...</p>;
}
