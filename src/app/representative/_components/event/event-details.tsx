import { Chip, Image } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function EventDetails({ event }: { event: Record<string, string> }) {
    return (
        <>
            <h3 className="text-2xl font-bold">{event.title}</h3>
            <Image alt={event.title} className="w-full rounded-xl object-cover" src={event.image} />
            <div className="grid grid-cols-1 space-y-2">
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Формат проведения:</p>
                    <Chip className="place-self-end" color="success" variant="solid">
                        {event.format}
                    </Chip>
                </div>

                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left text-sm">Регион проведения:</p>
                    <Chip
                        startContent={
                            <span className="flex items-center">
                                <Icon icon="iconoir:map-pin" width={18} height={18} className="mr-1 text-current" />
                            </span>
                        }
                        className="col-span-2 place-self-end"
                        color="success"
                        variant="solid"
                    >
                        {event.region}
                    </Chip>
                </div>

                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left text-sm">Даты проведения:</p>
                    <p className="col-span-2 pt-1 text-right text-sm">
                        {event.startDate} - {event.endDate}
                    </p>
                </div>

                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left text-sm">Дисциплина:</p>
                    <p className="col-span-2 pt-1 text-right text-sm">{event.discipline}</p>
                </div>
            </div>
        </>
    );
}
