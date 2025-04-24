"use client";

import React, { useEffect, useState } from "react";

import { Column, ExportPdfButton } from "@/app/common/_components/ExportPdfButton";
import { BarChart } from "@/app/common/_components/statistics/BarChart";
import { Card } from "@/app/common/_components/statistics/Card";
import { LineChart } from "@/app/common/_components/statistics/LineChart";
import { PieChart } from "@/app/common/_components/statistics/PieChart";
import { TableContainer } from "@/app/common/_components/statistics/TableContainer";
import { Tabs as StatTabs } from "@/app/common/_components/statistics/Tabs";
import {
    getRepAthleteRanking,
    getRepCoachRanking,
    getRepEventsByFormat,
    getRepEventsByMonth,
    getRepRequestsByStatus,
} from "@/data/representativeStatistics";
import { useAuth } from "@/hooks/use-auth";
import { Icon } from "@iconify/react";

type RankingTab = "athletes" | "coaches";

export default function StatisticsClient() {
    const { user, isLoading, isAuthenticated } = useAuth();

    // состояния
    const [loadingData, setLoadingData] = useState(true);
    const [requestsByStatus, setRequestsByStatus] = useState<{ label: string; value: number; color: string }[]>([]);
    const [eventsByFormat, setEventsByFormat] = useState<{ label: string; value: number }[]>([]);
    const [eventsByMonth, setEventsByMonth] = useState<{ label: string; value: number }[]>([]);
    const [athleteRanking, setAthleteRanking] = useState<{ fio: string; region: string; points: number }[]>([]);
    const [coachRanking, setCoachRanking] = useState<{ fio: string; region: string; points: number }[]>([]);
    const [tab, setTab] = useState<RankingTab>("athletes");

    // загрузка данных после авторизации
    useEffect(() => {
        if (isLoading || !isAuthenticated || !user?.id) return;
        const repId = user.id;
        const statusColors = ["#2889f4", "#39cc7d", "#f7b342", "#f43377", "#944dee"];
        const callback = async () => {
            await Promise.all([
                getRepRequestsByStatus(repId),
                getRepEventsByFormat(repId),
                getRepEventsByMonth(repId),
                getRepAthleteRanking(repId),
                getRepCoachRanking(repId),
            ]).then(([reqs, formats, months, aRank, cRank]) => {
                setRequestsByStatus(
                    reqs.map((x, i) => ({
                        label: x.status,
                        value: x.count,
                        color: statusColors[i % statusColors.length],
                    })),
                );
                setEventsByFormat(formats.map((x) => ({ label: x.label, value: x.value })));
                setEventsByMonth(months.map((x) => ({ label: x.month, value: x.count })));
                setAthleteRanking(aRank.map((x) => ({ fio: x.fio, region: x.region, points: x.points })));
                setCoachRanking(cRank.map((x) => ({ fio: x.fio, region: x.region, points: x.points })));
                setLoadingData(false);
            });
        };
        void callback();
    }, [user, isLoading, isAuthenticated]);

    // рендер по статусам
    if (isLoading) return <p>Загрузка профиля…</p>;
    if (!isAuthenticated) return <p>Пожалуйста, войдите.</p>;
    if (loadingData) return <p>Загрузка статистики…</p>;

    // конфиг таблицы
    const ratingColumns: Column[] = [
        { key: "rank", title: "№" },
        { key: "fio", title: "ФИО" },
        { key: "region", title: "Регион" },
        { key: "points", title: "Баллы" },
    ];
    const ratingData = (tab === "athletes" ? athleteRanking : coachRanking).map((r, i) => ({
        rank: i + 1,
        fio: r.fio,
        region: r.region,
        points: r.points,
    }));

    return (
        <div id="representative-statistics" className="space-y-8">
            {/* Header + Export */}
            <div className="border-content3 bg-content1 flex items-center justify-between rounded-xl border p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-100 text-primary-500 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
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
                    <PieChart data={requestsByStatus} />
                </Card>

                <Card title="Формат мероприятий" icon="lucide:bar-chart-2">
                    <BarChart data={eventsByFormat} color="#944dee" />
                </Card>

                <Card title="Мероприятия по месяцам" icon="lucide:line-chart">
                    <LineChart data={eventsByMonth} strokeColor="#39cc7d" />
                </Card>
            </div>

            {/* Rankings */}
            <Card title="Рейтинги региона" icon="lucide:trophy">
                <StatTabs
                    tabs={[
                        { id: "athletes", label: "Спортсмены" },
                        { id: "coaches", label: "Тренеры" },
                    ]}
                    onSelect={(id) => {
                        setTab(id as RankingTab);
                    }}
                />
                <TableContainer columns={ratingColumns} data={ratingData} />
            </Card>
        </div>
    );
}
