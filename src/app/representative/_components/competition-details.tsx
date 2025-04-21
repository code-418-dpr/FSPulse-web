import { Chip, Image } from "@heroui/react";

export default function CompetitionDetails({ competition }: { competition: Record<string, string> }) {
    return (
        <>
            <h3 className="text-2xl font-bold">{competition.title}</h3>
            <Image alt={competition.title} className="w-full rounded-xl object-cover" src={competition.image} />
            <div className="space-y-2">
                <Chip color="success" variant="solid">
                    {competition.format}
                </Chip>
                <Chip color="success" variant="solid">
                    {competition.region}
                </Chip>
                <Chip color="success" variant="solid">
                    {competition.status}
                </Chip>
                <p className="col-span-2 pt-1 text-right text-sm">
                    {competition.startDate} - {competition.endDate}
                </p>
                <p className="col-span-2 pt-1 text-right text-sm">{competition.applicationDate}</p>
                <p className="col-span-2 pt-1 text-right text-sm">{competition.discipline}</p>
            </div>
        </>
    );
}
