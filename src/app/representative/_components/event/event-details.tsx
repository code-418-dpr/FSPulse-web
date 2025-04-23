"use client";

import React from "react";

import CompetitionResultForm from "@/app/representative/_components/competition-result-form";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { EventItem } from "@/types";
import { Button, Chip, Image, useDisclosure } from "@heroui/react";

// src/app/representative/_components/event/event-details.tsx

// src/app/representative/_components/event/event-details.tsx

interface Props {
    event: EventItem;
}

export default function EventDetails({ event }: Props) {
    const { isOpen: isTeamsOpen, onOpen: onTeamsOpen, onOpenChange: onTeamsOpenChange } = useDisclosure();
    const { isOpen: isGradesOpen, onOpen: onGradesOpen, onOpenChange: onGradesOpenChange } = useDisclosure();

    return (
        <>
            <h3 className="text-2xl font-bold">{event.name}</h3>
            <Image
                alt={event.name}
                src={`data:image/jpeg;base64,${event.imageBase64}`}
                className="w-full rounded-xl object-cover"
            />
            <div className="grid grid-cols-1 space-y-2">
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Начало:</p>
                    <p className="pt-1 text-right text-sm">{new Date(event.start).toLocaleDateString()}</p>
                </div>
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Статус:</p>
                    <Chip className="place-self-end" color="success" variant="solid">
                        {event.status}
                    </Chip>
                </div>
                <Button className="m-3" onPress={onTeamsOpen}>
                    Зарегистрироваться
                </Button>

                <ModalOrDrawer
                    label="Регистрация на соревнование"
                    isOpen={isTeamsOpen}
                    onOpenChangeAction={onTeamsOpenChange}
                >
                    <CompetitionResultForm />
                </ModalOrDrawer>

                <Button onPress={onGradesOpen}>Распределить баллы</Button>

                <ModalOrDrawer
                    label="Распределение баллов"
                    isOpen={isGradesOpen}
                    onOpenChangeAction={onGradesOpenChange}
                >
                    <CompetitionResultForm />
                </ModalOrDrawer>
            </div>
        </>
    );
}
