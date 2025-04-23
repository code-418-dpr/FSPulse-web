"use client";

import { z } from "zod";

import type React from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { teamRequestSchema } from "@/schemas/team-request-schema";
import { Button, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = teamRequestSchema;

type UserFormData = z.infer<typeof userSchema>;
export default function TeamCreateForm({ className }: React.ComponentProps<"form">) {
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: SubmitHandler<UserFormData> = async (data) => {
        try {
            setIsLoading(true);
            setFormError(null);

            console.log(data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
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
        <form className={cn("grid items-start gap-4", className)} onSubmit={handleFormSubmit}>
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
                {formError && <div className="text-danger-500 text-center text-sm">{formError}</div>}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Создать команду
                </Button>
            </div>
        </form>
    );
}
