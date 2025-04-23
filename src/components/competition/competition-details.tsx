"use client";

import React, { useEffect, useState } from "react";

import { RequestStatus } from "@/app/generated/prisma";
import { getRepresentativeRequestById, updateEventStatus } from "@/data/event";
import { useAuth } from "@/hooks/use-auth";
import { RepresentativeEventRequest } from "@/types/competitions";
import { formatDatetime } from "@/utils";
import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Spinner,
    Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    eventId: string;
}
export default function CompetitionDetails({ eventId }: Props) {
    const [competition, setCompetition] = useState<RepresentativeEventRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = React.useState<string>(RequestStatus.PENDING);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
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

    const handleConfirm = async () => {
        if (selectedStatus === RequestStatus.DECLINED && !comment.trim()) {
            setErrorMessage("Пожалуйста, укажите комментарий при отклонении");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // Используем нашу новую функцию
            await updateEventStatus(
                eventId,
                selectedStatus as RequestStatus,
                selectedStatus === RequestStatus.DECLINED ? comment : undefined,
            );
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
            setErrorMessage(error instanceof Error ? error.message : "Не удалось обновить статус");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <div className="grid -translate-x-10 grid-cols-2 space-y-2">
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
                    <p className="min-w-[60px] pt-1 text-sm">Регионы:</p>
                    <div className="flex flex-1 justify-end">
                        <div className="flex flex-wrap justify-end gap-2">
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
                {/* Adress */}
                {!competition.isOnline && (
                    <div className="flex items-start justify-between gap-2">
                        <p className="min-w-[60px] pt-1 text-sm">Адрес:</p>
                        <p className="min-w-[60px] pt-1 text-sm">{competition.address}</p>
                    </div>
                )}
                {/* Application date */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Время подачи:</p>
                    <p className="pt-1 text-right text-sm">{formatDatetime(competition.applicationTime)}</p>
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
                {competition.requestStatus === "DECLINED" && (
                    <div className="flex items-start justify-between gap-2">
                        <p className="min-w-[60px] pt-1 text-sm">Причина отказа:</p>
                        <p className="min-w-[60px] pt-1 text-sm">{competition.requestComment}</p>
                    </div>
                )}
                {competition.requestStatus === "PENDING" && user?.role === "admin" && (
                    <div className="mb-4 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Статус</label>
                            <Dropdown className="w-full">
                                <DropdownTrigger>
                                    <Button variant="bordered" className="w-full justify-between text-left">
                                        {[
                                            { key: RequestStatus.APPROVED, name: "Одобрить" },
                                            { key: RequestStatus.DECLINED, name: "Отклонить" },
                                        ].find((i) => i.key === selectedStatus)?.name ?? "Выберите..."}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={new Set([selectedStatus])}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys as Set<string>)[0];
                                        setSelectedStatus(value);
                                        setErrorMessage(null);
                                    }}
                                >
                                    <DropdownItem key={RequestStatus.APPROVED}>Одобрить</DropdownItem>
                                    <DropdownItem key={RequestStatus.DECLINED}>Отклонить</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        {selectedStatus === RequestStatus.DECLINED && (
                            <div>
                                <Textarea
                                    label="Комментарий"
                                    placeholder="Укажите причину отклонения"
                                    value={comment}
                                    onChange={(e) => {
                                        setComment(e.target.value);
                                    }}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

                        <div className="flex justify-end">
                            <Button
                                color="success"
                                onPress={() => void handleConfirm()}
                                isDisabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Подтвердить
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
