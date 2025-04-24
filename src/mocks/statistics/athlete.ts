// src/mocks/statistics/athlete.ts
import type { PieData, DataPoint, TableRow } from '@/app/common/_components/statistics/types';

// Обзор: позиция и баллы
export const athleteOverview = {
    rank: 42,
    points: 1234,
};

// Круговая диаграмма: индивидуально vs командно
export const athleteParticipation: PieData[] = [
    { label: 'Индивидуально', value: 12, color: '#8884d8' },
    { label: 'Командно', value: 7, color: '#82ca9d' },
];

// График: накопленные баллы со времён
export const athletePointsOverTime: DataPoint[] = [
    { label: '2023-01', value: 100 },
    { label: '2023-06', value: 300 },
    { label: '2024-01', value: 600 },
    { label: '2024-10', value: 900 },
    { label: '2025-04', value: 1234 },
];

// Достижения (плитки)
export const athleteAchievements: TableRow[] = [
    { title: 'Медаль за 1 место', count: 3 },
    { title: 'Кубок чемпионата', count: 1 },
    { title: 'Диплом участника', count: 5 },
];

// История участий (таблица)
export const athleteParticipationHistory: TableRow[] = [
    {
        competition: 'Чемпионат 2024',
        period: '01.03.2024–05.03.2024',
        place: '2',
        points: 200,
    },
    {
        competition: 'Кубок 2023',
        period: '12.11.2023–14.11.2023',
        place: '1',
        points: 300,
    },
];
