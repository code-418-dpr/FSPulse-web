"use client";

import React from "react";

import {
    Button,
    DateRangePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Form,
    Switch,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

export default function SearchForm() {
    const [isSelected, setIsSelected] = React.useState(true);
    const [selectedStatusKeys, setSelectedStatusKeys] = React.useState<Set<string>>(new Set(["На рассмотрении"]));
    const [selectedDisciplineKeys, setSelectedDisciplineKeys] = React.useState<Set<string>>(
        new Set(["Продуктовое программирование"]),
    );

    const selectedStatusValue = React.useMemo(
        () => Array.from(selectedStatusKeys).join(", ").replace(/_/g, ""),
        [selectedStatusKeys],
    );

    const selectedDisciplineValue = React.useMemo(
        () => Array.from(selectedDisciplineKeys).join(", ").replace(/_/g, ""),
        [selectedDisciplineKeys],
    );

    const handleSelectionStatusChange = (keys: Selection) => {
        if (keys === "all") {
            setSelectedStatusKeys(new Set(["На рассмотрении", "Принята", "Отклонена"]));
        } else {
            const stringKeys = new Set<string>();
            (keys as Set<string>).forEach((key) => {
                if (typeof key === "string") {
                    stringKeys.add(key);
                }
            });
            setSelectedStatusKeys(stringKeys);
        }
    };

    const handleSelectionDisciplineChange = (keys: Selection) => {
        if (keys === "all") {
            setSelectedDisciplineKeys(
                new Set([
                    "Продуктовое программирование",
                    "Алгоритмическое программирование",
                    "Программирование БПЛА",
                    "Робототехника",
                ]),
            );
        } else {
            const stringKeys = new Set<string>();
            (keys as Set<string>).forEach((key) => {
                if (typeof key === "string") {
                    stringKeys.add(key);
                }
            });
            setSelectedDisciplineKeys(stringKeys);
        }
    };

    return (
        <Form>
            <div></div>

            <div>
                <p>Статус:</p>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className="capitalize" variant="bordered">
                            {selectedStatusValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Status selection"
                        selectedKeys={selectedStatusKeys}
                        selectionMode="single"
                        variant="flat"
                        onSelectionChange={handleSelectionStatusChange}
                    >
                        <DropdownItem key="На рассмотрении">На рассмотрении</DropdownItem>
                        <DropdownItem key="Принята">Принята</DropdownItem>
                        <DropdownItem key="Отклонена">Отклонена</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className="flex flex-col gap-2">
                <p>Формат:</p>
                <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                    {isSelected ? "Онлайн" : "Офлайн"}
                </Switch>
            </div>

            <div>
                <div>
                    <DateRangePicker
                        label="Даты проведения:"
                        defaultValue={{
                            start: today(getLocalTimeZone()).subtract({ days: 7 }),
                            end: today(getLocalTimeZone()),
                        }}
                    />
                </div>
            </div>

            <div>
                <p>Дисциплина:</p>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className="capitalize" variant="bordered">
                            {selectedDisciplineValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Discipline selection"
                        selectedKeys={selectedDisciplineKeys}
                        selectionMode="single"
                        variant="flat"
                        onSelectionChange={handleSelectionDisciplineChange}
                    >
                        <DropdownItem key="Продуктовое программирование">Продуктовое программирование</DropdownItem>
                        <DropdownItem key="Алгоритмическое программирование">
                            Алгоритмическое программирование
                        </DropdownItem>
                        <DropdownItem key="Программирование БПЛА">Программирование БПЛА</DropdownItem>
                        <DropdownItem key="Робототехника">Робототехника</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </Form>
    );
}
