// src/app/athlete/_components/statistics/statistics.tsx
"use client";

import React, { useEffect, useState } from "react";

import { Column, ExportPdfButton } from "@/app/common/_components/ExportPdfButton";
import { Card } from "@/app/common/_components/statistics/Card";
import { LineChart } from "@/app/common/_components/statistics/LineChart";
import { PieChart } from "@/app/common/_components/statistics/PieChart";
import { TableContainer } from "@/app/common/_components/statistics/TableContainer";
import {
    getAthleteAchievements,
    getAthleteOverview,
    getAthleteParticipation,
    getAthleteParticipationHistory,
    getAthletePointsOverTime,
} from "@/data/athleteStatistics";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@heroui/react";
import { Icon } from "@iconify/react";

// src/app/athlete/_components/statistics/statistics.tsx

interface HistoryRow {
    competition: string;
    period: string;
    place: string | null;
    points: number;
}

export default function Statistics() {
    const { user, isLoading, isAuthenticated } = useAuth();

    const [loadingData, setLoadingData] = useState(true);
    const [overview, setOverview] = useState<{ rank: number; points: number }>({
        rank: 0,
        points: 0,
    });
    const [participation, setParticipation] = useState<{ label: string; value: number }[]>([]);
    const [pointsOverTime, setPointsOverTime] = useState<{ label: string; value: number }[]>([]);
    const [achievements, setAchievements] = useState<{ label: string; value: number }[]>([]);
    const [history, setHistory] = useState<HistoryRow[]>([]);

    // Иконки для достижений
    const achievementIcons = ["lucide:medal", "lucide:trophy", "lucide:flag", "lucide:target"];

    useEffect(() => {
        async function load() {
            if (isLoading || !isAuthenticated || !user?.id) return;
            const athleteId = user.id;

            try {
                const [ov, part, overTime, ach, hist] = await Promise.all([
                    getAthleteOverview(athleteId),
                    getAthleteParticipation(athleteId),
                    getAthletePointsOverTime(athleteId),
                    getAthleteAchievements(athleteId),
                    getAthleteParticipationHistory(athleteId),
                ]);

                setOverview(ov);
                setParticipation(part);
                setPointsOverTime(overTime);
                setAchievements(ach);
                setHistory(hist);
            } catch (error) {
                console.error("Ошибка загрузки статистики:", error);
            } finally {
                setLoadingData(false);
            }
        }

        void load();
    }, [user, isLoading, isAuthenticated]);

    if (isLoading) return <p>Загрузка профиля…</p>;
    if (!isAuthenticated) return <p>Пожалуйста, войдите.</p>;
    if (loadingData) return <p>Загрузка статистики…</p>;

    const historyColumns: Column[] = [
        { key: "competition", title: "Соревнование" },
        { key: "period", title: "Даты" },
        { key: "place", title: "Место" },
        { key: "points", title: "Баллы" },
    ];

    return (
        <div id="exportable-athlete" className="space-y-8">
            {/* Header + Export */}
            <div className="border-content3 bg-content1 flex items-center justify-between rounded-xl border p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-100 text-primary-500 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Icon icon="lucide:activity" width={24} />
                    </div>
                    <h1 className="text-2xl font-semibold">Моя статистика</h1>
                </div>
                <ExportPdfButton
                    exportId="exportable-athlete"
                    fileName="athlete-stats.pdf"
                    label="Скачать отчёт"
                    tableColumns={historyColumns}
                    tableData={history}
                />
            </div>

            {/* Main cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Мой рейтинг" icon="lucide:medal">
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                        <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold">
                            {overview.rank}
                        </div>
                        <div className="text-center">
                            <p className="text-foreground/70 text-sm">Место в рейтинге</p>
                            <p className="text-primary-500 mt-1 text-2xl font-semibold">
                                {overview.points} <span className="text-sm font-normal">баллов</span>
                            </p>
                        </div>
                    </div>
                </Card>

                <Card title="Участия" icon="lucide:pie-chart">
                    <PieChart data={participation} />
                </Card>

                <Card title="Баллы за всё время" icon="lucide:trending-up">
                    <LineChart data={pointsOverTime} strokeColor="#39cc7d" />
                </Card>
            </div>

            {/* Achievements */}
            <Card title="Достижения" icon="lucide:award">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {achievements.map((ach, i) => (
                        <div
                            key={ach.label}
                            className="border-content3 bg-content2/50 hover:border-primary-200 hover:bg-content2 flex flex-col items-center justify-center rounded-lg border p-4 transition-all"
                        >
                            <Badge content={ach.value} color="primary" size="lg" className="mb-2">
                                <div className="bg-primary-100 text-primary-500 dark:bg-primary-900/30 flex h-12 w-12 items-center justify-center rounded-full">
                                    <Icon icon={achievementIcons[i % achievementIcons.length]} width={24} />
                                </div>
                            </Badge>
                            <p className="mt-2 text-center font-medium">{ach.label}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Participation history */}
            <Card title="История участий" icon="lucide:history">
                <TableContainer columns={historyColumns} data={history} />
            </Card>
        </div>
    );
}
