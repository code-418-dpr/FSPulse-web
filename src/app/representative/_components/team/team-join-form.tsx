"use client";

import type React from "react";
import { useState } from "react";

import { TeamWithMembersItem } from "@/types";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

interface Props {
    paginatedData: TeamWithMembersItem[];
}

export default function TeamJoinForm({ paginatedData }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (teamName: string) => {
        console.log("Хочу в команду: " + teamName);
        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Здесь можно добавить реальный запрос к API
        } catch (error) {
            console.error("Ошибка при вступлении в команду:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {paginatedData.map((teamWithMembers, i) => (
                <Card key={i + 1}>
                    <CardHeader>{teamWithMembers.name}</CardHeader>
                    <CardBody>
                        <h3 className="text-base">
                            0. Капитан: <span className="block">{teamWithMembers.leader}</span>
                        </h3>
                        <div>
                            {teamWithMembers.members.map((member, index) => (
                                <p key={member} className="text-sm">
                                    {index + 1}. {member}
                                </p>
                            ))}
                        </div>
                    </CardBody>
                    <CardFooter>
                        <Button
                            color="success"
                            isLoading={isLoading}
                            fullWidth
                            className="mt-6 text-sm"
                            onPress={() => void onSubmit(teamWithMembers.name)}
                        >
                            Вступить в команду
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}
