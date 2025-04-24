"use client";

import { z } from "zod";

import type React from "react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { getEventById, registerAthleteForEvent } from "@/data/event";
import { registerTeam } from "@/data/team";
import { findAthleteById } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { teamRequestSchema } from "@/schemas/team-request-schema";
import { EventItemForId } from "@/types";
import { Button, Input, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = teamRequestSchema;

type UserFormData = z.infer<typeof userSchema>;
export default function TeamCreateForm({ isPersonalAllow, eventId }: { isPersonalAllow: boolean; eventId: string }) {
    const [event, setEvent] = useState<EventItemForId | null>(null);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isIndividLoading, setIsIndividLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = await getEventById(eventId);
                console.log(data);
                setEvent(data);
            } catch {
                console.error("Не удалось загрузить данные о событии.");
            }
        };

        if (eventId) {
            void loadEvent();
        }
    }, [eventId]);

    const onIndividSubmit = async () => {
        try {
            setIsIndividLoading(true);

            if (!user?.id) {
                throw new Error("Пользователь не авторизован");
            }

            const athlete = await findAthleteById(user.id);
            if (!athlete) {
                throw new Error("Атлет не найден");
            }

            await registerAthleteForEvent(athlete.id, eventId);

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                alert(`Ошибка регистрации: ${error.message}`);
                console.error("Registration error:", error);
            } else {
                alert("Произошла неизвестная ошибка");
                console.error("Unknown error:", error);
            }
        } finally {
            setIsIndividLoading(false);
        }
    };

    const onSubmit: SubmitHandler<UserFormData> = async (data) => {
        try {
            setIsLoading(true);
            setFormError(null);

            await registerTeam(
                {
                    name: data.name,
                    about: data.description ?? null,
                    eventId: eventId,
                },
                user?.id ?? "",
            );
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("name")) {
                    setError("root", { message: error.message });
                    setFormError(error.message);
                } else {
                    setFormError(error.message);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e).catch(console.error);
    };

    return (
        <>
            {event?.minTeamParticipantsCount !== 0 ? (
                <form className="grid items-start gap-4" onSubmit={handleFormSubmit}>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Название команды"
                            aria-label="Название команды"
                            type="text"
                            variant="bordered"
                            {...register("name")}
                            isInvalid={!!errors.name}
                            errorMessage={errors.name?.message}
                        />
                        <Textarea
                            label="Описание команды"
                            placeholder="Здесь также можете указать кого вы ищите"
                            aria-label="Название команды"
                            type="text"
                            variant="bordered"
                            {...register("description")}
                            isInvalid={!!errors.description}
                            errorMessage={errors.description?.message}
                        />
                        {formError && <div className="text-danger-500 text-center text-sm">{formError}</div>}
                        <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                            Создать команду
                        </Button>
                    </div>
                </form>
            ) : (
                <></>
            )}
            {isPersonalAllow ? (
                <Button
                    color="primary"
                    isLoading={isIndividLoading}
                    fullWidth
                    className="mt-6"
                    onPress={() => {
                        void onIndividSubmit();
                    }}
                >
                    Зарегистрироваться индивидуально
                </Button>
            ) : (
                <></>
            )}
        </>
    );
}
