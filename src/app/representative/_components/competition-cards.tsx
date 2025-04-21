// src/app/representative/_components/competition-cards.tsx
"use client";

import { CompetitionItem } from "@/types";
import { Card, CardBody, Chip, Image } from "@heroui/react";

// src/app/representative/_components/competition-cards.tsx

interface Props {
    paginatedData: CompetitionItem[];
}

export default function CompetitionCards({ paginatedData }: Props) {
    return (
        <>
            {paginatedData.map((c, idx) => (
                <Card key={idx} className="transition-shadow hover:shadow-lg">
                    <CardBody className="space-y-4">
                        <Image alt={c.title} className="w-full rounded-xl object-cover" src={c.image} />
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
