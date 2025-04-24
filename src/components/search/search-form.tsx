"use client";

import React, { useEffect, useState } from "react";

import { EventLevel, RequestStatus } from "@/app/generated/prisma";
import { getDisciplines } from "@/data/discipline";
import { Tab } from "@/types";
import { SearchParams } from "@/types/search";
import {
    Button,
    Checkbox,
    DateRangePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Form,
    Input,
} from "@heroui/react";
import { type Selection } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

interface SearchFormProps {
    onSubmitAction: (params: SearchParams) => void;
    tabType: Tab;
}

interface DropdownItem {
    key: string;
    name: string;
}

const SportsCategories: DropdownItem[] = [
    { key: "HMS", name: "Заслуженный мастер спорта" },
    { key: "MS", name: "Мастер спорта" },
    { key: "A", name: "1 разряд" },
    { key: "B", name: "2 разряд" },
    { key: "C", name: "3 разряд" },
    { key: "Ay", name: "1 юношеский разряд" },
    { key: "By", name: "2 юношеский разряд" },
    { key: "Cy", name: "3 юношеский разряд" },
] as DropdownItem[];

const Memberships: DropdownItem[] = [
    { key: "MAIN", name: "Основной состав" },
    { key: "RESERVE", name: "Резервный состав" },
    { key: "NONE", name: "Не член сборной" },
] as DropdownItem[];

