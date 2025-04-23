"use client";

import { useState } from "react";

import EventDetails from "@/app/representative/_components/event/event-details";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { EventItem } from "@/types";
import { Card, CardBody, Image, useDisclosure } from "@heroui/react";

interface Props {
    paginatedData: EventItem[];
}

export default function EventCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<EventItem | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (e: EventItem) => {
        setSelected(e);
        onOpen();
    };

    return (
        <>
            {selected && (
                <ModalOrDrawer label="Соревнование" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <EventDetails event={selected} />
                </ModalOrDrawer>
            )}
            {paginatedData.map((e) => (
                <div
                    key={e.id}
                    onClick={() => {
                        handleClick(e);
                    }}
                >
                    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                        <CardBody className="space-y-4">
                            <Image
                                alt={e.name}
                                src={`data:image/jpeg;base64,${e.imageBase64}`}
                                className="w-full rounded-xl object-cover"
                            />
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">{e.name}</h3>
                                <p>Начало: {new Date(e.start).toLocaleDateString()}</p>
                                <p>Статус: {e.status}</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            ))}
        </>
    );
}
