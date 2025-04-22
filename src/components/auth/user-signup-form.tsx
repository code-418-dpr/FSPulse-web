"use client";

import { z } from "zod";

import type React from "react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { SportsCategory } from "@/app/generated/prisma";
import PasswordInput from "@/components/password-input";
import { registerUser } from "@/data/auth";
import { getRegions } from "@/data/region";
import { RegionOption } from "@/types/region";
import { Autocomplete, AutocompleteItem, Button, DatePicker, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";

const sportsCategoryOptions = Object.values(SportsCategory).map((key) => ({
    key,
    label: getCategoryLabel(key),
}));
function getCategoryLabel(key: SportsCategory): string {
    const map: Record<SportsCategory, string> = {
        HMS: "Заслуженный мастер спорта",
        MS: "Мастер спорта",
        CMS: "Кандидат в мастера спорта",
        A: "1 разряд",
        B: "2 разряд",
        C: "3 разряд",
        Ay: "1 юношеский разряд",
        By: "2 юношеский разряд",
        Cy: "3 юношеский разряд",
    };
    return map[key];
}

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
            .min(1, "Регион обязателен"),
        sportCategory: z.nativeEnum(SportsCategory, {
            errorMap: () => ({ message: "Выберите спортивный разряд из списка" }),
        }),
        email: z.string().min(1, "Email обязателен").email("Некорректный email"),
        phoneNumber: z
            .string()
            .min(1, "Телефон обязателен")
            .regex(/^7\d{10}$/, "Введите корректный российский номер (7XXXXXXXXXX)"),
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

type UserFormData = z.infer<typeof userSchema>;
export default function UserSignupForm({ className }: React.ComponentProps<"form">) {
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
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: SubmitHandler<UserFormData> = async (data) => {
        try {
            setIsLoading(true);
            setFormError(null);

            const athlete = await registerUser({
                ...data,
                role: "athlete",
                birthDate: new Date(data.birthDate),
                regionId: data.region,
                sportCategoryId: data.sportCategory,
            });

            const signInResult = await signIn("credentials", {
                email: athlete?.email,
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
                if (error.message.includes("email") || error.message.includes("phoneNumber")) {
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
                    label="ФИО"
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
                            defaultItems={regions.map((r) => ({ key: r.id, label: r.name }))}
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
                            defaultItems={sportsCategoryOptions}
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
                <Input
                    label="Номер телефона"
                    type="tel"
                    variant="bordered"
                    {...register("phoneNumber")}
                    isInvalid={!!errors.phoneNumber}
                    errorMessage={errors.phoneNumber?.message}
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
