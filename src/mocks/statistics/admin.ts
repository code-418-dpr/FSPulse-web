// src/mocks/statistics/admin.ts
import type { DataPoint, TableRow } from '@/app/common/_components/statistics/types';

// Диаграмма: открытые / региональные / федеральные мероприятия
export const adminEventsByType: DataPoint[] = [
    { label: 'Открытые', value: 24 },
    { label: 'Региональные', value: 12 },
    { label: 'Федеральные', value: 6 },
];

// График: соревнования по неделям (2025-W14 и т.д.)
export const adminEventsByWeek: DataPoint[] = [
    { label: '2025-W14', value: 5 },
    { label: '2025-W15', value: 8 },
    { label: '2025-W16', value: 10 },
    { label: '2025-W17', value: 7 },
];

// Рейтинги спортсменов (таблица)
export const adminAthleteRanking: TableRow[] = Array.from({ length: 20 }, (_, i) => ({
    fio: `Спортсмен ${i + 1}`,
    region: `Регион ${((i % 5) + 1)}`,
    points: Math.floor(Math.random() * 1000),
}));

// Рейтинги тренеров (таблица)
export const adminCoachRanking: TableRow[] = Array.from({ length: 15 }, (_, i) => ({
    fio: `Тренер ${i + 1}`,
    region: `Регион ${((i % 3) + 1)}`,
    points: Math.floor(Math.random() * 500),
}));

// Рейтинг представительств (таблица)
export const adminRepresentativeRanking: TableRow[] = Array.from({ length: 10 }, (_, i) => ({
    region: `Регион ${i + 1}`,
    manager: `Ответственный ${i + 1}`,
    eventsCount: Math.floor(Math.random() * 30),
}));
