// src/app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CircularProgress, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import AchievementCards from '@/app/admin/_components/achievement/achievement-cards';
import EventCards from '@/app/admin/_components/event/event-cards';
import { MainCards } from '@/app/admin/_components/main-cards';
import TeamCards from '@/app/admin/_components/team/team-cards';
import CompetitionCards from '@/components/competition/competition-cards';
import FooterElement from '@/components/footer';
import NavbarElement from '@/components/navbar';
import { SearchCardOrDrawer } from '@/components/search/search-card-or-drawer';
import {
    searchRepresentativeEvents,
    searchRepresentativeRequests,
} from '@/data/event';
import { getRepresentatives } from '@/data/representative';
import { useAuth } from '@/hooks/use-auth';
import {
    AchievementItem,
    EventItem,
    RepresentativeItem,
    Tab,
    TeamItem,
} from '@/types';
import { RepresentativeRequestItem, SearchParams } from '@/types/search';
import { RequestStatus } from '../generated/prisma';
import { RepresentativeTableWithPagination } from './_components/representative-table';

// статистика
import { Card } from '@/app/common/_components/statistics/Card';
import { BarChart } from '@/app/common/_components/statistics/BarChart';
import { LineChart } from '@/app/common/_components/statistics/LineChart';
import { Tabs as StatTabs } from '@/app/common/_components/statistics/Tabs';
import { TableContainer } from '@/app/common/_components/statistics/TableContainer';
import {
    adminEventsByType,
    adminEventsByWeek,
    adminAthleteRanking,
    adminCoachRanking,
    adminRepresentativeRanking,
} from '@/mocks/statistics/admin';

