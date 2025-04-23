import { z } from "zod";

// Сначала создаем базовую схему без зависимых проверок
const baseSchema = z.object({
    name: z.string().min(1, "Название обязательно").min(3, "Название должно содержать минимум 3 символа"),
    description: z.string().min(1, "Описание обязательно").min(3, "Описание должно содержать минимум 3 символа"),
    startRegistration: z.string().datetime("Некорректная дата начала регистрации"),
    endRegistration: z.string().datetime("Некорректная дата окончания регистрации"),
    start: z.string().datetime("Некорректная дата начала"),
    end: z.string().datetime("Некорректная дата окончания"),
    minAge: z.coerce.number().min(14, "Минимальный возраст - 14 лет"),
    maxAge: z.coerce.number().max(60, "Максимальный возраст - 60 лет"),
    minTeamParticipantsCount: z.coerce.number().min(1, "Минимум 1 участник"),
    maxTeamParticipantsCount: z.coerce.number().max(10, "Максимум 10 участников"),
    maxParticipantsCount: z.coerce.number().min(1, "Укажите максимальное количество команд участников"),
    isOnline: z.boolean(),
    address: z.string().min(1, "Адрес обязателен").min(3, "Адрес должен содержать минимум 3 символа"),
    level: z.string().min(1, "Выберите уровень соревнования"),
    discipline: z.string().min(1, "Укажите дисциплину"),
    regions: z.array(z.string()).min(1, "Выберите хотя бы один регион"),
});

// Затем добавляем зависимые проверки на уровне всей схемы
export const competitionRequestSchema = baseSchema
    .refine((data) => data.maxAge >= data.minAge, {
        message: "Максимальный возраст должен быть больше минимального",
        path: ["maxAge"],
    })
    .refine((data) => data.maxTeamParticipantsCount >= data.minTeamParticipantsCount, {
        message: "Максимальное количество участников должно быть больше минимального",
        path: ["maxTeamParticipantsCount"],
    })
    .refine((data) => new Date(data.startRegistration) < new Date(data.endRegistration), {
        message: "Дата окончания регистрации должна быть позже даты начала",
        path: ["endRegistration"],
    })
    .refine((data) => new Date(data.start) < new Date(data.end), {
        message: "Дата окончания соревнования должна быть позже даты начала",
        path: ["end"],
    })
    .refine((data) => new Date(data.endRegistration) <= new Date(data.start), {
        message: "Регистрация должна заканчиваться до начала соревнования",
        path: ["endRegistration"],
    });
//isPersonalFormatAllowed: z.boolean(),

//awards: z.array(z.number()).min(1, "Укажите хотя бы одну награду"),
