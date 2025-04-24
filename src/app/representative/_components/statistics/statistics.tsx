import React, { useState } from "react";
import { Icon } from "@iconify/react";

import { Column, ExportPdfButton } from "@/app/common/_components/ExportPdfButton";
import { BarChart } from "@/app/common/_components/statistics/BarChart";
import { Card } from "@/app/common/_components/statistics/Card";
import { LineChart } from "@/app/common/_components/statistics/LineChart";
import { PieChart } from "@/app/common/_components/statistics/PieChart";
import { TableContainer } from "@/app/common/_components/statistics/TableContainer";
import { Tabs as StatTabs } from "@/app/common/_components/statistics/Tabs";
import {
    repAthleteRanking,
    repCoachRanking,
    repEventsByFormat,
    repEventsByMonth,
    repRequestsByStatus,
} from "@/mocks/statistics/representative";

type RankingTab = "athletes" | "coaches";

export function Statistics() {
    const [tab, setTab] = useState<RankingTab>("athletes");

    // Table configuration
    const ratingColumns: Column[] = [
        { key: "rank", title: "№" },
        { key: "fio", title: "ФИО" },
        { key: "points", title: "Баллы" },
    ];
    const ratingData = (tab === "athletes" ? repAthleteRanking : repCoachRanking).map((r, i) => ({
        rank: i + 1,
        ...r,
    }));

    // Custom colors for charts
    const statusColors = [
        "#2889f4", // Primary
        "#39cc7d", // Success
        "#f7b342", // Warning
        "#f43377", // Danger
        "#944dee", // Secondary
    ];

    const coloredRequestData = repRequestsByStatus.map((item, index) => ({
        ...item,
        color: statusColors[index % statusColors.length],
    }));

    return (
        <div id="representative-statistics" className="space-y-8">
            {/* Header + export */}
            <div className="flex items-center justify-between rounded-xl border border-content3 bg-content1 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-500 dark:bg-primary-900/30">
                        <Icon icon="lucide:bar-chart-3" width={24} />
                    </div>
                    <h2 className="text-2xl font-semibold">Статистика</h2>
                </div>
                <ExportPdfButton
                    exportId="representative-statistics"
                    fileName="representative-stats.pdf"
                    label="Скачать статистику"
                    tableColumns={ratingColumns}
                    tableData={ratingData}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Заявки по статусу" icon="lucide:pie-chart">
                    <PieChart data={coloredRequestData} />
                </Card>

                <Card title="Формат мероприятий" icon="lucide:bar-chart-2">
                    <BarChart
                        data={repEventsByFormat}
                        color="#944dee"
                    />
                </Card>

                <Card title="Мероприятия по месяцам" icon="lucide:line-chart">
                    <LineChart
                        data={repEventsByMonth}
                        strokeColor="#39cc7d"
                    />
                </Card>
            </div>

            {/* Rankings */}
            <Card title="Рейтинги региона" icon="lucide:trophy">
                <StatTabs
                    tabs={[
                        { id: "athletes", label: "Спортсмены" },
                        { id: "coaches", label: "Тренеры" },
                    ]}
                    onSelect={(id) => { setTab(id as RankingTab); }}
                />
                <TableContainer columns={ratingColumns} data={ratingData} />
            </Card>
        </div>
    );
}