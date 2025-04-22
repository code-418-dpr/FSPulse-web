import { EventStatus } from "@/app/generated/prisma/client";

interface RawEvent {
    name: string;
    description: string;
    coverPath: string; // путь к файлу-обложке
    applicationTime: string; // ISO‑строка
    start: string; // ISO‑строка
    end: string; // ISO‑строка
    disciplineName: string; // для связи через name
    isOnline: boolean;
    address?: string;
    awards: number[]; // массив наград
    isFederal: boolean;
    isOpen: boolean;
    status?: EventStatus;
}

const events: RawEvent[] = [
    {
        name: "Весенний хакатон 2025",
        description: "48‑часный марафон по командной разработке",
        coverPath: "./covers/hackathon.png",
        applicationTime: "2025-05-01T00:00:00.000Z",
        start: "2025-05-10T09:00:00.000Z",
        end: "2025-05-12T21:00:00.000Z",
        disciplineName: "Программирование продуктовое",
        isOnline: false,
        address: "г. Москва, ул. Программирования, д.1",
        awards: [1, 2, 3],
        isFederal: false,
        isOpen: true,
        status: "PENDING",
    },
    // … ещё события
];

export default events;
