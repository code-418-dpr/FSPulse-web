"use client";

import { z } from "zod";

import type React from "react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { SportsCategory } from "@/app/generated/prisma";
import { getCategoryLabel } from "@/data/get-category-label";
import { getRegions } from "@/data/region";
import { alterAthleteById, findAthleteById } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { baseUserSchema } from "@/schemas/base-user-schema";
import { RegionOption } from "@/types/region";
import { Autocomplete, AutocompleteItem, Button, DatePicker, Input, Textarea, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

const sportsCategoryOptions = Object.values(SportsCategory).map((key) => ({
    key,
    label: getCategoryLabel(key),
}));

const userSchema = baseUserSchema.extend({
    about: z.string().nullable(),
    skills: z.array(z.string()),
});

type UserFormData = z.infer<typeof userSchema>;
export default function UserEditForm({ className }: React.ComponentProps<"form">) {
    const { user } = useAuth();
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
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            // Начальные пустые значения
            lastname: "",
            firstname: "",
            middlename: "",
            birthDate: "",
            address: "",
            region: "",
            sportCategory: null,
            email: "",
            phoneNumber: "",
            about: "",
            skills: [],
        },
    });

    useEffect(() => {
        const fetchAthlete = async () => {
            try {
                if (!user?.id) return; // Ранний выход если нет ID

                const data = await findAthleteById(user.id);

                if (!data) {
                    console.error("Данные пользователя не найдены");
                    return;
                }

                const initialValues = {
                    lastname: data.user.lastname,
                    firstname: data.user.firstname,
                    middlename: data.user.middlename ?? "",
                    birthDate: data.birthDate.toISOString().split("T")[0],
                    address: data.address,
                    region: data.user.regionId,
                    sportCategory: data.sportCategory,
                    email: data.user.email,
                    phoneNumber: data.user.phoneNumber,
                    about: data.about ?? "",
                };

                reset(initialValues);
            } catch (err: unknown) {
                // Явно указываем тип unknown
                if (err instanceof Error) {
                    console.error("Ошибка загрузки данных:", err.message);
                } else {
                    console.error("Произошла неизвестная ошибка");
                }
            }
        };

        void fetchAthlete();
    }, [reset, user?.id]);

    const onSubmit: SubmitHandler<UserFormData> = async (data) => {
        try {
            setIsLoading(true);
            setFormError(null);

            // моки чтоб не удалять data и async
            console.log(data);
            await new Promise((resolve) => {
                setTimeout(resolve, 100);
            });

            await alterAthleteById(
                {
                    ...data,
                    regionId: data.region,
                    sportCategory: data.sportCategory ?? undefined,
                },
                user?.id ?? "",
            );

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
                <Controller
                    name="lastname"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Фамилия"
                            type="text"
                            variant="bordered"
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!errors.lastname}
                            errorMessage={errors.lastname?.message}
                        />
                    )}
                />
                <Controller
                    name="firstname"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Имя"
                            type="text"
                            variant="bordered"
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!errors.firstname}
                            errorMessage={errors.firstname?.message}
                        />
                    )}
                />
                <Controller
                    name="middlename"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Отчество"
                            type="text"
                            variant="bordered"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            isInvalid={!!errors.middlename}
                            errorMessage={errors.middlename?.message}
                        />
                    )}
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
                            value={field.value ? parseDate(field.value) : null}
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
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Адрес"
                            type="text"
                            variant="bordered"
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!errors.address}
                            errorMessage={errors.address?.message}
                        />
                    )}
                />
                <Controller
                    name="sportCategory"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            label="Спортивный разряд"
                            defaultItems={sportsCategoryOptions}
                            selectedKey={field.value ?? ""}
                            onSelectionChange={field.onChange}
                            isInvalid={!!errors.sportCategory}
                            errorMessage={errors.sportCategory?.message}
                            allowsCustomValue={false}
                        >
                            {(category) => <AutocompleteItem key={category.key}>{category.label}</AutocompleteItem>}
                        </Autocomplete>
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Email"
                            type="text"
                            variant="bordered"
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!errors.email}
                            errorMessage={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Номер телефона"
                            type="text"
                            variant="bordered"
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!errors.phoneNumber}
                            errorMessage={errors.phoneNumber?.message}
                        />
                    )}
                />
                <Controller
                    name="about"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            label="О себе"
                            type="text"
                            variant="bordered"
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!errors.about}
                            errorMessage={errors.about?.message}
                        />
                    )}
                />
                {formError && <div className="text-danger-500 text-center text-sm">{formError}</div>}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Сохранить изменения
                </Button>
            </div>
        </form>
    );
}
