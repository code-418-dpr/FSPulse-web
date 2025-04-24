"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { setResultsForEvent } from "@/data/event";
import { getTeamsByEvent } from "@/data/team";
import { TeamWithMembersItem } from "@/types";
import { Button, Form, NumberInput } from "@heroui/react";

export default function EventResultsForm({ eventId }: { eventId: string }) {
    const [data, setData] = React.useState<TeamWithMembersItem[] | null>(null);
    const [results, setResults] = useState<Record<string, number>>({});
    const router = useRouter();

    const handleCreateValues = React.useCallback(async () => {
        const teamsOnEvent = await getTeamsByEvent(eventId);

        // Объединяем тестовые данные с реальными командами
        const allTeams = teamsOnEvent.map((team) => {
            // Находим капитана (isLeader: true)
            const captain = team.athletes.find((a) => a.isLeader)?.athlete;

            // Получаем всех участников (исключая капитана)
            const members = team.athletes.filter((a) => !a.isLeader).map((a) => a.athlete);

            return {
                id: team.id,
                name: team.name,
                isReady: team.isReady,
                about: team.about ?? "",
                leader: captain
                    ? `${captain.user.lastname || "Неизвестно"} ${captain.user.firstname || ""}`
                    : "Капитан не назначен",
                members: members.map((m) => `${m.user.lastname || "Анонимный участник"} ${m.user.firstname || ""}`),
            };
        });

        setData(allTeams);
    }, [eventId]); // Зависимости функции

    useEffect(() => {
        handleCreateValues().catch((error: unknown) => {
            // Явное указание типа unknown
            if (error instanceof Error) {
                console.error("Ошибка загрузки команд:", error.message);
            } else {
                console.error("Неизвестная ошибка:", error);
            }
        });
    }, [handleCreateValues]);

    const handleScoreChange = (teamId: string, score: number) => {
        setResults((prev) => ({ ...prev, [teamId]: score }));
    };

    const onSubmit = async () => {
        try {
            const resultsArray = Object.entries(results).map(([teamId, score]) => ({
                teamId,
                score,
            }));

            await setResultsForEvent(resultsArray, eventId);

            console.log("Успешно!!!!!");

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
    };

    /*
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e).catch(console.error);
    };
     */

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                void onSubmit().then();
            }}
        >
            {data?.map((team) => (
                <NumberInput
                    key={`grade-${team.id}`}
                    label={team.name}
                    variant="bordered"
                    required={true}
                    value={results[team.id] || 0}
                    onValueChange={(value) => { handleScoreChange(team.id, value); }}
                    minValue={0}
                    maxValue={300}
                />
            ))}
            <Button type="submit" className="m-2 w-full">
                Выставить результаты
            </Button>
        </Form>
    );
}
