"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import { Column, ExportPdfButton } from "@/app/common/_components/ExportPdfButton";
import { BarChart } from "@/app/common/_components/statistics/BarChart";
import { Card } from "@/app/common/_components/statistics/Card";
import { LineChart } from "@/app/common/_components/statistics/LineChart";
import { TableContainer } from "@/app/common/_components/statistics/TableContainer";
import { Tabs as StatTabs } from "@/app/common/_components/statistics/Tabs";

// серверные функции
import {
    getAthleteRanking,
    getCoachRanking,
    getRepresentativeRanking,
    getEventsByType,
    getEventsByWeek,
} from "@/data/adminStatistics";

type RankingTab = "athletes" | "coaches" | "reps";

export function Statistics() {
    const [tab, setTab] = useState<RankingTab>("athletes");

    // рейтинги
    const [athleteData, setAthleteData] = useState<Array<{ fio: string; region: string; points: number }>>([]);
    const [coachData, setCoachData] = useState<Array<{ fio: string; region: string; points: number }>>([]);
    const [repData, setRepData] = useState<Array<{ region: string; manager: string; eventsCount: number }>>([]);

    // данные для графиков
    const [eventsByType, setEventsByType] = useState<Array<{ type: string; count: bigint }>>([]);
    const [eventsByWeek, setEventsByWeek] = useState<Array<{ week: string; count: bigint }>>([]);

    useEffect(() => {
        // загрузка рейтингов
        getAthleteRanking().then(raw => setAthleteData(raw.map(r => ({ fio: r.fio, region: r.region, points: Number(r.points) }))));
        getCoachRanking().then(raw => setCoachData(raw.map(r => ({ fio: r.fio, region: r.region, points: Number(r.points) }))));
        getRepresentativeRanking().then(raw => setRepData(raw.map(r => ({ region: r.region, manager: r.manager, eventsCount: Number(r.eventsCount) }))));

        // загрузка статистики по мероприятиям
        getEventsByType().then(raw => setEventsByType(raw));
        getEventsByWeek().then(raw => setEventsByWeek(raw));
    }, []);

    // подготовка строк таблиц
    const repColumns: Column[] = [
        { key: "rank", title: "№" },
        { key: "region", title: "Регион" },
        { key: "manager", title: "Ответственный" },
        { key: "eventsCount", title: "Орг. мероприятий" },
    ];
    const repRows = repData.map((r, i) => ({ rank: i + 1, ...r }));

    const ratingColumns: Column[] = [
        { key: "rank", title: "№" },
        { key: "fio", title: "ФИО" },
        { key: "region", title: "Регион" },
        { key: "points", title: "Баллы" },
    ];
    const ratingRows = (tab === "athletes" ? athleteData : coachData).map((r, i) => ({ rank: i + 1, ...r }));

    return (
        <div id="statistics-box" className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between rounded-xl border border-content3 bg-content1 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-100 text-primary-500 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                        <Icon icon="lucide:bar-chart-2" width={24} />
                    </div>
                    <h2 className="text-2xl font-semibold">Статистика</h2>
                </div>
                <ExportPdfButton
                    exportId="statistics-box"
                    fileName="admin-statistics.pdf"
                    label="Скачать статистику"
                    tableColumns={tab === "reps" ? repColumns : ratingColumns}
                    tableData={tab === "reps" ? repRows : ratingRows}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card title="Мероприятия по типу" icon="lucide:pie-chart">
                    <BarChart data={eventsByType.map(e => ({ label: e.type, value: Number(e.count) }))} color="#944dee" />
                </Card>
                <Card title="Соревнования по неделям" icon="lucide:line-chart">
                    <LineChart data={eventsByWeek.map(e => ({ label: e.week, value: Number(e.count) }))} strokeColor="#2889f4" />
                </Card>
            </div>

            {/* Rankings */}
            <Card title="Рейтинги" icon="lucide:trophy">
                <StatTabs
                    tabs={[
                        { id: "athletes", label: "Спортсмены" },
                        { id: "coaches", label: "Тренеры" },
                        { id: "reps", label: "Представительства" },
                    ]}
                    onSelect={(id) => setTab(id as RankingTab)}
                />
                {tab === "reps" ? (
                    <TableContainer columns={repColumns} data={repRows} />
                ) : (
                    <TableContainer columns={ratingColumns} data={ratingRows} />
                )}
            </Card>
        </div>
    );
}
