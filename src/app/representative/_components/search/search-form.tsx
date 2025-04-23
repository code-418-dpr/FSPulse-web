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
    Switch,
} from "@heroui/react";
import { type Selection } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

interface SearchFormProps {
    onSubmitAction: (params: SearchParams) => void;
    tabType: Tab;
}
export function SearchForm({ onSubmitAction, tabType }: SearchFormProps) {
    const [query, setQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = React.useState<string>(RequestStatus.PENDING);
    const [selectedDiscipline, setSelectedDiscipline] = React.useState<string>();
    const [selectedLevel, setSelectedLevel] = React.useState<string>();
    const [selectedDateRange, setSelectedDateRange] = useState<{
        start?: Date;
        end?: Date;
    }>({
        start: today(getLocalTimeZone()).subtract({ days: 7 }).toDate(getLocalTimeZone()),
        end: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    });
    const [disciplines, setDisciplines] = React.useState<{ id: string; name: string }[]>([]);
    const [levels] = React.useState(Object.values(EventLevel));
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const searchParams: SearchParams = {
            query,
            disciplineId: selectedDiscipline,
            level: selectedLevel as EventLevel,
            requestStatus: selectedStatus as RequestStatus,
            minApplicationTime: selectedDateRange.start,
            maxApplicationTime: selectedDateRange.end,
        };

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
            [RequestStatus.APPROVED]: "Одобрено",
            [RequestStatus.DECLINED]: "Отклонено",
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
                <div className="col-span-full">
                    <Input
                        label="Поиск по описанию"
                        variant="bordered"
                        fullWidth
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }}
                    />
                </div>
                {tabType === "requests" && (
                    <>
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
                            <label className="mb-2 block text-sm font-medium">Даты подачи заявки</label>
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

                        {renderDropdown(
                            "Уровень события",
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

                        {renderDropdown(
                            "Уровень события",
                            levels.map((l) => ({ key: l, name: getLevelName(l) })),
                            selectedLevel,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedLevel);
                            },
                            true,
                        )}
                        {renderDropdown(
                            "Статус",
                            [
                                { key: "upcoming", name: "Скоро..." },
                                { key: "registration_open", name: "Начата регистрация" },
                                { key: "registration_closed", name: "Регистрация закончена" },
                                { key: "in_progress", name: "Соревнование идёт" },
                                { key: "summarizing", name: "Подведение итогов" },
                                { key: "completed", name: "Соревнование завершено" },
                            ],
                            selectedStatus,
                            (keys) => {
                                handleSelectionChange(
                                    keys,
                                    setSelectedStatus as React.Dispatch<React.SetStateAction<string | undefined>>,
                                );
                            },
                            true,
                        )}
                        <Switch defaultSelected>Онлайн</Switch>
                        <Checkbox defaultSelected>Командный формат</Checkbox>
                        <Checkbox>Индивидуальный формат</Checkbox>
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
