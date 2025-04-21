"use client";

import { z } from "zod";

import type React from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import PasswordInput from "@/components/password-input";
import { Autocomplete, AutocompleteItem, Button, DatePicker, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const baseSchema = z.object({
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
    birthDate: z.date(),
    address: z
        .string()
        .min(1, "Адрес обязателен")
        .min(3, "Адрес должен содержать минимум 3 символа")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "Адрес должен содержать только кириллические буквы"),
    region: z
        .string()
        .min(1, "Регион обязателен")
        .min(3, "Регион должен содержать минимум 3 символа")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "Регион должен содержать только кириллические буквы"),
    sportCategory: z.string(),
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    password: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    passwordRepeat: z.string(),
});

const userSchema = baseSchema.refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
});

const regions = [
    { key: "DPR", label: "Донецкая Народная Республика" },
    { key: "LPR", label: "Луганская Народная Республика" },
    { key: "Moscow", label: "Москва" },
    { key: "Peter", label: "Санкт-Петербург" },
];

const categories = [
    { key: "master", label: "Мастер спорта" },
    { key: "candidateMaster", label: "Кандидат в мастера спорта" },
];

export default function UserSignupForm({ className }: React.ComponentProps<"form">) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = (data) => {
        try {
            setIsLoading(true);
            console.log(data);
            // await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e).catch(console.error);
    };

    return (
        <form className={cn("grid items-start gap-4", className)} onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Фамилия"
                    type="text"
                    variant="bordered"
                    {...register("lastname")}
                    isInvalid={!!errors.lastname}
                    errorMessage={errors.lastname?.message}
                />
                <Input
                    label="Имя"
                    type="text"
                    variant="bordered"
                    {...register("firstname")}
                    isInvalid={!!errors.firstname}
                    errorMessage={errors.firstname?.message}
                />
                <Input
                    label="Отчество"
                    type="text"
                    variant="bordered"
                    {...register("middlename")}
                    isInvalid={!!errors.middlename}
                    errorMessage={errors.middlename?.message}
                />
                <DatePicker
                    isRequired
                    label="Дата рождения"
                    {...register("birthDate")}
                    isInvalid={!!errors.birthDate}
                    errorMessage={errors.birthDate?.message}
                />
                <Autocomplete
                    label="Регион"
                    {...register("region")}
                    isInvalid={!!errors.region}
                    errorMessage={errors.region?.message}
                >
                    {regions.map((region) => (
                        <AutocompleteItem key={region.key}>{region.label}</AutocompleteItem>
                    ))}
                </Autocomplete>
                <Input
                    label="Адрес"
                    type="text"
                    variant="bordered"
                    {...register("middlename")}
                    isInvalid={!!errors.middlename}
                    errorMessage={errors.middlename?.message}
                />
                <Autocomplete
                    label="Спортивный разряд"
                    {...register("sportCategory")}
                    isInvalid={!!errors.sportCategory}
                    errorMessage={errors.sportCategory?.message}
                >
                    {categories.map((category) => (
                        <AutocompleteItem key={category.key}>{category.label}</AutocompleteItem>
                    ))}
                </Autocomplete>
                <Input
                    label="Email"
                    type="email"
                    variant="bordered"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                />
                <PasswordInput
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                />
                <PasswordInput
                    label="Повторите пароль"
                    {...register("passwordRepeat")}
                    isInvalid={!!errors.passwordRepeat}
                    errorMessage={errors.passwordRepeat?.message}
                />
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Регистрация
                </Button>
            </div>
        </form>
    );
}
