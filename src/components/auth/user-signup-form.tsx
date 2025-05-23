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
import { getCategoryLabel } from "@/data/get-category-label";
import { getRegions } from "@/data/region";
import { baseUserSchema } from "@/schemas/base-user-schema";
import { RegionOption } from "@/types/region";
import { Autocomplete, AutocompleteItem, Button, DatePicker, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";

const sportsCategoryOptions = Object.values(SportsCategory).map((key) => ({
    key,
    label: getCategoryLabel(key),
}));

const userSchema = baseUserSchema
    .extend({
        password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
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
                sportCategory: data.sportCategory ?? undefined,
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
