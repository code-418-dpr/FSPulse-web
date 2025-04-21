// src/app/representative/_components/event-cards.tsx
"use client";

import { EventItem } from "@/types";
import { Card, CardBody, Image } from "@heroui/react";

// src/app/representative/_components/event-cards.tsx

interface EventCardsProps {
    paginatedData: EventItem[];
}

export default function EventCards({ paginatedData }: EventCardsProps) {
    return (
        <>
            {paginatedData.map((event) => (
                <Card key={event.id} className="transition-shadow hover:shadow-lg">
                    <CardBody className="space-y-4">
                        <Image
                            alt={event.name}
                            className="w-full rounded-xl object-cover"
                            src={`data:image/jpeg;base64,${event.imageBase64}`}
                        />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{event.name}</h3>
                            <p>Начало: {new Date(event.start).toLocaleDateString()}</p>
                            <p>Статус: {event.status}</p>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
