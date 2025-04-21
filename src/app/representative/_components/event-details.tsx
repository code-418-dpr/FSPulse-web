import { Card, CardBody, CardHeader, Chip, Image } from "@heroui/react";

export default function EventDetails({ event }: { event: Record<string, string> }) {
    return (
        <>
            <Card className="transition-shadow hover:shadow-lg">
                <CardHeader className="text-2xl font-bold">{event.title}</CardHeader>
                <CardBody className="space-y-4">
                    <Image alt={event.title} className="w-full rounded-xl object-cover" src={event.image} />
                    <div className="space-y-2">
                        <Chip color="success" variant="solid">
                            {event.format}
                        </Chip>
                        <Chip color="success" variant="solid">
                            {event.region}
                        </Chip>
                        <p className="col-span-2 pt-1 text-right text-sm">
                            {event.startDate} - {event.endDate}
                        </p>
                        <p className="col-span-2 pt-1 text-right text-sm">{event.discipline}</p>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
