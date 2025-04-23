"use client";

import { z } from "zod";

import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { EventLevel } from "@/app/generated/prisma";
import { MultiSelectAutocomplete } from "@/components/multiselect-autocomplite";
import { getRegions } from "@/data/region";
import { RegionOption } from "@/types/region";
import { Textarea } from "@heroui/input";
import { Autocomplete, AutocompleteItem, Button, DateRangePicker, Image, Input, Switch, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";

/*
name                     String
description              String
cover                    Bytes         @db.ByteA
applicationTime          DateTime      @default(now())
startRegistration        DateTime
endRegistration          DateTime
start                    DateTime
end                      DateTime
minAge                   Int           @db.SmallInt
maxAge                   Int           @db.SmallInt
minTeamParticipantsCount Int           @db.SmallInt
maxTeamParticipantsCount Int           @db.SmallInt
isPersonalFormatAllowed  Boolean
maxParticipantsCount     Int           @db.SmallInt
disciplineId             String
isOnline                 Boolean
address                  String?
awards                   Int[]         @db.SmallInt
level                    EventLevel
requestStatus            RequestStatus @default(PENDING)
requestComment           String?
discipline               Discipline    @relation(fields: [disciplineId], references: [id])
representative           EventOfRepresentative[]
 */

const userSchema = z.object({
    name: z
        .string()
        .min(1, "Фамилия обязательна")
        .min(3, "Фамилия должна содержать минимум 3 символа")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "Фамилия должна содержать только кириллические буквы"),
    description: z
        .string()
        .min(1, "Имя обязательно")
        .min(3, "Имя должно содержать минимум 3 символа")
        .regex(/^[а-яА-ЯёЁ\s]+$/, "Имя должно содержать только кириллические буквы"),
    middlename: z.string().nullable(),
    startRegistration: z.string().refine((val) => !isNaN(new Date(val).getTime())),
    endRegistration: z.string().refine((val) => !isNaN(new Date(val).getTime())),
    start: z.string().refine((val) => !isNaN(new Date(val).getTime())),
    end: z.string().refine((val) => !isNaN(new Date(val).getTime())),
    minAge: z.number().min(14),
    maxAge: z.number().max(60),
    minTeamParticipantsCount: z.number().min(1),
    maxTeamParticipantsCount: z.number().max(10),
    isPersonalFormatAllowed: z.boolean(),
    maxParticipantsCount: z.number(),
    disciplineId: z.string(),
    isOnline: z.boolean(),
    address: z.string().min(1, "Адрес обязателен").min(3, "Адрес должен содержать минимум 3 символа"),
    awards: z.array(z.number()),
    level: z.string(),
    discipline: z.string(),
    regions: z.array(z.string()).min(1, "Выберите хотя бы один регион"),
});

type UserFormData = z.infer<typeof userSchema>;
export default function CompetitionCreateForm({ className }: React.ComponentProps<"form">) {
    const [isLoading, setIsLoading] = useState(false);
    const [regions, setRegions] = useState<RegionOption[]>([]);
    const [levels] = React.useState(Object.values(EventLevel));
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();
    const [setSelectedDateRange] = useState<{
        start?: Date;
        end?: Date;
    }>({
        start: today(getLocalTimeZone()).subtract({ days: 7 }).toDate(getLocalTimeZone()),
        end: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set(["javascript", "typescript"]));

    const handleSelectionChange = (keys: Set<string>) => {
        setSelectedKeys(keys);
    };

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

            console.log(data);
            await new Promise((resolve) => {
                setTimeout(resolve, 100);
            });
            /*
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
             */
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
                    label="Название"
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
                <Switch defaultSelected {...register("isOnline")}>
                    Онлайн
                </Switch>
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Даты регистрации</label>
                    <DateRangePicker
                        className="w-full"
                        defaultValue={{
                            start: today(getLocalTimeZone()).subtract({ days: 7 }),
                            end: today(getLocalTimeZone()),
                        }}
                        onChange={(range) => {
                            const timeZone = getLocalTimeZone();
                            setSelectedDateRange({
                                start: range?.start.toDate(timeZone),
                                end: range?.end.toDate(timeZone),
                            });
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Даты проведения</label>
                    <DateRangePicker
                        className="w-full"
                        defaultValue={{
                            start: today(getLocalTimeZone()).subtract({ days: 7 }),
                            end: today(getLocalTimeZone()),
                        }}
                        onChange={(range) => {
                            const timeZone = getLocalTimeZone();
                            setSelectedDateRange({
                                start: range?.start.toDate(timeZone),
                                end: range?.end.toDate(timeZone),
                            });
                        }}
                    />
                </div>
                <div className="space-y-4">
                    <Input
                        label="Обложка"
                        type="file"
                        variant="bordered"
                        accept="image/*"
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
                    type="number"
                    variant="bordered"
                    {...register("minAge")}
                    isInvalid={!!errors.minAge}
                    errorMessage={errors.minAge?.message}
                />
                <Input
                    label="Максимальный возраст участника"
                    type="number"
                    variant="bordered"
                    {...register("maxAge")}
                    isInvalid={!!errors.maxAge}
                    errorMessage={errors.maxAge?.message}
                />
                <Input
                    label="Минимальное количество участников команды"
                    type="number"
                    variant="bordered"
                    {...register("minTeamParticipantsCount")}
                    isInvalid={!!errors.minTeamParticipantsCount}
                    errorMessage={errors.minTeamParticipantsCount?.message}
                />
                <Input
                    label="Максимальное количество участников команды"
                    type="number"
                    variant="bordered"
                    {...register("maxTeamParticipantsCount")}
                    isInvalid={!!errors.maxTeamParticipantsCount}
                    errorMessage={errors.maxTeamParticipantsCount?.message}
                />
                <Controller
                    name="regions"
                    control={control}
                    render={() => {
                        return (
                            <MultiSelectAutocomplete
                                items={regions.map((r) => ({ key: r.id, label: r.name }))}
                                label="Регионы проведения соревнования"
                                placeholder=""
                                selectedKeys={selectedKeys}
                                onSelectionChange={handleSelectionChange}
                            />
                        );
                    }}
                />
                <Input
                    label="Адрес"
                    type="text"
                    variant="bordered"
                    {...register("address")}
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message}
                />
                <Textarea
                    label="Описание соревнования"
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
