"use client";

import React, { useEffect, useState } from "react";

import { RequestStatus } from "@/app/generated/prisma";
import { getRepresentativeById, updateRepresentativeStatus } from "@/data/representative";
import { RepresentativeDetails } from "@/types/representative";
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    representativeId: string;
    onCloseAction: () => void;
}

export default function RepresentatDetails({ representativeId, onCloseAction }: Props) {
    const [representative, setRepresentative] = useState<RepresentativeDetails | null>(null);
    const [selectedStatus, setSelectedStatus] = React.useState<string>(RequestStatus.PENDING);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleConfirm = async () => {
        if (selectedStatus === RequestStatus.DECLINED && comment.trim() === "") {
            setErrorMessage("Пожалуйста, укажите комментарий при отклонении");
            return;
        }

        setErrorMessage(null);
        setIsSubmitting(true);
        try {
            await updateRepresentativeStatus(representativeId, selectedStatus as "APPROVED" | "DECLINED", comment);
            onCloseAction();
        } catch (err) {
            console.error("Ошибка при обновлении статуса:", err);
            setErrorMessage("Не удалось обновить статус");
        } finally {
            setIsSubmitting(false);
        }
    };
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getRepresentativeById(representativeId);
                console.log("Представительство: ", representativeId);
                console.log(data);
                setRepresentative(data);
            } catch {
                setError("Не удалось загрузить данные представителя");
            } finally {
                setLoading(false);
            }
        };

        if (representativeId) {
            void loadData();
        }
    }, [representativeId]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !representative) {
        return <div className="text-danger-500 py-8 text-center">{error ?? "Представитель не найден"}</div>;
    }
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between pt-2">
                        <h2 className="text-2xl font-bold">
                            {[
                                representative.user.lastname,
                                representative.user.firstname,
                                representative.user.middlename,
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        </h2>
                        <div className="space-y-2">
                            <Chip
                                color={
                                    representative.requestStatus === "APPROVED"
                                        ? "success"
                                        : representative.requestStatus === "DECLINED"
                                          ? "danger"
                                          : "warning"
                                }
                                variant="solid"
                                className="w-full justify-center"
                            >
                                {representative.requestStatus === "APPROVED"
                                    ? "Одобрено"
                                    : representative.requestStatus === "DECLINED"
                                      ? "Отклонено"
                                      : "На рассмотрении"}
                            </Chip>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold">Контактная информация</h3>
                    <p className="text-foreground/80">Контактный телефон: {representative.user.phoneNumber}</p>
                    <p className="text-foreground/80">Контактная почта: {representative.user.email}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {representative.requestStatus === "APPROVED" && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
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
                                {representative.user.region.name}
                            </Chip>
                        </div>
                    </div>
                )}
                {representative.requestStatus === "APPROVED" ||
                    (representative.requestStatus === "DECLINED" && (
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Дополнительная информация</h3>
                            {representative.user.tg && (
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:telegram" className="h-5 w-5" />
                                    <span>@{representative.user.tg}</span>
                                </div>
                            )}
                            {representative.requestComment && <p>Комментарий: {representative.requestComment}</p>}
                        </div>
                    ))}
                {representative.requestStatus === "PENDING" && (
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
        </div>
    );
}
