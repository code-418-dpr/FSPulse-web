"use client";

import { useEffect, useState } from "react";

import { getEventById } from "@/data/event";
import { EventItemForId } from "@/types";
import { formatDatetime, getEventStatusByDatetimes } from "@/utils";
import { Chip, Image, Spinner, Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    eventId: string;
}

export default function EventDetails({ eventId }: Props) {
    const [event, setEvent] = useState<EventItemForId | null>(null);
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
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between pt-2">
                <h3 className="text-xl font-bold">{event.name}</h3>
                <Chip color="secondary" variant="flat">
                    {event.level == "FEDERAL" ? "Всероссийский" : event.level == "OPEN" ? "Открытый" : "Региональный"}
                </Chip>
            </div>
            <Tabs
                aria-label="Детали мероприятия"
                className="w-full"
                classNames={{
                    tabList: "grid grid-cols-3 w-full", // Равномерное распределение вкладок
                    panel: "pt-4", // Отступ для контента
                }}
            >
                <Tab key="info" title="Информация" className="w-full">
                    <div className="grid grid-cols-2">
                        <Image
                            alt={event.name}
                            src={arrayBufferToBase64(event.cover)}
                            className="w-[80%] rounded-xl object-cover"
                        />
                        <div className="grid grid-cols-1">
                            <p className="text-md -translate-x-10">{event.description}</p>
                            <p className="text-foreground/50 -translate-x-10 text-sm font-bold">
                                {event.discipline.name}
                            </p>
                            <div className="grid -translate-x-10 grid-cols-2 space-y-2">
                                <p className="left col-span-2 pt-1 text-sm">
                                    Начало:
                                    <span className="text-foreground/50 ml-1 -translate-x-10 text-sm">
                                        {formatDatetime(event.start)}
                                    </span>
                                    <br />
                                    Конец:
                                    <span className="text-foreground/50 ml-1 -translate-x-10 text-sm">
                                        {formatDatetime(event.end)}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <p className="-translate-x-10 text-sm">Формат:</p>
                                <Chip color={event.isOnline ? "success" : "danger"} variant="flat">
                                    {event.isOnline ? "Онлайн" : "Офлайн"}
                                </Chip>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 space-y-2 pt-2">
                        {/* Region */}
                        <div className="flex items-start gap-2">
                            <p className="min-w-[60px] pt-1 text-sm">Регионы:</p>
                            <div className="flex flex-1 justify-end">
                                <div className="flex flex-wrap justify-end gap-2">
                                    {event.representatives.map((rep) => (
                                        <Chip
                                            key={rep.representative.id}
                                            startContent={
                                                <span className="flex items-center">
                                                    <Icon
                                                        icon="iconoir:map-pin"
                                                        width={14}
                                                        height={14}
                                                        className="mr-1"
                                                    />
                                                </span>
                                            }
                                            size="sm"
                                            color="success"
                                            variant="solid"
                                            className="whitespace-nowrap"
                                        >
                                            {rep.representative.user.region.name}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Adress */}
                        {!event.isOnline && (
                            <div className="flex items-start justify-between gap-2">
                                <p className="min-w-[60px] pt-1 text-sm">Адрес:</p>
                                <p className="min-w-[60px] pt-1 text-sm">{event.address}</p>
                            </div>
                        )}
                        {/* Status */}
                        <div className="grid grid-cols-2 space-y-2">
                            <p className="pt-1 text-left text-sm">Статус:</p>
                            <Chip
                                className="place-self-end"
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
                </Tab>

                <Tab key="participants" title="Участники" className="w-full">
                    {/* Контент для вкладки участников */}
                    <p className="text-foreground-500">Список участников будет доступен позже</p>
                </Tab>

                <Tab key="results" title="Итоги" className="w-full">
                    {/* Контент для вкладки итогов */}
                    <p className="text-foreground-500">А вот за это мне не заплатили, идите нахуй.</p>
                </Tab>
            </Tabs>
        </div>
    );
}
