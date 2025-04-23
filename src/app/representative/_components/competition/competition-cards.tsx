// src/app/representative/_components/competition/competition-cards.tsx
"use client";

import { useState } from "react";

import CompetitionDetails from "@/app/representative/_components/competition/competition-details";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { RepresentativeRequestItem } from "@/types/search";
import { Card, CardBody, Chip, Image, useDisclosure } from "@heroui/react";

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

interface Props {
    paginatedData: RepresentativeRequestItem[];
}

export default function CompetitionCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (id: string) => {
        setSelected(id);
        onOpen();
    };
    const arrayBufferToBase64 = (buffer: Uint8Array) => {
        return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    };
    return (
        <>
            {selected && (
                <ModalOrDrawer isOpen={isOpen} onOpenChangeAction={onOpenChange} label={"Заявки"} size="xl">
                    <CompetitionDetails eventId={selected} />
                </ModalOrDrawer>
            )}
            {paginatedData.map((c) => (
                <div
                    key={c.id}
                    onClick={() => {
                        handleClick(c.id);
                    }}
                >
                    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                        <CardBody className="space-y-4">
                            <Image
                                alt={c.name}
                                src={arrayBufferToBase64(c.cover)}
                                className="w-full rounded-xl object-cover"
                            />
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">{c.name}</h3>
                                <div className="flex items-center justify-between pt-2">
                                    <h4 className="text-md text-foreground/50 font-bold"> {c.discipline.name}</h4>

                                    <Chip color="secondary" variant="flat">
                                        {c.level == "FEDERAL"
                                            ? "Всероссийский"
                                            : c.level == "OPEN"
                                              ? "Открытый"
                                              : "Региональный"}
                                    </Chip>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <p className="pt-1 text-left text-sm">{c.applicationTime.toLocaleDateString()}</p>
                                    <Chip
                                        color={
                                            c.requestStatus == "APPROVED"
                                                ? "success"
                                                : c.requestStatus == "DECLINED"
                                                  ? "danger"
                                                  : "warning"
                                        }
                                        variant="solid"
                                    >
                                        {c.requestStatus == "APPROVED"
                                            ? "Одобрено"
                                            : c.requestStatus == "DECLINED"
                                              ? "Отклонено"
                                              : "На рассмотрении"}
                                    </Chip>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            ))}
        </>
    );
}
