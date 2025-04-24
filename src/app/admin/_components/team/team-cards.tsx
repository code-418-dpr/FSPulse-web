"use client";

import { useState } from "react";

import TeamDetails from "@/app/representative/_components/team/team-details";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { AthleteItem } from "@/types";
import { Card, CardBody, CardHeader, Chip, useDisclosure } from "@heroui/react";

interface Props {
    paginatedData: AthleteItem[];
}

export default function TeamCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<AthleteItem | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (c: AthleteItem) => {
        setSelected(c);
        onOpen();
    };

    return (
        <>
            {selected && (
                <ModalOrDrawer label="Спортсмен" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <TeamDetails athlete={selected} />
                </ModalOrDrawer>
            )}
            {paginatedData.map((c, idx) => (
                <div
                    key={idx}
                    onClick={() => {
                        handleClick(c);
                    }}
                >
                    <Card key={`card-${idx}`} className="cursor-pointer transition-shadow hover:shadow-lg">
                        <CardHeader>
                            {c.lastname} {c.firstname} {c.middlename ?? ""}
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="grid grid-cols-2 space-y-2 pt-2">
                                <p className="text-sm">Дата рождения:</p>
                                <p className="pt-1 text-right text-sm">{c.birthday}</p>

                                <p>Спортивная категория:</p>
                                <p className="pt-1 text-right text-sm">{c.sportCategory}</p>

                                <Chip
                                    className="col-span-2 justify-self-center"
                                    color={
                                        c.membership === "MAIN"
                                            ? "primary"
                                            : c.membership === "RESERVE"
                                                ? "secondary"
                                                : c.membership === "NONE"
                                                    ? "warning"
                                                    : "danger"
                                    }
                                >
                                    {c.membership === "MAIN"
                                        ? "Основной состав"
                                        : c.membership === "RESERVE"
                                            ? "Резервный состав"
                                            : c.membership === "NONE"
                                                ? "Не член сборной"
                                                : "Неизвестно"}
                                </Chip>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            ))}
        </>
    );
}
