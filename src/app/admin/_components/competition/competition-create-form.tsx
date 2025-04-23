"use client";

import { z } from "zod";

import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { EventLevel } from "@/app/generated/prisma";
import { MultiSelectAutocomplete } from "@/components/multiselect-autocomplete";
import { getDisciplines } from "@/data/discipline";
import { getRegions } from "@/data/region";
import { competitionRequestSchema } from "@/schemas/competition-request-schema";
import { RegionOption } from "@/types/region";
import { Textarea } from "@heroui/input";
import { Autocomplete, AutocompleteItem, Button, DateRangePicker, Image, Input, Switch, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone } from "@internationalized/date";

const userSchema = competitionRequestSchema;

type UserFormData = z.infer<typeof userSchema>;
export default function CompetitionCreateForm({ className }: React.ComponentProps<"form">) {
    const [isLoading, setIsLoading] = useState(false);
    const [regions, setRegions] = useState<RegionOption[]>([]);
    const [levels] = React.useState(Object.values(EventLevel));
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
        new Set(
            regions.map((r) => {
                return r.name;
            }),
        ),
    );
    const [disciplines, setDisciplines] = React.useState<{ id: string; name: string }[]>([]);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const regions = (await getRegions()) as RegionOption[];
                setRegions(regions);

                const disciplines = await getDisciplines();
                setDisciplines(disciplines);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            }
        };

        void fetchData();
    }, []);

    const getLevelName = (level: EventLevel) => {
        const names: Record<EventLevel, string> = {
            [EventLevel.OPEN]: "Открытый",
            [EventLevel.REGIONAL]: "Региональный",
            [EventLevel.FEDERAL]: "Федеральный",
        };
        return names[level];
    };

    const handleFileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Проверка типа файла
        if (!file.type.startsWith("image/")) {
            alert("Пожалуйста, выберите файл изображения");
            return;
        }

        // Создание превью
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit: SubmitHandler<UserFormData> = async (data) => {
        try {
            setIsLoading(true);
            setFormError(null);

            // Валидация дат
            const now = new Date();
            const startReg = new Date(data.startRegistration);
            const endReg = new Date(data.endRegistration);
            const start = new Date(data.start);
            const end = new Date(data.end);

            if (startReg >= endReg) {
                throw new Error("Дата окончания регистрации должна быть позже даты начала");
            }

            if (start >= end) {
                throw new Error("Дата окончания соревнования должна быть позже даты начала");
            }

            if (endReg > start) {
                throw new Error("Регистрация должна заканчиваться до начала соревнования");
            }

            // Валидация возраста
            if (data.minAge >= data.maxAge) {
                throw new Error("Максимальный возраст должен быть больше минимального");
            }

            // Валидация количества участников
            if (data.minTeamParticipantsCount >= data.maxTeamParticipantsCount) {
                throw new Error("Максимальное количество участников должно быть больше минимального");
            }

            // Подготовка данных для вывода
            const formData = {
                ...data,
                startRegistration: startReg.toISOString(),
                endRegistration: endReg.toISOString(),
                start: start.toISOString(),
                end: end.toISOString(),
                regions: Array.from(selectedKeys), // Преобразуем Set в массив
                createdAt: now.toISOString(),
            };

            console.log("Отправляемые данные:", formData);

            // Здесь будет реальный запрос к API
            await new Promise((resolve) => setTimeout(resolve, 1000));

            router.push("/");
            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
                console.error("Ошибка валидации:", error.message);
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
                    name="discipline"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            aria-label="Дисциплина"
                            label="Дисциплина"
                            defaultItems={disciplines.map((d) => ({ key: d.id, name: d.name }))}
                            selectedKey={field.value}
                            onSelectionChange={field.onChange}
                            isInvalid={!!errors.discipline}
                            errorMessage={errors.discipline?.message}
                            allowsCustomValue={false}
                        >
                            {(level) => <AutocompleteItem key={level.key}>{level.name}</AutocompleteItem>}
                        </Autocomplete>
                    )}
                />
                <Input
                    label="Название"
                    aria-label="Название"
                    type="text"
                    variant="bordered"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                />
                <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            aria-label="Уровень соревнований"
                            label="Уровень соревнований"
                            defaultItems={levels.map((l) => ({ key: l, name: getLevelName(l) }))}
                            selectedKey={field.value}
                            onSelectionChange={field.onChange}
                            isInvalid={!!errors.level}
                            errorMessage={errors.level?.message}
                            allowsCustomValue={false}
                        >
                            {(level) => <AutocompleteItem key={level.key}>{level.name}</AutocompleteItem>}
                        </Autocomplete>
                    )}
                />
                <div className="mb-4">
                    <label>Формат соревнований:</label>
                    <Controller
                        name="isOnline"
                        control={control}
                        render={({ field }) => (
                            <Switch aria-label="Онлайн режим" isSelected={field.value} onValueChange={field.onChange}>
                                Онлайн
                            </Switch>
                        )}
                    />
                </div>
                <div className="mb-4">
                    <Controller
                        name="startRegistration"
                        control={control}
                        render={({ field, fieldState }) => (
                            <DateRangePicker
                                className="w-full"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                label="Даты регистрации"
                                aria-label="Выберите даты регистрации"
                                onChange={(range) => {
                                    if (!range) return;

                                    const timeZone = getLocalTimeZone();
                                    const start = range.start.toDate(timeZone).toISOString();
                                    const end = range.end.toDate(timeZone).toISOString();

                                    // Устанавливаем значения для обоих полей
                                    setValue("startRegistration", start);
                                    setValue("endRegistration", end);

                                    // Если нужно сохранить в field.value (опционально)
                                    field.onChange(start);
                                }}
                            />
                        )}
                    />
                </div>
                <div className="mb-4">
                    <Controller
                        name="start"
                        control={control}
                        render={({ field, fieldState }) => (
                            <DateRangePicker
                                className="w-full"
                                label="Даты проведения"
                                aria-label="Выберите даты проведения"
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                onChange={(range) => {
                                    if (!range) return;

                                    const timeZone = getLocalTimeZone();
                                    const start = range.start.toDate(timeZone).toISOString();
                                    const end = range.end.toDate(timeZone).toISOString();

                                    // Устанавливаем значения для обоих полей
                                    setValue("start", start);
                                    setValue("end", end);

                                    // Если нужно сохранить в field.value (опционально)
                                    field.onChange(start);
                                }}
                            />
                        )}
                    />
                </div>
                <div className="space-y-4">
                    <Input
                        label="Обложка"
                        type="file"
                        variant="bordered"
                        accept="image/*"
                        aria-label="Загрузить обложку соревнования"
                        onChange={handleFileImageChange}
                    />

                    {preview && (
                        <div className="mt-4">
                            <p className="mb-2">Предпросмотр:</p>
                            <Image src={preview} alt="Превью обложки" className="max-w-xs rounded-md border" />
                        </div>
                    )}
                </div>
                <Input
                    label="Минимальный возраст участника"
                    aria-label="Минимальный возраст участника"
                    type="number"
                    variant="bordered"
                    {...register("minAge")}
                    isInvalid={!!errors.minAge}
                    errorMessage={errors.minAge?.message}
                />
                <Input
                    label="Максимальный возраст участника"
                    aria-label="Максимальный возраст участника"
                    type="number"
                    variant="bordered"
                    {...register("maxAge")}
                    isInvalid={!!errors.maxAge}
                    errorMessage={errors.maxAge?.message}
                />
                <Input
                    label="Минимальное количество участников команды"
                    aria-label="Минимальное количество участников команды"
                    type="number"
                    variant="bordered"
                    {...register("minTeamParticipantsCount")}
                    isInvalid={!!errors.minTeamParticipantsCount}
                    errorMessage={errors.minTeamParticipantsCount?.message}
                />
                <Input
                    label="Максимальное количество участников команды"
                    aria-label="Максимальное количество участников команды"
                    type="number"
                    variant="bordered"
                    {...register("maxTeamParticipantsCount")}
                    isInvalid={!!errors.maxTeamParticipantsCount}
                    errorMessage={errors.maxTeamParticipantsCount?.message}
                />
                <Input
                    label="Максимальное количество команд"
                    aria-label="Максимальное количество команд"
                    type="number"
                    variant="bordered"
                    {...register("maxParticipantsCount")}
                    isInvalid={!!errors.maxParticipantsCount}
                    errorMessage={errors.maxParticipantsCount?.message}
                />
                <Controller
                    name="regions"
                    control={control}
                    render={({ field }) => {
                        return (
                            <MultiSelectAutocomplete
                                items={regions.map((r) => ({ key: r.id, label: r.name }))}
                                label="Регионы проведения соревнования"
                                selectedKeys={new Set(field.value)}
                                aria-label="Регионы"
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys);
                                    field.onChange(selected);
                                    setSelectedKeys(keys);
                                }}
                            />
                        );
                    }}
                />
                <Input
                    label="Адрес"
                    type="text"
                    aria-label="Адрес"
                    variant="bordered"
                    {...register("address")}
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message}
                />
                <Textarea
                    label="Описание соревнования"
                    aria-label="Описание соревнования"
                    {...register("description")}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                />
                <Input label="Прочие файлы соревнования" type="file" variant="bordered" multiple={true} />

                {formError && <div className="text-danger-500 text-center text-sm">{formError}</div>}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Зарегистрировать соревнование
                </Button>
            </div>
        </form>
    );
}
