"use client";

import { TeamItem } from "@/types";
import { Chip, Image } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    team: TeamItem;
}

export default function TeamDetails({ team }: Props) {
    return (
        <>
            <h3 className="text-2xl font-bold">{team.lastname}</h3>
            <Image alt={team.lastname} src={team.imageBase64} className="w-full rounded-xl object-cover" />
            <div className="grid grid-cols-1 space-y-2">
                {/* FullName */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">ФИО:</p>
                    <p className="pt-1 text-right text-sm">
                        {team.firstname} {team.lastname} {team.middlename ?? ""}
                    </p>
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
                        {team.region}
                    </Chip>
                </div>
                {/* Birthday */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Дата рождения:</p>
                    <p className="pt-1 text-right text-sm">{team.birthday}</p>
                </div>
                {/* Status */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left text-sm">Статус:</p>
                    <Chip className="col-span-2 place-self-end" color="success" variant="bordered">
                        {team.status}
                    </Chip>
                </div>
            </div>
        </>
    );
}
