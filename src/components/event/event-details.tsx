"use client";

import { useEffect, useState } from "react";

import { getEventById } from "@/data/event";
import { EventItem } from "@/types";
import { getEventStatusByDatetimes } from "@/utils";
import { Chip, Image, Spinner } from "@heroui/react";

interface Props {
    eventId: string;
}

export default function EventDetails({ eventId }: Props) {
    const [event, setEvent] = useState<EventItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const arrayBufferToBase64 = (buffer: Uint8Array) => {
        return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    };

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = await getEventById(eventId);
                setEvent(data);
            } catch {
                setError("Не удалось загрузить данные о событии.");
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            void loadEvent();
        }
    }, [eventId]);
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !event) {
        return <div className="text-danger-500 py-8 text-center">{error ?? "Мероприятие не найдено"}</div>;
    }
    const eventStatus = getEventStatusByDatetimes(
        event.startRegistration,
        event.endRegistration,
        event.start,
        event.end,
    );
    return (
        <>
            <h3 className="text-2xl font-bold">{event.name}</h3>
            <Image alt={event.name} src={arrayBufferToBase64(event.cover)} className="w-full rounded-xl object-cover" />
            <div className="grid grid-cols-1 space-y-2">
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Начало:</p>
                    <p className="pt-1 text-right text-sm">{new Date(event.start).toLocaleDateString()}</p>
                </div>
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Статус:</p>
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
        </>
    );
}