// PDF генерация
import html2canvas from 'html2canvas-pro';                               // поддержка oklch() :contentReference[oaicite:0]{index=0}
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';                                 // новая ESM API :contentReference[oaicite:1]{index=1}

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export default function AdministratorPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const [searchParamsState, setSearchParamsState] = useState<SearchParams>({
        requestStatus: RequestStatus.APPROVED,
    });
    const [representativesData, setRepresentativesData] = useState<
        Paged<RepresentativeItem> | null
    >(null);
    const [eventsData, setEventsData] = useState<Paged<EventItem> | null>(null);
    const [teamData, setTeamData] = useState<Paged<TeamItem> | null>(null);
    const [requestsData, setRequestsData] = useState<
        Paged<RepresentativeRequestItem> | null
    >(null);
    const [achievementData, setAchievementData] = useState<
        Paged<AchievementItem> | null
    >(null);
    const [isLoadingTab, setIsLoadingTab] = useState(false);
    const [page, setPage] = useState(1);

    // основные табы и подтабы
    const [activeTab, setActiveTab] = useState<Tab | 'statistics'>(
        'representative'
    );
    const [rankingTab, setRankingTab] = useState<
        'athletes' | 'coaches' | 'reps'
    >('athletes');

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const perPage = 12;

    // синхрон табов с URL
    useEffect(() => {
        const tab = searchParams.get('tab') as Tab | 'statistics' | null;
        if (
            tab &&
            [
                'representative',
                'events',
                'team',
                'requests',
                'achievement',
                'statistics',
            ].includes(tab)
        ) {
            setActiveTab(tab);
        } else {
            router.replace('/admin?tab=representative');
            setActiveTab('representative');
        }
    }, [pathname, router, searchParams]);

    // редирект, если не залогинены
    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/');
    }, [isLoading, isAuthenticated, router]);

    // загрузка данных для каждого таба...
    useEffect(() => {
        if (activeTab !== 'representative') return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const res = await getRepresentatives({
                    ...searchParamsState,
                    page,
                    pageSize: perPage,
                });
                setRepresentativesData({
                    items: res.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: res.totalItems,
                        totalPages: res.totalPages,
                    },
                });
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page, searchParamsState]);

    useEffect(() => {
        if (activeTab !== 'events') return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const res = await searchRepresentativeEvents({
                    ...searchParamsState,
                    page,
                    pageSize: perPage,
                });
                setEventsData({
                    items: res.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: res.totalItems,
                        totalPages: res.totalPages,
                    },
                });
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page, searchParamsState]);

    useEffect(() => {
        if (activeTab !== 'team') return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const r = await fetch(`/api/teams?page=${page}&pageSize=${perPage}`);
                const data = (await r.json()) as Paged<TeamItem>;
                setTeamData(data);
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page]);

    useEffect(() => {
        if (activeTab !== 'requests') return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const res = await searchRepresentativeRequests({
                    ...searchParamsState,
                    page,
                    pageSize: perPage,
                });
                setRequestsData({
                    items: res.results,
                    pagination: {
                        page,
                        pageSize: perPage,
                        totalItems: res.totalItems,
                        totalPages: res.totalPages,
                    },
                });
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page, searchParamsState]);

    useEffect(() => {
        if (activeTab !== 'achievement') return;
        setIsLoadingTab(true);
        (async () => {
            try {
                const r = await fetch(
                    `/api/achievements?page=${page}&pageSize=${perPage}`
                );
                const data = (await r.json()) as Paged<AchievementItem>;
                setAchievementData(data);
            } finally {
                setIsLoadingTab(false);
            }
        })();
    }, [activeTab, page]);

    const handleSearch = (params: SearchParams) => {
        setSearchParamsState(params);
        setPage(1);
    };

    if (isLoading) return <CircularProgress size="lg" />;
    if (!isAuthenticated) return null;

    // PDF-генерация: сначала захват HTML, потом диаграммы, потом таблица посредством autoTable
    const onExport = async () => {
        const container = document.getElementById('exportable-admin');
        if (!container) return;

        const canvas = await html2canvas(container, { scale: 2 });
        const img = canvas.toDataURL('image/png');

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
        const w = pdf.internal.pageSize.getWidth();
        const h = (canvas.height * w) / canvas.width;
        pdf.addImage(img, 'PNG', 0, 0, w, h);

        // Второй лист — данные таблички представительств
        pdf.addPage();
        autoTable(pdf, {
            head: [['№', 'Регион', 'Ответственный', 'Орг. мероприятий']],
            body: adminRepresentativeRanking.map((r, i) => [
                String(i + 1),
                r.region,
                r.manager,
                String(r.eventsCount),
            ]),
            startY: 20,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 98, 255] },
        });

        pdf.save('admin-statistics.pdf');
    };

    return (
        <>
            <NavbarElement
                activeTab={activeTab}
                setActiveTabAction={setActiveTab}
            />

            <div className="flex min-h-[100vh] w-full">
                <SearchCardOrDrawer
                    onSearchAction={handleSearch}
                    tabType={activeTab as Tab}
                />

                <div className="flex-1 p-6 space-y-8" id="exportable-admin">
                    {/* ... остальные вкладки (representative, events, team, requests, achievement) */}

                    {activeTab === 'statistics' && (
                        <div className="space-y-8">
                            {/* Заголовок + кнопка экспорта */}
                            <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <h2 className="text-2xl font-semibold">Статистика</h2>
                                <Button
                                    onPress={onExport}
                                    size="md"
                                    className="flex items-center space-x-2"
                                >
                                    <Icon icon="iconoir:download" width={20} height={20} />
                                    <span>Скачать статистику</span>
                                </Button>
                            </div>

                            {/* Диаграммы */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card title="Мероприятия по типу">
                                    <BarChart data={adminEventsByType} />
                                </Card>
                                <Card title="Соревнования по неделям">
                                    <LineChart data={adminEventsByWeek} />
                                </Card>
                            </div>

                            {/* Рейтинги */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Рейтинги</h3>
                                <StatTabs
                                    tabs={[
                                        { id: 'athletes', label: 'Спортсмены' },
                                        { id: 'coaches', label: 'Тренеры' },
                                        { id: 'reps', label: 'Представительства' },
                                    ]}
                                    onSelect={(id) =>
                                        setRankingTab(id as 'athletes' | 'coaches' | 'reps')
                                    }
                                />
                                {rankingTab === 'reps' ? (
                                    <TableContainer
                                        columns={[
                                            { key: 'rank', title: '№' },
                                            { key: 'region', title: 'Регион' },
                                            { key: 'manager', title: 'Ответственный' },
                                            { key: 'eventsCount', title: 'Орг. мероприятий' },
                                        ]}
                                        data={adminRepresentativeRanking.map((r, i) => ({
                                            rank: i + 1,
                                            region: r.region,
                                            manager: r.manager,
                                            eventsCount: r.eventsCount,
                                        }))}
                                    />
                                ) : (
                                    <TableContainer
                                        columns={[
                                            { key: 'rank', title: '№' },
                                            { key: 'fio', title: 'ФИО' },
                                            { key: 'region', title: 'Регион' },
                                            { key: 'points', title: 'Баллы' },
                                        ]}
                                        data={(
                                            rankingTab === 'athletes'
                                                ? adminAthleteRanking
                                                : adminCoachRanking
                                        ).map((r, i) => ({
                                            rank: i + 1,
                                            fio: r.fio,
                                            region: r.region,
                                            points: r.points,
                                        }))}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <FooterElement />
        </>
    );
}
