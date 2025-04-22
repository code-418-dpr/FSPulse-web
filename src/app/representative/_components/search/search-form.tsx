"use client";

import React, { useEffect } from "react";

import { EventLevel, RequestStatus } from "@/app/generated/prisma";
import { getDisciplines } from "@/data/discipline";
import {
    Button,
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

export function SearchForm() {
    const [selectedStatus, setSelectedStatus] = React.useState<Set<string>>(new Set([RequestStatus.PENDING]));
    const [selectedDiscipline, setSelectedDiscipline] = React.useState<Set<string>>(new Set());
    const [selectedLevel, setSelectedLevel] = React.useState<Set<string>>(new Set());
    const [disciplines, setDisciplines] = React.useState<{ id: string; name: string }[]>([]);
    const [levels] = React.useState(Object.values(EventLevel));

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
        selectedKeys: Set<string>,
        onSelectionChange: (keys: Selection) => void,
        allowEmpty = false,
    ) => {
        const selectedNames = Array.from(selectedKeys)
            .map((key) => items.find((item) => item.key === key)?.name ?? key)
            .join(", ");

        return (
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">{label}</label>
                <Dropdown className="w-full">
                    <DropdownTrigger>
                        <Button variant="bordered" className="w-full justify-between text-left">
                            {selectedNames || "Выберите..."}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection={!allowEmpty}
                        selectionMode="single"
                        selectedKeys={selectedKeys}
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
        allKeys: string[],
        setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    ) => {
        if (keys === "all") {
            setter(new Set(allKeys));
        } else {
            setter(new Set(keys as Iterable<string>));
        }
    };

    return (
        <Form>
            <div className="grid grid-cols-1 gap-4">
                <div className="col-span-full">
                    <Input label="Поиск по описанию" variant="bordered" fullWidth />
                </div>

                {renderDropdown(
                    "Дисциплина",
                    disciplines.map((d) => ({ key: d.id, name: d.name })),
                    selectedDiscipline,
                    (keys) => {
                        handleSelectionChange(
                            keys,
                            disciplines.map((d) => d.id),
                            setSelectedDiscipline,
                        );
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
                    />
                </div>

                {renderDropdown(
                    "Уровень события",
                    levels.map((l) => ({ key: l, name: getLevelName(l) })),
                    selectedLevel,
                    (keys) => {
                        handleSelectionChange(
                            keys,
                            levels.map((l) => l),
                            setSelectedLevel,
                        );
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
                        handleSelectionChange(keys, Object.values(RequestStatus), setSelectedStatus);
                    },
                    true,
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="flat">Сбросить</Button>
            </div>
        </Form>
    );
}
