"use client";

import type React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, Input, cn } from "@heroui/react";

interface TeamGrade {
    team: string;
    grade: number;
}

const initialTeams: TeamGrade[] = [
    { team: "Код 418", grade: 0 },
    { team: "Код 3318", grade: 0 },
    { team: "Код 11118", grade: 0 },
    { team: "Код 4518", grade: 0 },
    { team: "Код 718", grade: 0 },
    { team: "Код 118", grade: 0 },
];

export default function SpokesmanSignupForm({ className }: React.ComponentProps<"form">) {
    const [teams, setTeams] = useState<TeamGrade[]>(initialTeams);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();

    const handleGradeChange = (index: number, value: string) => {
        const newTeams = [...teams];
        // Преобразуем в число, проверяем на NaN
        const gradeValue = parseInt(value) || 0;
        newTeams[index].grade = gradeValue;
        setTeams(newTeams);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setFormError(null);

            console.log("Отправляемые данные:", teams);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("Изменения сохранены:", teams);
            router.push("/");
        } catch (error) {
            console.error("Ошибка сохранения:", error);
            setFormError(error instanceof Error ? error.message : "Произошла ошибка при сохранении");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void handleSubmit(); // Явное указание void для промиса
    };

    return (
        <form className={cn("grid items-start gap-4", className)} onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
                {teams.map((team, index) => (
                    <Input
                        key={team.team}
                        label={team.team}
                        type="number"
                        variant="bordered"
                        value={team.grade.toString()}
                        onChange={(e) => { handleGradeChange(index, e.target.value); }}
                        min="0"
                        step="1"
                    />
                ))}

                {formError && <div className="text-danger-500 text-center text-sm">{formError}</div>}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Сохранить изменения
                </Button>
            </div>
        </form>
    );
}
