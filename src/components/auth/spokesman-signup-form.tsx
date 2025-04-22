"use client";

import { z } from "zod";

import type React from "react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import PasswordInput from "@/components/password-input";
import { getRegions } from "@/data/region";
import { registerRepresentative } from "@/data/representative";
import { RegionOption } from "@/types/region";
import { Autocomplete, AutocompleteItem, Button, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

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
        region: z
            .string({
                required_error: "Выберите регион",
            })
            .min(1, "Регион обязателен"),
        phone: z
            .string()
            .min(1, "Телефон обязателен")
            .regex(/^7\d{10}$/, "Введите корректный российский номер (7XXXXXXXXXX)"),
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

export default function SpokesmanSignupForm({ className }: React.ComponentProps<"form">) {
    const [isLoading, setIsLoading] = useState(false);
    const [regions, setRegions] = useState<RegionOption[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();

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

            const result = await registerRepresentative({
                ...data,
                regionId: data.region,
            });

            const signInResult = await signIn("credentials", {
                email: result.email,
                password: data.password,
                redirect: false,
            });

            if (signInResult?.error) {
                throw new Error(signInResult.error);
            }

            router.push("/");
            router.refresh();
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
                    {...register("phone")}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
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
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Регистрация
                </Button>
            </div>
        </form>
    );
}
