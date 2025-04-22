// src/app/representative/_components/competition/competition-cards.tsx
"use client";

import { useState } from "react";

import CompetitionDetails from "@/app/representative/_components/competition/competition-details";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { CompetitionItem } from "@/types";
import { RepresentativeRequestItem } from "@/types/search";
import { Card, CardBody, Chip, Image, useDisclosure } from "@heroui/react";

// src/app/representative/_components/competition/competition-cards.tsx

interface Props {
    paginatedData: RepresentativeRequestItem[];
}

export default function CompetitionCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<RepresentativeRequestItem | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (c: RepresentativeRequestItem) => {
        setSelected(c);
        onOpen();
    };
    const arrayBufferToBase64 = (buffer: Uint8Array) => {
        return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    };
    return (
        <>
            {/* {selected && (
                <ModalOrDrawer isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                    <CompetitionDetails competition={selected} />
                </ModalOrDrawer>
            )} */}
            {paginatedData.map((c, idx) => (
                <Card
                    key={idx}
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onPress={() => {
                        handleClick(c);
                    }} // switched to onPress
                >
                    <CardBody className="space-y-4">
                        <Image
                            alt={c.name}
                            src={arrayBufferToBase64(c.cover)}
                            className="w-full rounded-xl object-cover"
                        />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{c.name}</h3>
                            <div className="grid grid-cols-2 pt-2">
                                <Chip color="warning" variant="solid">
                                    {c.requestStatus}
                                </Chip>
                                <p className="pt-1 text-right text-sm">{c.applicationTime.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