export function SearchForm({ onSubmitAction, tabType }: SearchFormProps) {
    const [query, setQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = React.useState<string>(RequestStatus.APPROVED);
    const [selectedDiscipline, setSelectedDiscipline] = React.useState<string>();
    const [selectedSportsCategory, setSelectedSportsCategory] = React.useState<string>();
    const [selectedMembership, setSelectedMembership] = React.useState<string>();
    const [selectedLevel, setSelectedLevel] = React.useState<string>();
    const [selectedDateRange, setSelectedDateRange] = useState<{
        start?: Date;
        end?: Date;
    }>({
        start: new Date("2019-01-01"), // 1 января 2019 года
        end: today(getLocalTimeZone()).add({ days: 7 }).toDate(getLocalTimeZone()), // Сегодня + 7 дней
    });
    const [isOnline, setIsOnline] = useState(false);
    const [isTeamFormatAllowed, setIsTeamFormatAllowed] = useState(false);
    const [isPersonalFormatAllowed, setIsPersonalFormatAllowed] = useState(false);
    const [disciplines, setDisciplines] = React.useState<{ id: string; name: string }[]>([]);
    const [levels] = React.useState(Object.values(EventLevel));
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        let searchParams: SearchParams = {
            query,
            disciplineId: selectedDiscipline,
            level: selectedLevel as EventLevel,
            requestStatus: selectedStatus as RequestStatus,
        };
        if (tabType === "requests") {
            searchParams = {
                ...searchParams,
                minApplicationTime: selectedDateRange.start,
                maxApplicationTime: selectedDateRange.end,
            };
        }
        if (tabType === "events") {
            searchParams = {
                ...searchParams,
                minStartTime: selectedDateRange.start,
                maxStartTime: selectedDateRange.end,
                isOnline,
                isTeamFormatAllowed,
                isPersonalFormatAllowed,
            };
        }

        onSubmitAction(searchParams);
        setIsLoading(false);
    };
    const handleReset = () => {
        setQuery("");
        setSelectedStatus(RequestStatus.PENDING);
        setSelectedDiscipline(undefined);
        setSelectedLevel(undefined);
        setSelectedDateRange({
            start: today(getLocalTimeZone()).subtract({ days: 7 }).toDate(getLocalTimeZone()),
            end: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
        });
    };
    useEffect(() => {
        const loadData = async () => {
            const data = await getDisciplines();
            setDisciplines(data);
        };
        void loadData();
    }, []);

    const getLevelName = (level: EventLevel) => {
        const names: Record<EventLevel, string> = {
            [EventLevel.OPEN]: "Открытый",
            [EventLevel.REGIONAL]: "Региональный",
            [EventLevel.FEDERAL]: "Федеральный",
        };
        return names[level];
    };

    const getStatusName = (status: RequestStatus) => {
        const names: Record<RequestStatus, string> = {
            [RequestStatus.PENDING]: "На рассмотрении",
            [RequestStatus.APPROVED]: "Одобрена",
            [RequestStatus.DECLINED]: "Отклонена",
        };
        return names[status];
    };

    const renderDropdown = (
        label: string,
        items: { key: string; name: string }[],
        selectedKey: string | undefined,
        onSelectionChange: (keys: Selection) => void,
        allowEmpty = false,
    ) => {
        const selectedName = items.find((i) => i.key === selectedKey)?.name ?? "Выберите...";

        return (
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">{label}</label>
                <Dropdown className="w-full">
                    <DropdownTrigger>
                        <Button variant="bordered" className="w-full justify-between text-left">
                            {selectedName}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection={!allowEmpty}
                        selectionMode="single"
                        selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
                        onSelectionChange={onSelectionChange}
                    >
                        {items.map((item) => (
                            <DropdownItem key={item.key}>{item.name}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    };

    const handleSelectionChange = (
        keys: Selection,
        setter: React.Dispatch<React.SetStateAction<string | undefined>>,
    ) => {
        const value = Array.from(keys as Set<string>)[0];
        setter(value);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className="grid w-full grid-cols-1 gap-4">
                {tabType === "representative" && (
                    <>
                        {renderDropdown(
                            "Статус",
                            Object.values(RequestStatus).map((s) => ({
                                key: s,
                                name: getStatusName(s),
                            })),
                            selectedStatus,
                            (keys) => {
                                handleSelectionChange(
                                    keys,
                                    setSelectedStatus as React.Dispatch<React.SetStateAction<string | undefined>>,
                                );
                            },
                            true,
                        )}
                    </>
                )}
                {tabType === "requests" && (
                    <>
                        <div className="col-span-full">
                            <Input
                                label="Название / описание"
                                variant="bordered"
                                fullWidth
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                            />
                        </div>
                        {renderDropdown(
                            "Дисциплина",
                            disciplines.map((d) => ({ key: d.id, name: d.name })),
                            selectedDiscipline,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedDiscipline);
                            },
                            true,
                        )}

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium">Интервал подачи</label>
                            <DateRangePicker
                                className="w-full"
                                onChange={(range) => {
                                    const timeZone = getLocalTimeZone();
                                    setSelectedDateRange({
                                        start: range?.start.toDate(timeZone),
                                        end: range?.end.toDate(timeZone),
                                    });
                                }}
                            />
                        </div>

                        {renderDropdown(
                            "Уровень соревнования",
                            levels.map((l) => ({ key: l, name: getLevelName(l) })),
                            selectedLevel,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedLevel);
                            },
                            true,
                        )}

                        {renderDropdown(
                            "Статус",
                            Object.values(RequestStatus).map((s) => ({
                                key: s,
                                name: getStatusName(s),
                            })),
                            selectedStatus,
                            (keys) => {
                                handleSelectionChange(
                                    keys,
                                    setSelectedStatus as React.Dispatch<React.SetStateAction<string | undefined>>,
                                );
                            },
                            true,
                        )}
                    </>
                )}
                {tabType === "events" && (
                    <>
                        <div className="col-span-full">
                            <Input
                                label="Название / описание"
                                variant="bordered"
                                fullWidth
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                            />
                        </div>
                        {renderDropdown(
                            "Дисциплина",
                            disciplines.map((d) => ({ key: d.id, name: d.name })),
                            selectedDiscipline,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedDiscipline);
                            },
                            true,
                        )}

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium">Даты проведения</label>
                            <DateRangePicker
                                className="w-full"
                                onChange={(range) => {
                                    const timeZone = getLocalTimeZone();
                                    setSelectedDateRange({
                                        start: range?.start.toDate(timeZone),
                                        end: range?.end.toDate(timeZone),
                                    });
                                }}
                            />
                        </div>

                        {renderDropdown(
                            "Уровень события",
                            levels.map((l) => ({ key: l, name: getLevelName(l) })),
                            selectedLevel,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedLevel);
                            },
                            true,
                        )}
                        <Checkbox isSelected={isOnline} onValueChange={setIsOnline}>
                            Онлайн
                        </Checkbox>
                        <Checkbox isSelected={isTeamFormatAllowed} onValueChange={setIsTeamFormatAllowed}>
                            Командный формат
                        </Checkbox>
                        <Checkbox isSelected={isPersonalFormatAllowed} onValueChange={setIsPersonalFormatAllowed}>
                            Индивидуальный формат
                        </Checkbox>
                    </>
                )}
                {tabType === "team" && (
                    <>
                        <div className="col-span-full">
                            <Input
                                label="ФИО"
                                variant="bordered"
                                fullWidth
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                            />
                        </div>
                        {renderDropdown(
                            "Статус нахождения в составе",
                            Memberships.map((m) => ({ key: m.key, name: m.name })),
                            selectedMembership,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedMembership);
                            },
                            true,
                        )}

                        {renderDropdown(
                            "Спортивный разряд",
                            SportsCategories.map((d) => ({ key: d.key, name: d.name })),
                            selectedSportsCategory,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedSportsCategory);
                            },
                            true,
                        )}
                    </>
                )}
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="flat" onPress={handleReset}>
                    Сбросить
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    Поиск
                </Button>
            </div>
        </Form>
    );
}
