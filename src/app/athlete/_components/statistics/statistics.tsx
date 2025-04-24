"use client";

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

export function Statistics() {
    // Колонки и данные для истории участий
    const historyColumns: Column[] = [
        { key: "competition", title: "Соревнование" },
        { key: "period", title: "Даты" },
        { key: "place", title: "Место" },
        { key: "points", title: "Баллы" },
    ];

    return (
        <div id="exportable-athlete" className="space-y-8">
            {/* Шапка + кнопка экспорта */}
            <div className="flex items-center justify-between rounded p-6 shadow">
                <h1 className="text-2xl font-semibold">Моя статистика</h1>
                <ExportPdfButton
                    exportId="exportable-athlete"
                    fileName="athlete-stats.pdf"
                    label="Скачать отчёт"
                    tableColumns={historyColumns}
                    tableData={athleteParticipationHistory}
                />
            </div>

            {/* Основные карточки */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Мой рейтинг">
                    <p>
                        Место: <strong>{athleteOverview.rank}</strong>
                    </p>
                    <p>
                        Баллы: <strong>{athleteOverview.points}</strong>
                    </p>
                </Card>
                <Card title="Участия">
                    <PieChart data={athleteParticipation} />
                </Card>
                <Card title="Баллы за всё время">
                    <LineChart data={athletePointsOverTime} />
                </Card>
            </div>

            {/* Достижения */}
            <Card title="Достижения">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {athleteAchievements.map((ach, i) => (
                        <div key={i} className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-700">
                            <p className="font-medium">{ach.title}</p>
                            <p className="text-2xl font-bold">{ach.count}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* История участий */}
            <Card title="История участий">
                <TableContainer columns={historyColumns} data={athleteParticipationHistory} />
            </Card>
        </div>
    );
}
