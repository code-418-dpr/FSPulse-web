import React from "react";

import { Column, ExportPdfButton } from "@/app/common/_components/ExportPdfButton";
import { Card } from "@/app/common/_components/statistics/Card";
import { LineChart } from "@/app/common/_components/statistics/LineChart";
import { PieChart } from "@/app/common/_components/statistics/PieChart";
import { TableContainer } from "@/app/common/_components/statistics/TableContainer";
import {
    athleteAchievements,
    athleteOverview,
    athleteParticipation,
    athleteParticipationHistory,
    athletePointsOverTime,
} from "@/mocks/statistics/athlete";
import { Badge } from "@heroui/react";
import { Icon } from "@iconify/react";

export function Statistics() {
    // Columns and data for participation history
    const historyColumns: Column[] = [
        { key: "competition", title: "Соревнование" },
        { key: "period", title: "Даты" },
        { key: "place", title: "Место" },
        { key: "points", title: "Баллы" },
    ];

    return (
        <div id="exportable-athlete" className="space-y-8">
            {/* Header + export button */}
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
                    tableData={athleteParticipationHistory}
                />
            </div>

            {/* Main cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Мой рейтинг" icon="lucide:medal">
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                        <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold">
                            {athleteOverview.rank}
                        </div>
                        <div className="text-center">
                            <p className="text-foreground/70 text-sm">Место в рейтинге</p>
                            <p className="text-primary-500 mt-1 text-2xl font-semibold">
                                {athleteOverview.points} <span className="text-sm font-normal">баллов</span>
                            </p>
                        </div>
                    </div>
                </Card>

                <Card title="Участия" icon="lucide:pie-chart">
                    <PieChart data={athleteParticipation} />
                </Card>

                <Card title="Баллы за всё время" icon="lucide:trending-up">
                    <LineChart data={athletePointsOverTime} strokeColor="#39cc7d" />
                </Card>
            </div>

            {/* Achievements */}
            <Card title="Достижения" icon="lucide:award">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {athleteAchievements.map((ach, i) => (
                        <div
                            key={i}
                            className="border-content3 bg-content2/50 hover:border-primary-200 hover:bg-content2 flex flex-col items-center justify-center rounded-lg border p-4 transition-all"
                        >
                            <Badge content={ach.count} color="primary" size="lg" className="mb-2">
                                <div className="bg-primary-100 text-primary-500 dark:bg-primary-900/30 flex h-12 w-12 items-center justify-center rounded-full">
                                    <Icon icon={getAchievementIcon(i)} width={24} />
                                </div>
                            </Badge>
                            <p className="mt-2 text-center font-medium">{ach.title}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Participation history */}
            <Card title="История участий" icon="lucide:history">
                <TableContainer columns={historyColumns} data={athleteParticipationHistory} />
            </Card>
        </div>
    );
}

// Helper function to get different icons for achievements
function getAchievementIcon(index: number): string {
    const icons = ["lucide:medal", "lucide:trophy", "lucide:flag", "lucide:target"];
    return icons[index % icons.length];
}
