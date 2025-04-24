// src/app/representative/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, CircularProgress, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';

import AchievementCards from '@/app/representative/_components/achievement/achievement-cards';
import EventCards from '@/app/representative/_components/event/event-cards';
import { MainCards } from '@/app/representative/_components/main-cards';
import TeamCards from '@/app/representative/_components/team/team-cards';
import CompetitionCards from '@/components/competition/competition-cards';
import CompetitionCreateForm from '@/components/competition/competition-create-form';
import FooterElement from '@/components/footer';
import ModalOrDrawer from '@/components/modal-or-drawer';
import NavbarElement from '@/components/navbar';
import { SearchCardOrDrawer } from '@/components/search/search-card-or-drawer';
import { searchRepresentativeRequests } from '@/data/event';
import { useAuth } from '@/hooks/use-auth';
import { AchievementItem, EventItem, Tab, TeamItem } from '@/types';
import { RepresentativeRequestItem, SearchParams } from '@/types/search';
import { RequestStatus } from '../generated/prisma';

// статистические компоненты и моки
import { Card } from '@/app/common/_components/statistics/Card';
import { PieChart } from '@/app/common/_components/statistics/PieChart';
import { BarChart } from '@/app/common/_components/statistics/BarChart';
import { LineChart } from '@/app/common/_components/statistics/LineChart';
import { Tabs as StatTabs } from '@/app/common/_components/statistics/Tabs';
import { TableContainer } from '@/app/common/_components/statistics/TableContainer';

import {
    repRequestsByStatus,
    repEventsByFormat,
    repEventsByMonth,
    repAthleteRanking,
    repCoachRanking,
} from '@/mocks/statistics/representative';

