// src/app/representative/_components/competition/competition-cards.tsx
"use client";

import { useState } from "react";

import AchievementDetails from "@/app/representative/_components/achievement/achievement-details";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { AchievementItem } from "@/types";
import { Card, CardBody, Chip, Image, useDisclosure } from "@heroui/react";

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

interface Props {
    paginatedData: AchievementItem[];
}

export default function AchievementCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<AchievementItem | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (c: AchievementItem) => {
        setSelected(c);
        onOpen();
    };

    return (
        <>
            {selected && (
                <ModalOrDrawer label="Достижение" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <AchievementDetails achievement={selected} />
                </ModalOrDrawer>
            )}
            {paginatedData.map((c, idx) => (
                <Card
                    key={idx}
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onPress={() => {
                        handleClick(c);
                    }} // switched to onPress
                >
                    <CardBody className="space-y-4">
                        <Image alt={c.eventName} src={c.imageBase64} className="w-full rounded-xl object-cover" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{c.eventName}</h3>
                            <div className="grid grid-cols-2 pt-2">
                                <Chip color="warning" variant="solid">
                                    {c.discipline}
                                </Chip>
                                <p className="pt-1 text-right text-sm">{c.spot}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
