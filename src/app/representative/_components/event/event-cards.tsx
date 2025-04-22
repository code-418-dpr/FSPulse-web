// src/app/representative/_components/event/event-cards.tsx
"use client";

import { useState } from "react";

import { EventItem } from "@/types";
import { Card, CardBody, Image } from "@heroui/react";

import EventDialogOrDrawer from "./event-modal-or-drawer";

// src/app/representative/_components/event/event-cards.tsx

// src/app/representative/_components/event/event-cards.tsx

// src/app/representative/_components/event/event-cards.tsx

// src/app/representative/_components/event/event-cards.tsx

// src/app/representative/_components/event/event-cards.tsx

// src/app/representative/_components/event/event-cards.tsx

// src/app/representative/_components/event/event-cards.tsx

interface Props {
    paginatedData: EventItem[];
}

export default function EventCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<EventItem | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (e: EventItem) => {
        setSelected(e);
        setIsOpen(true);
    };

    return (
        <>
            {selected && <EventDialogOrDrawer isOpen={isOpen} onOpenChange={setIsOpen} event={selected} />}
            {paginatedData.map((e) => (
                <Card
                    key={e.id}
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onPress={() => {
                        handleClick(e);
                    }} // switched to onPress
                >
                    <CardBody className="space-y-4">
                        <Image
                            alt={e.name}
                            src={`data:image/jpeg;base64,${e.imageBase64}`}
                            className="w-full rounded-xl object-cover"
                        />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{e.name}</h3>
                            <p>Начало: {new Date(e.start).toLocaleDateString()}</p>
                            <p>Статус: {e.status}</p>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
