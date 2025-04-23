"use client";

import { AchievementItem } from "@/types";
import { Chip, Image } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    achievement: AchievementItem;
}

export default function AchievementDetails({ achievement }: Props) {
    return (
        <>
            <h3 className="text-2xl font-bold">{achievement.eventName}</h3>
            <Image
                alt={achievement.eventName}
                src={achievement.imageBase64}
                className="w-full rounded-xl object-cover"
            />
            <div className="grid grid-cols-1 space-y-2">
                {/* FullName */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Название соревнования:</p>
                    <p className="pt-1 text-right text-sm">{achievement.eventName}</p>
                </div>
                {/* Region */}
                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left text-sm">Регион:</p>
                    <Chip
                        startContent={
                            <span className="flex items-center">
                                <Icon icon="iconoir:map-pin" width={18} height={18} className="mr-1" />
                            </span>
                        }
                        className="col-span-2 place-self-end"
                        color="success"
                        variant="bordered"
                    >
                        {achievement.region}
                    </Chip>
                </div>
                {/* Date */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Дата окончания:</p>
                    <p className="pt-1 text-right text-sm">{achievement.date}</p>
                </div>
                {/* Discipline */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Дисциплина:</p>
                    <Chip className="col-span-2 place-self-end" color="success" variant="bordered">
                        {achievement.discipline}
                    </Chip>
                </div>
            </div>
        </>
    );
}
