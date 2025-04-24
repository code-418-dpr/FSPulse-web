// src/app/athlete/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { CircularProgress } from '@heroui/react';
import NavbarElement from '@/components/navbar';
import FooterElement from '@/components/footer';

// статистические компоненты
import { Card } from '@/app/common/_components/statistics/Card';
import { PieChart } from '@/app/common/_components/statistics/PieChart';
import { LineChart } from '@/app/common/_components/statistics/LineChart';
import { TableContainer } from '@/app/common/_components/statistics/TableContainer';
import { ExportPdfButton } from '@/app/common/_components/ExportPdfButton';

// моки данных
import {
    athleteOverview,
    athleteParticipation,
    athletePointsOverTime,
    athleteAchievements,
    athleteParticipationHistory,
} from '@/mocks/statistics/athlete';

export default function AthletePage() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <CircularProgress size="lg" aria-label="Загрузка..." />;
    }
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <NavbarElement activeTab="athlete" />

            {/* заголовок с кнопкой экспорта */}
            <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow">
                <h1 className="text-2xl font-semibold">Моя статистика</h1>
                <ExportPdfButton
                    exportId="exportable-athlete"
                    fileName="athlete-stats.pdf"
                    label="Скачать отчёт"
                />
            </div>

            {/* область, которую экспортируем в PDF */}
            <div
                id="exportable-athlete"
                className="p-6 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
                {/* Основные карточки */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Мой рейтинг">
                        <p>Место: <strong>{athleteOverview.rank}</strong></p>
                        <p>Баллы: <strong>{athleteOverview.points}</strong></p>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {athleteAchievements.map((ach, i) => (
                            <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                                <p className="font-medium">{ach.title}</p>
                                <p className="text-2xl font-bold">{ach.count}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* История участий */}
                <Card title="История участий">
                    <TableContainer
                        columns={[
                            { key: 'competition', title: 'Соревнование' },
                            { key: 'period', title: 'Даты' },
                            { key: 'place', title: 'Место' },
                            { key: 'points', title: 'Баллы' },
                        ]}
                        data={athleteParticipationHistory}
                    />
                </Card>
            </div>

            <FooterElement />
        </>
    );
}
