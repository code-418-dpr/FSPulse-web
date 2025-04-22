"use client";

import React from "react";

import CompetitionResultForm from "@/app/representative/_components/competition-result-form";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { CompetitionItem } from "@/types";
import { Button, Chip, Image, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    competition: CompetitionItem;
}

export default function CompetitionDetails({ competition }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <h3 className="text-2xl font-bold">{competition.title}</h3>
            <Image alt={competition.title} src={competition.image} className="w-full rounded-xl object-cover" />
            <div className="grid grid-cols-1 space-y-2">
                {/* Format */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Формат:</p>
                    <Chip className="place-self-end" color="success" variant="solid">
                        {competition.format}
                    </Chip>
                </div>
                {/* Region */}
                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left text-sm">Регион:</p>
                    <Chip
                        startContent={
                            <span className="flex items-center">
                                <Icon icon="iconoir:map-pin" width={18} height={18} className="mr-1" />
                            </span>
                        }
                        className="col-span-2 place-self-end"
                        color="success"
                        variant="solid"
                    >
                        {competition.region}
                    </Chip>
                </div>
                {/* Status */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Статус:</p>
                    <Chip className="place-self-end" color="success" variant="solid">
                        {competition.status}
                    </Chip>
                </div>
                {/* Application date */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Зарегистрирован:</p>
                    <p className="pt-1 text-right text-sm">{competition.applicationDate}</p>
                </div>
                {/* Event dates */}
                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left text-sm">Даты:</p>
                    <p className="col-span-2 pt-1 text-right text-sm">
                        {competition.startDate} – {competition.endDate}
                    </p>
                </div>
                {/* Discipline */}
                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left text-sm">Дисциплина:</p>
                    <p className="col-span-2 pt-1 text-right text-sm">{competition.discipline}</p>
                </div>

                <Button onPress={onOpen}>Распределить баллы</Button>

                <ModalOrDrawer label="Распределение баллов" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <CompetitionResultForm />
                </ModalOrDrawer>
            </div>
        </>
    );
}
