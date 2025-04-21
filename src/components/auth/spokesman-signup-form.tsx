"use client";

import { z } from "zod";

import type React from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import PasswordInput from "@/components/password-input";
import { Button, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const baseSchema = z.object({
    fullName: z
        .string()
        .min(1, "ФИО обязательно")
        .min(3, "ФИО должно содержать минимум 3 символа")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "ФИО должно содержать только кириллические буквы"),
    region: z
        .string()
        .min(1, "Регион обязателен")
        .min(3, "Регион обязателен")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "Регион должно содержать только кириллические буквы"),
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

export default function SpokesmanSignupForm({ className }: React.ComponentProps<"form">) {
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
                    label="ФИО"
                    type="text"
                    variant="bordered"
                    {...register("fullName")}
                    isInvalid={!!errors.fullName}
                    errorMessage={errors.fullName?.message}
                />
                <Input
                    label="Регион"
                    type="text"
                    variant="bordered"
                    {...register("region")}
                    isInvalid={!!errors.region}
                    errorMessage={errors.region?.message}
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
