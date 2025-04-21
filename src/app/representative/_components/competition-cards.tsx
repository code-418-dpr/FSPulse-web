import { Card, CardBody, Chip, Image } from "@heroui/react";

export default function CompetitionCards({ paginatedData }: { paginatedData: Record<string, string>[] }) {
    return (
        <>
            {paginatedData.map((competition, index) => (
                <Card key={index} className="transition-shadow hover:shadow-lg">
                    <CardBody className="space-y-4">
                        <Image
                            alt={competition.title}
                            className="w-full rounded-xl object-cover"
                            src={competition.image}
                        />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{competition.title}</h3>
                            <div className="grid grid-cols-2 pt-2">
                                <Chip color="warning" variant="solid">
                                    {competition.status}
                                </Chip>
                                <p className="pt-1 text-right text-sm">{competition.applicationDate}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    );
}
