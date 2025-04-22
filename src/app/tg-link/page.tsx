"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

interface ErrorResponse {
    message?: string;
}

export default function TelegramLinkPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth(); // Removed 'role' since it's not used

    useEffect(() => {
        const tg = searchParams.get("tg");

        if (isLoading || !isAuthenticated || !tg || !user?.id) return;

        console.log(user);

        fetch("/api/link-telegram", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tg,
                userId: user.id,
            }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = (await response.json()) as ErrorResponse;
                    throw new Error(errorData.message ?? "Ошибка при привязке Telegram");
                }
                router.push("/profile");
            })
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error("Ошибка при привязке Telegram:", err.message);
                } else {
                    console.error("Неизвестная ошибка:", String(err));
                }
            });
    }, [searchParams, user, isAuthenticated, isLoading, router]);

    return <p>⏳ Подвязываем Telegram к вашему аккаунту...</p>;
}
