"use client";

import { useState } from "react";

import TeamDetails from "@/app/representative/_components/team/team-details";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { TeamItem } from "@/types";
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

// src/app/representative/_components/competition/competition-cards.tsx

interface Props {
    paginatedData: TeamItem[];
}

export default function TeamCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<TeamItem | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (c: TeamItem) => {
        setSelected(c);
        onOpen();
    };

    return (
        <>
            {selected && (
                <ModalOrDrawer label="Участник сборной" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <TeamDetails team={selected} />
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
                        <Image alt={c.lastname} src={c.imageBase64} className="w-full rounded-xl object-cover" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">
                                {c.lastname} {c.firstname}
                            </h3>
                            <div className="grid grid-cols-2 pt-2">
                                <Chip color="warning" variant="solid">
                                    {c.status}
                                </Chip>
                                <p className="pt-1 text-right text-sm">{c.birthday}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
