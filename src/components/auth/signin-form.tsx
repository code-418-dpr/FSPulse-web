"use client";

import { z } from "zod";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import PasswordInput from "@/components/password-input";
import { Button, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignInFormProps extends React.ComponentPropsWithoutRef<"form"> {
    className?: string;
}

const formSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    password: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export default function SignInForm({ className }: SignInFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
            setError(error instanceof Error ? error.message : "Произошла ошибка при входе");
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
                    label="Email"
                    type="email"
                    variant="bordered"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                />
                <PasswordInput
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                />
                {error && <div className="text-sm text-red-500">{error}</div>}
                <Button type="submit" color="success" isLoading={isLoading}>
                    Вход
                </Button>
            </div>
        </form>
    );
}
