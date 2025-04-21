"use client";

import { z } from "zod";

import type React from "react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import PasswordInput from "@/components/password-input";
import { Autocomplete, AutocompleteItem, Button, DatePicker, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";

const userSchema = z
    .object({
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
            .min(1, "Регион обязателен")
            .refine((val) => regions.some((r) => r.key === val), {
                message: "Выберите регион из списка",
            }),
        sportCategory: z
            .string({
                required_error: "Выберите спортивный разряд",
            })
            .min(1, "Спортивный разряд обязателен")
            .refine((val) => categories.some((r) => r.key === val), {
                message: "Выберите спортивный разряд из списка",
            }),
        email: z.string().min(1, "Email обязателен").email("Некорректный email"),
        password: z
            .string()
            .min(6, "Пароль должен содержать минимум 6 символов")
            .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
            .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
        passwordRepeat: z.string(),
    })
    .refine((data) => data.password === data.passwordRepeat, {
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
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = async (data) => {
        setIsLoading(true);
        try {
            console.log("Form data:", data);
            await new Promise((resolve) => setTimeout(resolve, 100)); // Имитация загрузки
        } catch (error) {
            console.error("Error:", error);
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
                <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="Дата рождения"
                            showMonthAndYearPickers
                            maxValue={today(getLocalTimeZone()).subtract({ years: 14 })}
                            minValue={today(getLocalTimeZone()).subtract({ years: 60 })}
                            onChange={(date) => {
                                field.onChange(date?.toString());
                            }}
                            isInvalid={!!errors.birthDate}
                            errorMessage={errors.birthDate?.message}
                        />
                    )}
                />
                <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            label="Регион"
                            defaultItems={regions}
                            selectedKey={field.value}
                            onSelectionChange={field.onChange}
                            isInvalid={!!errors.region}
                            errorMessage={errors.region?.message}
                            allowsCustomValue={false}
                        >
                            {(region) => <AutocompleteItem key={region.key}>{region.label}</AutocompleteItem>}
                        </Autocomplete>
                    )}
                />
                <Input
                    label="Адрес"
                    type="text"
                    variant="bordered"
                    {...register("address")}
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message}
                />
                <Controller
                    name="sportCategory"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            label="Спортивный разряд"
                            defaultItems={categories}
                            selectedKey={field.value}
                            onSelectionChange={field.onChange}
                            isInvalid={!!errors.sportCategory}
                            errorMessage={errors.sportCategory?.message}
                            allowsCustomValue={false}
                        >
                            {(category) => <AutocompleteItem key={category.key}>{category.label}</AutocompleteItem>}
                        </Autocomplete>
                    )}
                />
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
