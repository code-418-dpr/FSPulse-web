import { Card, CardBody, Chip, Image } from "@heroui/react";

export default function EventCards({ paginatedData }: { paginatedData: Record<string, string>[] }) {
    return (
        <>
            {paginatedData.map((event, index) => (
                <Card key={index} className="transition-shadow hover:shadow-lg">
                    <CardBody className="space-y-4">
                        <Image alt={event.title} className="w-full rounded-xl object-cover" src={event.image} />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{event.title}</h3>
                            <div className="grid grid-cols-3 pt-2">
                                <Chip color="success" variant="solid">
                                    {event.format}
                                </Chip>
                                <p className="col-span-2 pt-1 text-right text-sm">
                                    {event.startDate} - {event.endDate}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
