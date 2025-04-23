"use client";

import React, { useEffect, useState } from "react";

import { getRepresentativeRequestById } from "@/data/event";
import { RepresentativeEventRequest } from "@/types/competitions";
import { formatDatetime } from "@/utils";
import { Chip, Image, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    eventId: string;
}
export default function CompetitionDetails({ eventId }: Props) {
    const [competition, setCompetition] = useState<RepresentativeEventRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = await getRepresentativeRequestById(eventId);
                setCompetition(data);
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

    if (error || !competition) {
        return <div className="text-danger-500 py-8 text-center">{error ?? "Событие не найдено"}</div>;
    }
    const arrayBufferToBase64 = (buffer: Uint8Array) => {
        return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    };
    return (
        <>
            <div className="flex items-center justify-between pt-2">
                <h3 className="text-xl font-bold">{competition.name}</h3>
                <Chip color="secondary" variant="flat">
                    {competition.level == "FEDERAL"
                        ? "Всероссийский"
                        : competition.level == "OPEN"
                          ? "Открытый"
                          : "Региональный"}
                </Chip>
            </div>
            <div className="grid grid-cols-2">
                <Image
                    alt={competition.name}
                    src={arrayBufferToBase64(competition.cover)}
                    className="w-[80%] rounded-xl object-cover"
                />
                <div className="grid grid-cols-1">
                    <p className="text-md -translate-x-10">{competition.description}</p>
                    <p className="text-foreground/50 -translate-x-10 text-sm font-bold">
                        {competition.discipline.name}
                    </p>
                    <div className="grid grid-cols-2 space-y-2">
                        <p className="left col-span-2 pt-1 text-sm">
                            Начало:
                            <span className="text-foreground/50 ml-1 -translate-x-10 text-sm">
                                {formatDatetime(competition.start)}
                            </span>
                            <br />
                            Конец:
                            <span className="text-foreground/50 ml-1 -translate-x-10 text-sm">
                                {formatDatetime(competition.end)}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <p className="-translate-x-10 text-sm">Формат:</p>
                        <Chip color={"primary"} variant="flat">
                            {competition.isOnline ? "Онлайн" : "Офлайн"}
                        </Chip>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 space-y-2">
                {/* Region */}
                <div className="flex items-start gap-2">
                    <p className="text-sm pt-1 min-w-[60px]">Регион:</p>
                    <div className="flex-1 flex justify-end">
                        <div className="flex flex-wrap gap-2 justify-end">
                        {competition.representatives.map((rep) => (
                            <Chip
                            key={rep.representative.id}
                            startContent={
                                <span className="flex items-center">
                                <Icon icon="iconoir:map-pin" width={14} height={14} className="mr-1" />
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
                {/* Status */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Статус:</p>
                    <Chip
                        className="place-self-end"
                        color={
                            competition.requestStatus == "APPROVED"
                                ? "success"
                                : competition.requestStatus == "DECLINED"
                                  ? "danger"
                                  : "warning"
                        }
                        variant="solid"
                    >
                        {competition.requestStatus == "APPROVED"
                            ? "Одобрено"
                            : competition.requestStatus == "DECLINED"
                              ? "Отклонено"
                              : "На рассмотрении"}
                    </Chip>
                </div>
                {/* Application date */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Время подачи:</p>
                    <p className="pt-1 text-right text-sm">{formatDatetime(competition.applicationTime)}</p>
                </div>
            </div>
        </>
    );
}
