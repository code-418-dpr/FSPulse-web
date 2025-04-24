"use client";

import { useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { EventItem } from "@/types";
import { formatDatetime, getEventStatusByDatetimes } from "@/utils";
import { Badge, Card, CardBody, Chip, Image, useDisclosure } from "@heroui/react";

import EventDetails from "./event-details";

interface Props {
    paginatedData: EventItem[];
}

export default function EventCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (id: string) => {
        setSelected(id);
        onOpen();
    };
    const arrayBufferToBase64 = (buffer: Uint8Array) => {
        return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    };
    return (
        <>
            {selected && (
                <ModalOrDrawer label="Мероприятие" isOpen={isOpen} onOpenChangeAction={onOpenChange} size="3xl">
                    <EventDetails eventId={selected} />
                </ModalOrDrawer>
            )}
            {paginatedData.map((e) => {
                // Вычисляем статус один раз
                const eventStatus = getEventStatusByDatetimes(e.startRegistration, e.endRegistration, e.start, e.end);

                return (
                    <div
                        key={e.id}
                        onClick={() => {
                            handleClick(e.id);
                        }}
                    >
                        <Card
                            key={e.id}
                            className="cursor-pointer transition-shadow hover:shadow-lg"
                            onPress={() => {
                                handleClick(e.id);
                            }}
                        >
                            <CardBody className="space-y-4">
                                <Badge
                                    color={e.isOnline ? "success" : "danger"}
                                    content={e.isOnline ? "Онлайн" : "Офлайн"}
                                    className="top-1 right-6"
                                >
                                    <Image
                                        alt={e.name}
                                        src={arrayBufferToBase64(e.cover)}
                                        className="w-full rounded-xl object-cover"
                                    />
                                </Badge>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{e.name}</h3>
                                    <div className="flex items-center justify-between pt-2">
                                        <h4 className="text-foreground/50 text-sm font-bold">{e.discipline.name}</h4>
                                        <Chip color="secondary" variant="flat">
                                            {e.level === "FEDERAL"
                                                ? "Всероссийский"
                                                : e.level === "OPEN"
                                                  ? "Открытый"
                                                  : "Региональный"}
                                        </Chip>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="grig grid-cols-1">
                                            <p className="pt-1 text-left text-xs">{formatDatetime(e.start)}</p>
                                            <p className="pt-1 text-left text-xs">{formatDatetime(e.end)}</p>
                                        </div>
                                        <Chip
                                            color={
                                                eventStatus === "Регистрация скоро начнётся"
                                                    ? "primary"
                                                    : eventStatus === "Идёт регистрация"
                                                      ? "secondary"
                                                      : eventStatus === "Регистрация завершена"
                                                        ? "warning"
                                                        : eventStatus === "Началось"
                                                          ? "success"
                                                          : "danger"
                                            }
                                            variant="solid"
                                        >
                                            {eventStatus}
                                        </Chip>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </>
    );
}
