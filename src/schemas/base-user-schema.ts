import { z } from "zod";

import { SportsCategory } from "@/app/generated/prisma";

export const baseUserSchema = z.object({
    lastname: z
        .string()
        .min(1, "Фамилия обязательна")
        .min(3, "Фамилия должна содержать минимум 3 символа")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "Фамилия должна содержать только кириллические буквы"),
    firstname: z
        .string()
        .min(1, "Имя обязательно")
        .min(3, "Имя должно содержать минимум 3 символа")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "Имя должно содержать только кириллические буквы"),
    middlename: z.string().nullable(),
    birthDate: z.string().refine((val) => !isNaN(new Date(val).getTime())),
    address: z.string().min(1, "Адрес обязателен").min(3, "Адрес должен содержать минимум 3 символа"),
    region: z
        .string({
            required_error: "Выберите регион",
        })
        .min(1, "Регион обязателен"),
    sportCategory: z
        .nativeEnum(SportsCategory, {
            errorMap: () => ({ message: "Выберите спортивный разряд из списка" }),
        })
        .nullish(),
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    phoneNumber: z
        .string()
        .min(1, "Телефон обязателен")
        .regex(/^7\d{10}$/, "Введите корректный российский номер (7XXXXXXXXXX)"),
});