// PDF-генерация
import html2canvas from 'html2canvas-pro'; // поддерживает oklch(), lab(), lch() и др. :contentReference[oaicite:2]{index=2}
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';   // ESM API плагина для таблиц :contentReference[oaicite:3]{index=3}

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export default function RepresentativePage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [searchParamsState, setSearchParamsState] = useState<SearchParams>({
        requestStatus: RequestStatus.PENDING,
    });
    const [requestsData, setRequestsData] = useState<
        Paged<RepresentativeRequestItem> | null
    >(null);
    const [isRequestsLoading, setIsRequestsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [activeTab, setActiveTab] = useState<Tab>('requests');
    const [ratingTab, setRatingTab] = useState<'athletes' | 'coaches'>(
        'athletes'
    );

    const [eventsData, setEventsData] = useState<Paged<EventItem> | null>(null);
    const [isEventLoading, setIsEventLoading] = useState(false);
    const [teamData, setTeamData] = useState<Paged<TeamItem> | null>(null);
    const [isTeamLoading, setIsTeamLoading] = useState(false);
    const [achievementData, setAchievementData] = useState<
        Paged<AchievementItem> | null
    >(null);
    const [isAchievementLoading, setIsAchievementLoading] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const perPage = 12;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // синхронизируем таб с URL
    useEffect(() => {
        const tab = searchParams.get('tab') as Tab | null;
        if (tab && ['requests', 'events', 'team', 'achievement'].includes(tab)) {
            setActiveTab(tab);
        } else {
            router.replace('/representative?tab=requests');
            setActiveTab('requests');
        }
    }, [pathname, router, searchParams]);

    // редирект, если не аутентифицировано
    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/');
    }, [isLoading, isAuthenticated, router]);

    // загрузка данных
    useEffect(() => {
        if (activeTab === 'requests' && user?.id) {
            setIsRequestsLoading(true);
            (async () => {
                try {
                    const params = {
                        ...searchParamsState,
                        representativeId: user.id,
                        page,
                        pageSize: perPage,
                    };
                    const result = await searchRepresentativeRequests(params);
                    setRequestsData({
                        items: result.results,
                        pagination: {
                            page,
                            pageSize: perPage,
                            totalItems: result.totalItems,
                            totalPages: result.totalPages,
                        },
                    });
                } finally {
                    setIsRequestsLoading(false);
                }
            })();
        }
    }, [activeTab, page, searchParamsState, user?.id]);

    useEffect(() => {
        if (activeTab === 'events') {
            setIsEventLoading(true);
            fetch(`/api/events?page=${page}&pageSize=${perPage}`)
                .then((r) => r.json())
                .then((json: Paged<EventItem>) => setEventsData(json))
                .finally(() => setIsEventLoading(false));
        }
    }, [activeTab, page]);

    useEffect(() => {
        if (activeTab === 'team') {
            setIsTeamLoading(true);
            fetch(`/api/teams?page=${page}&pageSize=${perPage}`)
                .then((r) => r.json())
                .then((json: Paged<TeamItem>) => setTeamData(json))
                .finally(() => setIsTeamLoading(false));
        }
    }, [activeTab, page]);

    useEffect(() => {
        if (activeTab === 'achievement') {
            setIsAchievementLoading(true);
            fetch(`/api/achievements?page=${page}&pageSize=${perPage}`)
                .then((r) => r.json())
                .then((json: Paged<AchievementItem>) => setAchievementData(json))
                .finally(() => setIsAchievementLoading(false));
        }
    }, [activeTab, page]);

    const handleSearch = (params: SearchParams) => {
        setSearchParamsState(params);
        setPage(1);
    };

    const ratingColumns = [
        { key: 'rank', title: '№' },
        { key: 'fio', title: 'ФИО' },
        { key: 'points', title: 'Баллы' },
    ];

    if (isLoading) return <CircularProgress size="lg" />;
    if (!isAuthenticated) return null;

    // Функция экспорта PDF: сначала снимок экрана, потом таблица рейтингов
    const onExport = async () => {
        const container = document.getElementById('exportable');
        if (!container) return;
        const canvas = await html2canvas(container, { scale: 2 });                   // рендерим HTML :contentReference[oaicite:4]{index=4}
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = (canvas.height * pageW) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH);

        // Новый лист с таблицей рейтингов
        pdf.addPage();
        autoTable(pdf, {
            head: [ratingColumns.map((c) => c.title)],
            body: repAthleteRanking
                .map((r, i) => [String(i + 1), r.fio, String(r.points)]),
            startY: 20,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 98, 255] },
        });                                                                         // ESM API autoTable :contentReference[oaicite:5]{index=5}

        pdf.save('representative-stats.pdf');
    };

    return (
        <>
            <NavbarElement
                activeTab={activeTab}
                setActiveTabAction={setActiveTab}
            />

            <div className="flex min-h-[100vh] w-full">
                {activeTab !== 'achievement' && (
                    <SearchCardOrDrawer
                        onSearchAction={handleSearch}
                        tabType={activeTab}
                    />
                )}

                <div className="flex-1 p-6 space-y-8" id="exportable">
                    {/* Кнопка PDF */}
                    {activeTab === 'achievement' && (
                        <div className="flex justify-end">
                            <Button
                                onPress={onExport}
                                size="md"
                                className="flex items-center space-x-2"
                            >
                                <Icon icon="iconoir:download" width={20} height={20} />
                                <span>Скачать статистику</span>
                            </Button>
                        </div>
                    )}

                    {/* Основной контент по вкладкам */}
                    {activeTab === 'requests' && (
                        <>
                            <MainCards<RepresentativeRequestItem>
                                isLoading={isRequestsLoading}
                                pageItems={requestsData?.items ?? []}
                                totalPages={requestsData?.pagination.totalPages ?? 1}
                                page={page}
                                setPageAction={setPage}
                                renderCardsAction={(items) => (
                                    <CompetitionCards paginatedData={items} />
                                )}
                            />
                            <Button
                                isIconOnly
                                onPress={onOpen}
                                className="fixed right-5 bottom-5 z-10"
                                aria-label="Создать"
                                size="lg"
                            >
                                <Icon icon="iconoir:plus" width={50} height={50} />
                            </Button>
                            <ModalOrDrawer
                                label="Создание"
                                isOpen={isOpen}
                                onOpenChangeAction={onOpenChange}
                            >
                                <CompetitionCreateForm />
                            </ModalOrDrawer>
                        </>
                    )}

                    {activeTab === 'events' && (
                        <MainCards<EventItem>
                            isLoading={isEventLoading}
                            pageItems={eventsData?.items ?? []}
                            totalPages={eventsData?.pagination.totalPages ?? 1}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => (
                                <EventCards paginatedData={items} />
                            )}
                        />
                    )}

                    {activeTab === 'team' && (
                        <MainCards<TeamItem>
                            isLoading={isTeamLoading}
                            pageItems={teamData?.items ?? []}
                            totalPages={teamData?.pagination.totalPages ?? 1}
                            page={page}
                            setPageAction={setPage}
                            renderCardsAction={(items) => (
                                <TeamCards paginatedData={items} />
                            )}
                        />
                    )}

                    {activeTab === 'achievement' && (
                        <>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Card title="Заявки по статусу">
                                        <PieChart data={repRequestsByStatus} />
                                    </Card>
                                    <Card title="Формат мероприятий">
                                        <BarChart data={repEventsByFormat} />
                                    </Card>
                                    <Card title="Мероприятия по месяцам">
                                        <LineChart data={repEventsByMonth} />
                                    </Card>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        Рейтинги региона
                                    </h3>
                                    <StatTabs
                                        tabs={[
                                            { id: 'athletes', label: 'Спортсмены' },
                                            { id: 'coaches', label: 'Тренеры' },
                                        ]}
                                        onSelect={(tab) =>
                                            setRatingTab(tab as 'athletes' | 'coaches')
                                        }
                                    />
                                    <TableContainer
                                        columns={ratingColumns}
                                        data={
                                            (ratingTab === 'athletes'
                                                    ? repAthleteRanking
                                                    : repCoachRanking
                                            ).map((row, idx) => ({
                                                rank: idx + 1,
                                                ...row,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <FooterElement />
        </>
    );
}
