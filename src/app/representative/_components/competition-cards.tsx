import { useState } from "react";

import CompetitionDialogOrDrawer from "@/app/representative/_components/competition-modal-or-drawer";
import { Card, CardBody, Chip, Image } from "@heroui/react";

export default function CompetitionCards({ paginatedData }: { paginatedData: Record<string, string>[] }) {
    const [selectedCompetition, setSelectedCompetition] = useState<Record<string, string> | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleCardClick = (competition: Record<string, string>) => {
        setSelectedCompetition(competition);
        setIsOpen(true);
    };

    return (
        <>
            {selectedCompetition && (
                <CompetitionDialogOrDrawer isOpen={isOpen} onOpenChange={setIsOpen} competition={selectedCompetition} />
            )}
            {paginatedData.map((competition, index) => (
                <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => {
                        handleCardClick(competition);
                    }}
                >
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
                </div>
            ))}
        </>
    );
}
