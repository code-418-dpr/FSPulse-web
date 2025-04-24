// src/mocks/statistics/representative.ts
import type { DataPoint, PieData, TableRow } from '@/app/common/_components/statistics/types';

// Круговая диаграмма: заявки за месяц
export const repRequestsByStatus: PieData[] = [
    { label: 'Подано', value: 50, color: '#8884d8' },
    { label: 'Принято', value: 30, color: '#82ca9d' },
    { label: 'Отклонено', value: 20, color: '#ffc658' },
];

// Столбчатая диаграмма: онлайн / офлайн
export const repEventsByFormat: DataPoint[] = [
    { label: 'Онлайн', value: 14 },
    { label: 'Офлайн', value: 9 },
];

// Рейтинги региональных спортсменов
export const repAthleteRanking: TableRow[] = Array.from({ length: 15 }, (_, i) => ({
    fio: `Спортсмен Р${i + 1}`,
    points: Math.floor(Math.random() * 800),
}));

// Рейтинги региональных тренеров
export const repCoachRanking: TableRow[] = Array.from({ length: 10 }, (_, i) => ({
    fio: `Тренер Р${i + 1}`,
    points: Math.floor(Math.random() * 400),
}));

// График: соревнования этого представительства по месяцам
export const repEventsByMonth: DataPoint[] = [
    { label: 'Янв', value: 2 },
    { label: 'Фев', value: 4 },
    { label: 'Мар', value: 5 },
    { label: 'Апр', value: 3 },
];
