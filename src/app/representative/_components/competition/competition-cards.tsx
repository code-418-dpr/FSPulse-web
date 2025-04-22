// src/app/representative/_components/competition/competition-cards.tsx
"use client";

import { useState } from "react";

import { CompetitionItem } from "@/types";
import { Card, CardBody, Chip, Image } from "@heroui/react";

import CompetitionDialogOrDrawer from "./competition-modal-or-drawer";

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

// src/app/representative/_components/competition/competition-cards.tsx

interface Props {
    paginatedData: CompetitionItem[];
}

export default function CompetitionCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<CompetitionItem | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (c: CompetitionItem) => {
        setSelected(c);
        setIsOpen(true);
    };

    return (
        <>
            {selected && <CompetitionDialogOrDrawer isOpen={isOpen} onOpenChange={setIsOpen} competition={selected} />}
            {paginatedData.map((c, idx) => (
                <Card
                    key={idx}
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onPress={() => {
                        handleClick(c);
                    }} // switched to onPress
                >
                    <CardBody className="space-y-4">
                        <Image alt={c.title} src={c.image} className="w-full rounded-xl object-cover" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{c.title}</h3>
                            <div className="grid grid-cols-2 pt-2">
                                <Chip color="warning" variant="solid">
                                    {c.status}
                                </Chip>
                                <p className="pt-1 text-right text-sm">{c.applicationDate}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
