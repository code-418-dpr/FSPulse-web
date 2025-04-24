"use client";

import { z } from "zod";

import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { AgeGroup, EventLevel, RequestStatus } from "@/app/generated/prisma";
import { MultiSelectAgeGroups, MultiSelectAutocomplete } from "@/components/multiselect-autocomplete";
import { getAgeGroupsByDiscipline } from "@/data/age-group";
import { getDisciplines } from "@/data/discipline";
import { CompetitionRequestData, createCompetitionRequest } from "@/data/event";
import { FileData } from "@/data/event";
import { getRegions } from "@/data/region";
import { getRepresentativeByUserId, getRepresentativesByRegionId } from "@/data/representative";
import { useAuth } from "@/hooks/use-auth";
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
    const [preview, setPreview] = useState<string | null>(null);
    const [disciplines, setDisciplines] = React.useState<{ id: string; name: string }[]>([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState<string>();
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [discipline, setDiscipline] = useState<string>();
    const [level, setLevel] = useState<EventLevel | undefined>();
    const [isOnline, setIsOnline] = useState(false);
    const [startRegistration, setStartRegistration] = useState<string>("");
    const [endRegistration, setEndRegistration] = useState<string>("");
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const [cover, setCover] = useState<File | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [minTeamParticipantsCount, setMinTeamParticipantsCount] = useState<number>(0);
    const [maxTeamParticipantsCount, setMaxTeamParticipantsCount] = useState<number>(0);
    const [maxParticipantsCount, setMaxParticipantsCount] = useState<number>(0);
    // eslint-disable-next-line
    const [regionsSelected, setRegionsSelected] = useState<string[]>([]);
    const [address, setAddress] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const methods = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            regions: [],
        },
    });

    const {
        control,
        formState: { errors },
    } = methods;

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const base64ToUint8Array = (base64: string): Uint8Array => {
        const binaryString = atob(base64.split(",")[1]);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };
    useEffect(() => {
        const loadAgeGroups = async () => {
            if (selectedDiscipline) {
                const data = await getAgeGroupsByDiscipline(selectedDiscipline);
                setAgeGroups(data.map((d) => d.ageGroup));
            }
        };
        void loadAgeGroups();
    }, [selectedDiscipline]);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            setFormError(null);
            const formValues = methods.getValues();
            // Валидация дат
            const startRegDate = new Date(startRegistration);
            const endRegDate = new Date(endRegistration);
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startRegDate >= endRegDate) throw new Error("Дата окончания регистрации должна быть позже даты начала");
            if (startDate >= endDate) throw new Error("Дата окончания соревнования должна быть позже даты начала");
            if (endRegDate > startDate) throw new Error("Регистрация должна заканчиваться до начала соревнования");
            if (formValues.minAge >= formValues.maxAge) {
                throw new Error("Максимальный возраст должен быть больше минимального");
            }
            if (minTeamParticipantsCount >= maxTeamParticipantsCount) {
                throw new Error("Максимальное количество участников должно быть больше минимального");
            }
            if (!discipline) throw new Error("Выберите дисциплину");
            if (!level) throw new Error("Выберите уровень соревнования");
            if (!cover) throw new Error("Необходимо загрузить обложку");

            const coverBase64 = await convertFileToBase64(cover);
            const coverUint8 = base64ToUint8Array(coverBase64);

            let filesData: FileData[] = [];
            if (files) {
                filesData = await Promise.all(
                    Array.from(files).map(async (file) => ({
                        name: file.name,
                        content: base64ToUint8Array(await convertFileToBase64(file)),
                        type: file.type,
                    })),
                );
            }

            // Получение всех представителей из выбранных регионов
            const representativeIds: string[] = [];

            for (const region of regionsSelected) {
                const reps = await getRepresentativesByRegionId(region);
                reps.forEach((rep) => {
                    representativeIds.push(rep.id);
                });
            }
            if (user?.id && user.role === "representative") {
                const rep = await getRepresentativeByUserId(user.id);
                rep.forEach((rep) => {
                    representativeIds.push(rep.id);
                });
            }

            const requestData: CompetitionRequestData = {
                name,
                discipline,
                level,
                isOnline,
                startRegistration: startRegDate,
                endRegistration: endRegDate,
                start: startDate,
                end: endDate,
                requestStatus: user?.role === "admin" ? RequestStatus.APPROVED : RequestStatus.PENDING,
                minAge: formValues.minAge,
                maxAge: formValues.maxAge,
                minTeamParticipantsCount,
                maxTeamParticipantsCount,
                maxParticipantsCount,
                representatives: representativeIds,
                address,
                description,
                cover: coverUint8,
                files: filesData,
            };

            await createCompetitionRequest(requestData);

            setFormError("Заявка успешно создана!");
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
                console.error("Ошибка:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };
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

    return (
        <FormProvider {...methods}>
            <form className={cn("grid items-start gap-4", className)}>
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
                                onSelectionChange={(key) => {
                                    setDiscipline(key as string);
                                    setSelectedDiscipline(key as string);
                                }}
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
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
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
                                onSelectionChange={(key) => {
                                    setLevel(key as EventLevel);
                                }}
                                isInvalid={!!errors.level}
                                errorMessage={errors.level?.message}
                                allowsCustomValue={false}
                            >
                                {(level) => <AutocompleteItem key={level.key}>{level.name}</AutocompleteItem>}
                            </Autocomplete>
                        )}
                    />
                    <div className="mb-4 flex justify-between">
                        <label>Формат соревнований:</label>
                        <Switch isSelected={isOnline} onValueChange={setIsOnline}>
                            Онлайн
                        </Switch>
                    </div>
                    <div className="mb-4">
                        <DateRangePicker
                            className="w-full"
                            label="Даты регистрации"
                            aria-label="Выберите даты регистрации"
                            onChange={(range) => {
                                if (!range) return;
                                const timeZone = getLocalTimeZone();
                                setStartRegistration(range.start.toDate(timeZone).toISOString());
                                setEndRegistration(range.end.toDate(timeZone).toISOString());
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <DateRangePicker
                            className="w-full"
                            label="Даты проведения"
                            aria-label="Выберите даты проведения"
                            onChange={(range) => {
                                if (!range) return;
                                const timeZone = getLocalTimeZone();
                                setStart(range.start.toDate(timeZone).toISOString());
                                setEnd(range.end.toDate(timeZone).toISOString());
                            }}
                        />
                    </div>
                    <div className="space-y-4">
                        <Input
                            label="Обложка"
                            type="file"
                            variant="bordered"
                            accept="image/*"
                            aria-label="Загрузить обложку соревнования"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setCover(file);
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setPreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />

                        {preview && (
                            <div className="mt-4">
                                <p className="mb-2">Предпросмотр:</p>
                                <Image src={preview} alt="Превью обложки" className="max-w-xs rounded-md border" />
                            </div>
                        )}
                    </div>
                    {selectedDiscipline && (
                        <>
                            <MultiSelectAgeGroups ageGroups={ageGroups} />
                            <Controller
                                name="minAge"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="Минимальный возраст участника"
                                        type="number"
                                        variant="bordered"
                                        {...field}
                                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                        value={field.value?.toString() || ""} // Добавляем проверку на undefined
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            field.onChange(value);
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="maxAge"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="Максимальный возраст участника"
                                        type="number"
                                        variant="bordered"
                                        {...field}
                                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                        value={field.value?.toString() || ""} // Добавляем проверку на undefined
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            field.onChange(value);
                                        }}
                                    />
                                )}
                            />
                        </>
                    )}
                    <Input
                        label="Минимальное количество участников команды"
                        aria-label="Минимальное количество участников команды"
                        type="number"
                        variant="bordered"
                        value={minTeamParticipantsCount.toString()}
                        onChange={(e) => {
                            setMinTeamParticipantsCount(Number(e.target.value));
                        }}
                    />

                    <Input
                        label="Максимальное количество участников команды"
                        aria-label="Максимальное количество участников команды"
                        type="number"
                        variant="bordered"
                        value={maxTeamParticipantsCount.toString()}
                        onChange={(e) => {
                            setMaxTeamParticipantsCount(Number(e.target.value));
                        }}
                    />

                    <Input
                        label="Максимальное количество команд"
                        aria-label="Максимальное количество команд"
                        type="number"
                        variant="bordered"
                        value={maxParticipantsCount.toString()}
                        onChange={(e) => {
                            setMaxParticipantsCount(Number(e.target.value));
                        }}
                    />
                    <MultiSelectAutocomplete regions={regions.map((r) => ({ key: r.id, label: r.name }))} />
                    <Input
                        label="Адрес"
                        type="text"
                        aria-label="Адрес"
                        variant="bordered"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                    />

                    <Textarea
                        label="Описание соревнования"
                        aria-label="Описание соревнования"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                    <Input
                        label="Прочие файлы соревнования"
                        type="file"
                        variant="bordered"
                        multiple
                        onChange={(e) => {
                            setFiles(e.target.files);
                        }}
                    />

                    {formError && (
                        <div
                            className={`text-center text-sm ${
                                formError.includes("успешно") ? "text-success" : "text-danger-500"
                            }`}
                        >
                            {formError}
                        </div>
                    )}
                    <Button
                        color="success"
                        isLoading={isLoading}
                        fullWidth
                        className="mt-6"
                        onPress={() => void handleConfirm()}
                    >
                        Зарегистрировать соревнование
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
