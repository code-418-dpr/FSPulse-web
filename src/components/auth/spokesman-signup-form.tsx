"use client";

import { z } from "zod";

import type React from "react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import PasswordInput from "@/components/password-input";
import { registerUser } from "@/data/auth";
import { getRegions } from "@/data/region";
import { baseSpokesmanSchema } from "@/schemas/base-spokesman-schema";
import { RegionOption } from "@/types/region";
import { Autocomplete, AutocompleteItem, Button, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = baseSpokesmanSchema
    .extend({
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

export default function SpokesmanSignupForm({ className }: React.ComponentProps<"form">) {
    const [isLoading, setIsLoading] = useState(false);
    const [regions, setRegions] = useState<RegionOption[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [formCongrats, setFormCongrats] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const data = (await getRegions()) as RegionOption[];
                setRegions(data);
            } catch (err) {
                console.error("Ошибка загрузки регионов:", err);
            }
        };

        void fetchRegions();
    }, []);

    const {
        control,
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = async (data) => {
        try {
            setIsLoading(true);
            setFormError(null);

            await registerUser({
                ...data,
                role: "representative",
                regionId: data.region,
            });

            setFormCongrats("Заявка на регистрацию успешно направлена. Попробуйте войти позднее.");
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("email") || error.message.includes("phone")) {
                    setError("root", { message: error.message });
                    setFormError(error.message);
                } else {
                    setFormError(error.message);
                }
            }
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
                            {(region) => <AutocompleteItem key={region.id}>{region.name}</AutocompleteItem>}
                        </Autocomplete>
                    )}
                />
                <Input
                    label="Телефон"
                    type="number"
                    variant="bordered"
                    inputMode="tel"
                    {...register("phoneNumber")}
                    isInvalid={!!errors.phoneNumber}
                    errorMessage={errors.phoneNumber?.message}
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
                {formError && <div className="text-danger-500 text-center text-sm">{formError}</div>}
                {formCongrats && <div className="text-success-500 text-center text-sm">{formCongrats}</div>}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Регистрация
                </Button>
            </div>
        </form>
    );
}
